import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import json
import os

def main():
    print("--- Traffic Pattern & Analytics Generator ---")
    
    # 1. Load the dataset (loading the columns that describe conditions)
    print("\n1. Loading historical accident data for analysis...")
    data_path = 'US_Accidents_March23_sampled_500k.csv'
    
    # We want features that explain *why* or *when* an accident happens
    selected_columns = [
        'Severity', 'Temperature(F)', 'Visibility(mi)', 'Weather_Condition', 
        'Traffic_Signal', 'Junction', 'Crossing', 'Sunrise_Sunset'
    ]
    
    df = pd.read_csv(data_path, usecols=selected_columns)
    
    # 2. Extracting Key Traffic Patterns
    print("\n2. Analyzing historical patterns...")
    
    analytics_data = {
        "total_records_analyzed": int(len(df)),
        "patterns": {}
    }
    
    # Pattern A: Day vs Night comparison for Severe Accidents (Severity >= 3)
    severe_df = df[df['Severity'] >= 3]
    time_of_day_counts = severe_df['Sunrise_Sunset'].value_counts()
    
    analytics_data['patterns']['time_of_day_risk'] = {
        "Day": int(time_of_day_counts.get('Day', 0)),
        "Night": int(time_of_day_counts.get('Night', 0)),
        "insight": "Nighttime driving significantly increases the probability of severe accidents due to reduced visibility." 
                   if time_of_day_counts.get('Night', 0) > time_of_day_counts.get('Day', 0) * 0.5 
                   else "Daytime sees more total severe accidents, likely due to much higher traffic volume."
    }
    
    # Pattern B: Top 5 Most Dangerous Weather Conditions
    weather_risk = severe_df['Weather_Condition'].value_counts().head(5)
    analytics_data['patterns']['hazardous_weather'] = {
        str(k): int(v) for k, v in weather_risk.items()
    }
    analytics_data['patterns']['hazardous_weather']['insight'] = f"'{weather_risk.index[0]}' represents the most frequent weather condition during severe accidents."
    
    # Pattern C: Infrastructure Risks (Junctions, Crossings, Traffic Signals)
    # We look at the percentage of severe accidents that happened at these locations
    total_severe = len(severe_df)
    analytics_data['patterns']['infrastructure_involvement'] = {
        "at_junction": round((severe_df['Junction'] == True).sum() / total_severe * 100, 1),
        "at_crossing": round((severe_df['Crossing'] == True).sum() / total_severe * 100, 1),
        "at_traffic_signal": round((severe_df['Traffic_Signal'] == True).sum() / total_severe * 100, 1)
    }
    
    # 3. Generating Recommendations (Decision-Making Support)
    print("\n3. Generating Actionable Recommendations for Traffic Authorities...")
    
    recommendations = []
    
    # Rule 1: High percentage of junction accidents
    if analytics_data['patterns']['infrastructure_involvement']['at_junction'] > 15.0:
        recommendations.append({
            "category": "Infrastructure",
            "priority": "HIGH",
            "action": "Junction Safety Review",
            "reason": f"{analytics_data['patterns']['infrastructure_involvement']['at_junction']}% of severe accidents happen at junctions. Consider installing roundabouts or improved signage at top hotspots."
        })
        
    # Rule 2: Nighttime danger
    if analytics_data['patterns']['time_of_day_risk']['Night'] > (total_severe * 0.3):
        recommendations.append({
            "category": "Visibility",
            "priority": "HIGH",
            "action": "Street Lighting Enhancement",
            "reason": "Over 30% of severe accidents occur at night. Deploy reflective road markers and upgrade street lights in identified dark zones."
        })
        
    # Rule 3: Weather dangers (if Rain/Snow/Fog is in top 3)
    top_weather = list(weather_risk.index[:3])
    bad_weather_keywords = ['Rain', 'Snow', 'Fog', 'Ice', 'Storm']
    found_bad_weather = [w for w in top_weather if any(keyword in str(w) for keyword in bad_weather_keywords)]
    
    if found_bad_weather:
        recommendations.append({
            "category": "Weather Alerting",
            "priority": "MEDIUM",
            "action": "Dynamic Speed Limits",
            "reason": f"Hazardous weather ({', '.join(found_bad_weather)}) strongly correlates with severe crashes. Implement digital signs that automatically reduce speed limits during these conditions."
        })

    analytics_data['recommendations'] = recommendations
    
    # 4. Preview the output
    print(json.dumps(analytics_data, indent=4))
    
    # 5. Export JSON for the Web Dashboard Analytics Page
    print("\n4. Exporting data for Dashboard Analytics Page...")
    with open('traffic_analytics.json', 'w') as f:
        json.dump(analytics_data, f, indent=4)
    print("✅ Successfully saved analytics report to 'traffic_analytics.json'")
    
    # 6. Generate some quick Dashboard Charts using Matplotlib
    print("Generating Dashboard Chart Visuals...")
    
    # Chart 1: Weather Conditions Bar Chart
    plt.figure(figsize=(10, 6))
    sns.barplot(x=weather_risk.values, y=weather_risk.index, palette='Reds_r')
    plt.title('Top 5 Weather Conditions During Severe Accidents', fontsize=14)
    plt.xlabel('Number of Severe Accidents')
    plt.ylabel('Weather Condition')
    plt.tight_layout()
    plt.savefig('chart_weather_risk.png')
    
    # Chart 2: Infrastructure Pie Chart
    plt.figure(figsize=(8, 8))
    infra_data = [
        (severe_df['Junction'] == True).sum(),
        (severe_df['Traffic_Signal'] == True).sum(),
        (severe_df['Crossing'] == True).sum(),
    ]
    labels = ['Junctions', 'Traffic Signals', 'Crossings']
    colors = ['#ff9999','#66b3ff','#99ff99']
    
    plt.pie(infra_data, labels=labels, colors=colors, autopct='%1.1f%%', startangle=90, wedgeprops={'edgecolor': 'black'})
    plt.title('Severe Accidents Involving Infrastructure', fontsize=14)
    plt.tight_layout()
    plt.savefig('chart_infrastructure_risk.png')
    
    print("✅ Visual charts saved as 'chart_weather_risk.png' and 'chart_infrastructure_risk.png'")

if __name__ == '__main__':
    main()
