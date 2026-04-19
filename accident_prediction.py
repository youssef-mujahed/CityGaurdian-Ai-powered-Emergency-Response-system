import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import joblib
import os

def main():
    print("--- Accident Prediction Module Pipeline ---")
    
    # 1. Load the dataset
    print("\n1. Loading the dataset...")
    data_path = 'US_Accidents_March23_sampled_500k.csv'
    
    # Features mentioned in the requirements
    selected_columns = [
        'Start_Lat', 'Start_Lng', 'City', 'State', 'Temperature(F)', 
        'Humidity(%)', 'Visibility(mi)', 'Wind_Speed(mph)', 'Precipitation(in)', 
        'Weather_Condition', 'Traffic_Signal', 'Crossing', 'Junction', 
        'Sunrise_Sunset', 'Severity'
    ]
    
    # Using 'usecols' to save RAM, reading only what we need
    # We use a lambda to avoid errors if a column name has a slight typo in the CSV
    df = pd.read_csv(data_path, usecols=lambda c: c in selected_columns)
    print(f"Dataset loaded with shape: {df.shape}")
    
    # Exploratory Data Analysis (EDA) basic output
    print("\n--- Dataset Info ---")
    print(df.info())
    print("\n--- Class Distribution (Severity) ---")
    print(df['Severity'].value_counts())
    
    # 2. Clean missing values
    print("\n2. Cleaning missing values...")
    # Fill missing values for numerical features with the median
    num_cols = df.select_dtypes(include=['float64', 'int64']).columns.drop('Severity', errors='ignore')
    for col in num_cols:
        df[col] = df[col].fillna(df[col].median())
        
    # Fill missing values for categorical features with the mode (most frequent value)
    cat_cols = df.select_dtypes(include=['object', 'bool']).columns
    for col in cat_cols:
        df[col] = df[col].fillna(df[col].mode()[0])
        
    print(f"Missing values handled. Remaining total nulls: {df.isnull().sum().sum()}")
    
    # 3. Select the most important features
    # We already filtered the dataset on load, but we separate features (X) and target (y)
    print("\n3. Separating Features and Target...")
    X = df.drop('Severity', axis=1)
    y = df['Severity']
    
    # 4. Encode categorical variables
    print("\n4. Encoding categorical variables...")
    # Using LabelEncoder for variables like City, State, Weather_Condition
    label_encoders = {}
    for col in cat_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        label_encoders[col] = le
    print("Categorical features encoded successfully.")
    
    # 5. Split the dataset into train and test sets
    print("\n5. Splitting data into train and test sets...")
    # 80% for training, 20% for testing. Stratify=y keeps class ratios balanced in train and test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Test set: {X_test.shape[0]} samples")
    
    # 6. Train a Random Forest model
    print("\n6. Training Random Forest Classifier...")
    # Limiting depth and n_jobs=-1 to utilize all CPU cores, adding class_weight='balanced' for class imbalance!
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=20, random_state=42, n_jobs=-1, class_weight='balanced')
    rf_model.fit(X_train, y_train)
    print("Model training completed.")
    
    # 7. Evaluate model performance using accuracy and confusion matrix
    print("\n7. Evaluating model performance...")
    y_pred = rf_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)
    
    print(f"\nModel Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))
    
    # Plotting and saving confusion matrix
    plt.figure(figsize=(8, 6))
    sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Oranges')
    plt.title('Confusion Matrix - Accident Severity')
    plt.ylabel('Actual Severity')
    plt.xlabel('Predicted Severity')
    plt.tight_layout()
    plt.savefig('confusion_matrix.png')
    print("Confusion matrix saved as 'confusion_matrix.png'")
    
    # 8. Show feature importance
    print("\n8. Calculating feature importance...")
    feature_importances = pd.Series(rf_model.feature_importances_, index=X.columns)
    feature_importances = feature_importances.sort_values(ascending=True) # Ascending for horizontal bar chart
    
    # Plotting feature importance
    plt.figure(figsize=(10, 8))
    feature_importances.plot(kind='barh', color='skyblue')
    plt.title('Feature Importance in Accident Severity Prediction')
    plt.xlabel('Importance Score')
    plt.tight_layout()
    plt.savefig('feature_importance.png')
    print("Feature importance plot saved as 'feature_importance.png'")
    
    # 9. Save the trained model
    print("\n9. Saving the trained model...")
    model_filename = 'accident_severity_rf_model.pkl'
    joblib.dump(rf_model, model_filename)
    
    # We also save the label encoders and feature names for future inference
    pipeline_data = {
        'label_encoders': label_encoders,
        'feature_names': list(X.columns)
    }
    joblib.dump(pipeline_data, 'pipeline_data.pkl')
    
    print(f"Model successfully saved as '{model_filename}'")
    print("Encoders and feature names saved as 'pipeline_data.pkl'")
    print("\nPipeline execution finished successfully.")

if __name__ == '__main__':
    main()
