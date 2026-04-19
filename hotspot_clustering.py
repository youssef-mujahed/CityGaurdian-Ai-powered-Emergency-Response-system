import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import MiniBatchKMeans
import json

def main():
    print("--- Accident Hotspot (High-Risk Zone) Generator ---")
    
    # 1. Load the dataset (we only need location and severity)
    print("\n1. Loading historical accident data...")
    data_path = 'US_Accidents_March23_sampled_500k.csv'
    
    selected_columns = ['Start_Lat', 'Start_Lng', 'Severity', 'City', 'State']
    df = pd.read_csv(data_path, usecols=selected_columns)
    
    # Drop rows with missing coordinates
    df = df.dropna(subset=['Start_Lat', 'Start_Lng'])
    
    # 2. Filter for HIGH SEVERITY accidents only
    # To find true "High-Risk Zones", we shouldn't necessarily cluster minor fender-benders
    print("2. Filtering for high severity accidents (Severity 3 & 4)...")
    severe_df = df[df['Severity'] >= 3].copy()
    print(f"Total severe accidents found: {len(severe_df)}")
    
    # 3. Clustering the coordinates to find Hotspots
    # We use MiniBatchKMeans which is very fast for large datasets.
    # We'll ask it to find the top 50 most dangerous hotspots nationally.
    print("\n3. Clustering locations to identify 50 primary hotspots...")
    
    num_hotspots = 50
    kmeans = MiniBatchKMeans(n_clusters=num_hotspots, random_state=42, batch_size=1000, n_init=3)
    
    # Fit the model on the coordinates
    coords = severe_df[['Start_Lat', 'Start_Lng']]
    severe_df['Cluster_ID'] = kmeans.fit_predict(coords)
    
    # The cluster centers are our "Hotspot" locations
    hotspot_centers = kmeans.cluster_centers_
    
    # 4. Analyze each hotspot
    print("\n4. Analyzing hotspot severity and frequency...")
    hotspots_data = []
    
    for i in range(num_hotspots):
        # Get all accidents in this cluster
        cluster_accidents = severe_df[severe_df['Cluster_ID'] == i]
        
        # Determine the most common city/state for this cluster
        if not cluster_accidents.empty:
            primary_city = cluster_accidents['City'].mode()[0] if not cluster_accidents['City'].mode().empty else "Unknown"
            primary_state = cluster_accidents['State'].mode()[0] if not cluster_accidents['State'].mode().empty else "Unknown"
        else:
            primary_city, primary_state = "Unknown", "Unknown"
            
        hotspot_info = {
            'hotspot_id': i + 1,
            'latitude': round(hotspot_centers[i][0], 5),
            'longitude': round(hotspot_centers[i][1], 5),
            'total_severe_accidents': len(cluster_accidents),
            'location': f"{primary_city}, {primary_state}",
            'risk_level': 'CRITICAL' if len(cluster_accidents) > 500 else 'HIGH'
        }
        hotspots_data.append(hotspot_info)
        
    # Sort hotspots by the number of accidents (most dangerous first)
    hotspots_data = sorted(hotspots_data, key=lambda x: x['total_severe_accidents'], reverse=True)
    
    # Print top 5 hotspots
    print("\n=== TOP 5 MOST DANGEROUS HOTSPOTS ===")
    for h in hotspots_data[:5]:
        print(f"Hotspot {h['hotspot_id']}: {h['location']} | Accidents: {h['total_severe_accidents']} | GPS: [{h['latitude']}, {h['longitude']}]")
        
    # 5. Export to JSON for the Web Dashboard
    print("\n5. Exporting Hotspots data for Web Dashboard map integration...")
    output_filename = 'high_risk_hotspots.json'
    with open(output_filename, 'w') as f:
        json.dump(hotspots_data, f, indent=4)
        
    print(f"✅ Successfully saved {num_hotspots} hotspot coordinates to '{output_filename}'")
    
    # 6. Visualize Hotspots on a scatter plot
    plt.figure(figsize=(12, 8))
    # Plot all severe accidents lightly
    plt.scatter(severe_df['Start_Lng'], severe_df['Start_Lat'], c='gray', alpha=0.1, s=1, label='Severe Accidents')
    # Plot hotspot centers prominently
    lats = [h['latitude'] for h in hotspots_data]
    lngs = [h['longitude'] for h in hotspots_data]
    plt.scatter(lngs, lats, c='red', marker='X', s=200, label='Identified Hotspots (Centroids)')
    
    plt.title('High-Risk Accident Hotspots (Severity 3 & 4)')
    plt.xlabel('Longitude')
    plt.ylabel('Latitude')
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.5)
    plt.tight_layout()
    plt.savefig('hotspots_map.png')
    print("✅ Visual map saved as 'hotspots_map.png'")

if __name__ == '__main__':
    main()
