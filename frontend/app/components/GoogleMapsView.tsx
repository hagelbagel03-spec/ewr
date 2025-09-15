import React, { useState, useEffect } from 'react';
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

  const [mapLoaded, setMapLoaded] = useState(false);

  // Get coordinates from incident
  const getCoordinates = () => {
    if (incident?.location?.lat && incident?.location?.lng) {
      return {
        lat: parseFloat(incident.location.lat),
        lng: parseFloat(incident.location.lng)
      };
    }
    if (incident?.coordinates?.lat && incident?.coordinates?.lng) {
      return {
        lat: parseFloat(incident.coordinates.lat),
        lng: parseFloat(incident.coordinates.lng)
      };
    }
    // Fallback: Schwelm coordinates
    return {
      lat: 51.2878,
      lng: 7.3372
    };
  };

  const coordinates = getCoordinates();

  useEffect(() => {
    // Try to load Google Maps
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
        initializeMap();
      };
      script.onerror = () => {
        console.log('Google Maps failed to load, using fallback');
        setMapLoaded(false);
      };
      document.head.appendChild(script);
    } else if (window.google) {
      setMapLoaded(true);
      initializeMap();
    }
  }, [incident]);

  const initializeMap = () => {
    if (!window.google) return;

    const mapElement = document.getElementById('google-map-real');
    if (!mapElement) return;

    const map = new window.google.maps.Map(mapElement, {
      center: coordinates,
      zoom: 16,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'poi.business',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // Add incident marker
    new window.google.maps.Marker({
      position: coordinates,
      map: map,
      title: incident?.title || 'Vorfall',
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#FF4444" stroke="#FFFFFF" stroke-width="4"/>
            <text x="20" y="26" text-anchor="middle" fill="white" font-size="20" font-weight="bold">!</text>
          </svg>
        `)}`,
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });

    // Info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; max-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #FF4444;">🚨 ${incident?.title || 'Vorfall'}</h3>
          <p style="margin: 0 0 4px 0;"><strong>Adresse:</strong> ${incident?.address || incident?.location || 'Unbekannt'}</p>
          <p style="margin: 0 0 4px 0;"><strong>Priorität:</strong> ${incident?.priority || 'Normal'}</p>
          <p style="margin: 0; font-size: 12px; color: #666;">
            📍 ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}
          </p>
        </div>
      `
    });

    // Show info window immediately
    infoWindow.open(map);
  };

  // Fallback when Google Maps is not available
  const renderFallback = () => (
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
      
      <View style={styles.mapFallback}>
        <Ionicons name="location" size={64} color="#2196F3" style={{ marginBottom: 16 }} />
        <Text style={[styles.fallbackTitle, { color: colors.text }]}>
          🗺️ Google Maps nicht verfügbar
        </Text>
        <Text style={[styles.fallbackText, { color: colors.text }]}>
          📍 <Text style={{ fontWeight: '600' }}>Adresse:</Text> {incident?.address || incident?.location || 'Nicht verfügbar'}
        </Text>
        <Text style={[styles.fallbackText, { color: colors.textMuted }]}>
          🌍 <Text style={{ fontWeight: '600' }}>Koordinaten:</Text> {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
        </Text>
        <Text style={[styles.fallbackText, { color: colors.textMuted }]}>
          ⚠️ <Text style={{ fontWeight: '600' }}>Priorität:</Text> {incident?.priority || 'Normal'}
        </Text>
        
        {/* Maps Link */}
        <View style={styles.mapsLinkContainer}>
          <Text style={[styles.fallbackText, { color: colors.primary, fontWeight: '600' }]}>
            🔗 In Google Maps öffnen:
          </Text>
          <Text 
            style={[styles.mapsLink, { color: colors.primary }]}
            onPress={() => {
              const url = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
              if (typeof window !== 'undefined') {
                window.open(url, '_blank');
              }
            }}
          >
            📱 Google Maps Link
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.modernHeaderContainer}>
        <View style={styles.headerIconContainer}>
          <Ionicons name="map" size={32} color="#2196F3" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.modernTitle}>🗺️ Standort-Karte</Text>
          <Text style={styles.modernSubtitle}>
            {incident?.title || 'Vorfall-Position'}
          </Text>
        </View>
      </View>

      {/* OpenStreetMap Embed (funktioniert ohne API Key) */}
      <div style={{
        width: '100%',
        height: 300,
        borderRadius: 12,
        border: '2px solid #e9ecef',
        overflow: 'hidden'
      }}>
        <iframe
          width="100%"
          height="300"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`}
          style={{ border: 0 }}
        />
      </div>

      <View style={styles.mapInfo}>
        <Text style={[styles.infoText, { color: colors.text }]}>
          📍 {incident?.address || incident?.location || 'Adresse nicht verfügbar'}
        </Text>
        <Text style={[styles.infoText, { color: colors.textMuted }]}>
          🌍 {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
        </Text>
        <Text 
          style={[styles.infoText, { color: colors.primary, textDecorationLine: 'underline' }]}
          onPress={() => {
            const url = `https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}`;
            window.open(url, '_blank');
          }}
        >
          📱 In Google Maps öffnen
        </Text>
      </View>
    </View>
  );
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

  // New styles for Google Maps integration
  mapFallback: {
    width: '100%',
    height: 300,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
  },

  fallbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },

  fallbackText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 20,
  },

  mapsLinkContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },

  mapsLink: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 4,
  },

  mapInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginTop: 8,
  },

  infoText: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
});

export default GoogleMapsView;