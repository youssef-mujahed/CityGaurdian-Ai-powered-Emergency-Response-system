import joblib
import pandas as pd
import warnings

# Suppress sklearn warnings about feature names
warnings.filterwarnings("ignore", category=UserWarning)

def main():
    print("--- Accident Prediction Model Test ---")
    
    # 1. Load the model and preprocessing tools
    print("Loading model and encoders from disk...")
    try:
        rf_model = joblib.load('accident_severity_rf_model.pkl')
        pipeline_data = joblib.load('pipeline_data.pkl')
        label_encoders = pipeline_data['label_encoders']
        feature_names = pipeline_data['feature_names']
    except FileNotFoundError:
        print("Error: Model files not found. Please ensure the training script has completed successfully.")
        return

    # 2. Define a real-time event (mockup)
    # This represents data that might come from your Web Dashboard or traffic sensors
    incoming_event = {
        'Start_Lat': 34.0522, 
        'Start_Lng': -118.2437, 
        'City': 'Los Angeles', 
        'State': 'CA',
        'Temperature(F)': 65.0, 
        'Humidity(%)': 50.0, 
        'Visibility(mi)': 10.0, 
        'Wind_Speed(mph)': 5.0, 
        'Precipitation(in)': 0.0, 
        'Weather_Condition': 'Heavy Rain', # Trying extreme weather 
        'Traffic_Signal': True, 
        'Crossing': False, 
        'Junction': True, 
        'Sunrise_Sunset': 'Night' # Night time
    }
    
    # Convert to DataFrame to match the format expected by our encoders/model
    df_event = pd.DataFrame([incoming_event])
    
    print("\n[Input Event Data]")
    for key, value in incoming_event.items():
        print(f"  {key}: {value}")

    # 3. Preprocess the data just like we did during training
    for col, le in label_encoders.items():
        if col in df_event.columns:
            # Handle categories not seen during training gracefully
            # In a robust production system, you'd handle unseen labels better
            # but for this test we encode it using the saved LabelEncoder
            try:
                df_event[col] = le.transform(df_event[col].astype(str))
            except ValueError:
                # If a completely new city/weather appears, default to the most common (mode) safely encoded, 
                # or here we just use the first encoded class (0) as a fallback
                df_event[col] = 0

    # Ensure columns are in the exact same order as training
    df_event = df_event[feature_names]

    # 4. Predict Risk Severity
    print("\nPredicting Severity...")
    severity = rf_model.predict(df_event)
    probabilities = rf_model.predict_proba(df_event)[0]
    
    print(f"\n==========================================")
    print(f"🔥 PREDICTED RISK SEVERITY SCORE: {severity[0]} 🔥")
    print(f"==========================================")
    
    print("\nConfidence levels per severity tier:")
    print(f"Severity 1 (Minor): {probabilities[0]*100:.1f}%")
    print(f"Severity 2 (Moderate): {probabilities[1]*100:.1f}%")
    print(f"Severity 3 (Severe): {probabilities[2]*100:.1f}%")
    print(f"Severity 4 (Critical): {probabilities[3]*100:.1f}%")

if __name__ == '__main__':
    main()
