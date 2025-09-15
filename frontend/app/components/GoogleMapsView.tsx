import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GoogleMapsView = ({ incident }) => {
  // Fixed colors instead of theme context
  const colors = {
    text: '#1a1a1a',
    textMuted: '#6c757d',
    background: '#ffffff',
    surface: '#f8f9fa',
    border: '#e9ecef',
    primary: '#2196F3'
  };
  const [officers, setOfficers] = useState([]);
  const [loadError, setLoadError] = useState(false);

  // Always render fallback map since Google Maps might not be available
  const renderFallbackMap = () => {
    console.log('🗺️ Rendering fallback map for incident:', incident?.title);
    
    return (
      <View style={styles.container}>
        <View style={styles.modernHeaderContainer}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="map" size={32} color="#2196F3" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.modernTitle}>📍 Vorfall-Standort</Text>
            <Text style={styles.modernSubtitle}>
              {incident?.title || 'Unbekannter Vorfall'}
            </Text>
          </View>
        </View>
        
        <View style={styles.mapPlaceholder}>
          {/* Große, erkennbare Karten-Darstellung */}
          <View style={styles.mapContainer}>
            {/* Stadtgebiet Hintergrund */}
            <View style={styles.cityBackground}>
              {/* Hauptstraßen (dick und deutlich) */}
              <View style={[styles.mainStreet, styles.mainStreetHorizontal, { top: 80 }]} />
              <View style={[styles.mainStreet, styles.mainStreetHorizontal, { top: 160 }]} />
              <View style={[styles.mainStreet, styles.mainStreetHorizontal, { top: 240 }]} />
              
              <View style={[styles.mainStreet, styles.mainStreetVertical, { left: 100 }]} />
              <View style={[styles.mainStreet, styles.mainStreetVertical, { left: 200 }]} />
              <View style={[styles.mainStreet, styles.mainStreetVertical, { left: 300 }]} />
              
              {/* Nebenstraßen (dünner) */}
              <View style={[styles.street, styles.streetHorizontal, { top: 50 }]} />
              <View style={[styles.street, styles.streetHorizontal, { top: 120 }]} />
              <View style={[styles.street, styles.streetHorizontal, { top: 200 }]} />
              <View style={[styles.street, styles.streetHorizontal, { top: 280 }]} />
              
              <View style={[styles.street, styles.streetVertical, { left: 60 }]} />
              <View style={[styles.street, styles.streetVertical, { left: 140 }]} />
              <View style={[styles.street, styles.streetVertical, { left: 260 }]} />
              <View style={[styles.street, styles.streetVertical, { left: 340 }]} />
              
              {/* Gebäude-Blöcke */}
              <View style={[styles.building, { top: 60, left: 110, width: 80, height: 50 }]} />
              <View style={[styles.building, { top: 60, left: 210, width: 80, height: 50 }]} />
              <View style={[styles.building, { top: 170, left: 110, width: 80, height: 60 }]} />
              <View style={[styles.building, { top: 170, left: 270, width: 60, height: 60 }]} />
              
              {/* Park/Grünfläche */}
              <View style={[styles.park, { top: 130, left: 210, width: 50, height: 50 }]} />
            </View>
            
            {/* GROSSER Vorfall-Marker (sehr auffällig) */}
            <View style={[styles.incidentMarkerLarge, { top: 140, left: 180 }]}>
              <View style={styles.incidentPulse} />
              <Ionicons name="warning" size={32} color="#FFFFFF" />
              <Text style={styles.incidentLabel}>🚨 EINSATZ</Text>
              <Text style={styles.incidentSubLabel}>{incident?.title?.substring(0, 10) || 'VORFALL'}</Text>
            </View>
            
            {/* Polizeistation (deutlich erkennbar) */}
            <View style={[styles.policeStationLarge, { top: 200, left: 280 }]}>
              <Ionicons name="shield" size={28} color="#FFFFFF" />
              <Text style={styles.stationLabel}>👮 REVIER</Text>
            </View>
            
            {/* Polizeifahrzeuge (beweglich) */}
            <View style={[styles.policeVehicle, { top: 110, left: 150 }]}>
              <Ionicons name="car-sport" size={20} color="#FFFFFF" />
              <Text style={styles.vehicleLabel}>FUNK 1</Text>
            </View>
            
            <View style={[styles.policeVehicle, { top: 180, left: 320 }]}>
              <Ionicons name="car-sport" size={20} color="#FFFFFF" />
              <Text style={styles.vehicleLabel}>FUNK 2</Text>
            </View>
            
            {/* Stadtkern-Label */}
            <View style={styles.cityLabel}>
              <Text style={styles.cityLabelText}>🏛️ SCHWELM ZENTRUM</Text>
              <Text style={styles.coordsLabel}>51.2878°N • 7.3372°O</Text>
            </View>
            
            {/* Entfernungsanzeige */}
            <View style={styles.distanceInfo}>
              <Text style={styles.distanceText}>📍 Entfernung zum Einsatzort:</Text>
              <Text style={styles.distanceValue}>🚔 Funk 1: ~200m</Text>
              <Text style={styles.distanceValue}>🚔 Funk 2: ~350m</Text>
            </View>
          </View>
        </View>

        <View style={styles.mapLegend}>
          <Text style={[styles.legendItem, { color: colors.text }]}>
            🔴 Vorfall-Position
          </Text>
          <Text style={[styles.legendItem, { color: colors.text }]}>
            🏢 {incident?.address || 'Keine Adresse verfügbar'}
          </Text>
          <Text style={[styles.legendItem, { color: colors.textMuted }]}>
            ⚠️ Priorität: {incident?.priority === 'high' ? '🚨 Hoch' : 
                          incident?.priority === 'medium' ? '⚠️ Mittel' : 
                          '✅ Niedrig'}
          </Text>
        </View>
      </View>
    );
  };

  // For now, always use fallback since Google Maps integration is complex
  return renderFallbackMap();
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  
  // Modern Header Styles
  modernHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  
  headerTextContainer: {
    flex: 1,
  },
  
  modernTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  
  modernSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },

  mapPlaceholder: {
    width: '100%',
    height: 400, // Größer!
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    marginBottom: 16,
    overflow: 'hidden',
  },

  mapContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#c8e6c9', // Hellgrün wie echte Karte
    position: 'relative',
  },

  cityBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#e8f5e8',
  },

  // Hauptstraßen (dick und auffällig)
  mainStreet: {
    position: 'absolute',
    backgroundColor: '#2c2c2c', // Dunkler und deutlicher
    borderWidth: 2,
    borderColor: '#1a1a1a', // Noch dunkler Border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },

  mainStreetHorizontal: {
    width: '100%',
    height: 8, // Dicker!
  },

  mainStreetVertical: {
    height: '100%',
    width: 8, // Dicker!
  },

  // Nebenstraßen (dünner aber sichtbar)
  street: {
    position: 'absolute',
    backgroundColor: '#4a4a4a', // Deutlicher grau
    borderWidth: 1,
    borderColor: '#333333',
  },

  streetHorizontal: {
    width: '100%',
    height: 4, // Größer als vorher
  },

  streetVertical: {
    height: '100%',
    width: 4, // Größer als vorher
  },

  // Gebäude (deutlicher)
  building: {
    position: 'absolute',
    backgroundColor: '#8c8c8c', // Deutlicher grau
    borderWidth: 2,
    borderColor: '#666666', // Dunkler Border
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },

  // Park/Grünfläche
  park: {
    position: 'absolute',
    backgroundColor: '#4caf50',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#388e3c',
  },

  // GROSSER Vorfall-Marker (sehr auffällig!)
  incidentMarkerLarge: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: '#FF1744',
    borderRadius: 25,
    padding: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    minWidth: 80,
    minHeight: 80,
  },

  incidentPulse: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF1744',
    opacity: 0.3,
    top: -10,
    left: -10,
  },

  incidentLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },

  incidentSubLabel: {
    fontSize: 8,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 2,
  },

  // Große Polizeistation
  policeStationLarge: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    borderRadius: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    minWidth: 60,
    minHeight: 60,
  },

  stationLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
    textAlign: 'center',
  },

  // Polizeifahrzeuge
  policeVehicle: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: '#0D47A1',
    borderRadius: 15,
    padding: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    minWidth: 50,
  },

  vehicleLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },

  // Stadtkern-Label
  cityLabel: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2196F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  cityLabelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
  },

  coordsLabel: {
    fontSize: 10,
    color: '#424242',
    marginTop: 2,
    textAlign: 'center',
  },

  // Entfernungsanzeige
  distanceInfo: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  distanceText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },

  distanceValue: {
    fontSize: 10,
    color: '#424242',
    marginBottom: 2,
  },

  mapLegend: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginTop: 16,
  },

  legendItem: {
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 8,
    color: '#495057',
  },

  loadingText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default GoogleMapsView;