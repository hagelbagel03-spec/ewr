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
          {/* Visuelle Karten-Darstellung */}
          <View style={styles.mapContainer}>
            {/* Straßen Grid */}
            <View style={styles.streetsGrid}>
              {/* Horizontale Straßen */}
              <View style={[styles.street, styles.streetHorizontal, { top: 60 }]} />
              <View style={[styles.street, styles.streetHorizontal, { top: 120 }]} />
              <View style={[styles.street, styles.streetHorizontal, { top: 180 }]} />
              
              {/* Vertikale Straßen */}
              <View style={[styles.street, styles.streetVertical, { left: 80 }]} />
              <View style={[styles.street, styles.streetVertical, { left: 160 }]} />
              <View style={[styles.street, styles.streetVertical, { left: 240 }]} />
            </View>
            
            {/* Vorfall-Marker */}
            <View style={[styles.incidentMarker, { top: 110, left: 150 }]}>
              <Ionicons name="warning" size={24} color="#FF4444" />
              <Text style={styles.markerLabel}>🚨 VORFALL</Text>
            </View>
            
            {/* Polizeistation */}
            <View style={[styles.policeMarker, { top: 170, left: 220 }]}>
              <Ionicons name="shield" size={20} color="#2196F3" />
              <Text style={styles.markerLabel}>👮 STATION</Text>
            </View>
            
            {/* Standort-Info */}
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>📍 Schwelm Zentrum</Text>
              <Text style={styles.coordinatesText}>51.2878°N, 7.3372°O</Text>
            </View>
          </View>
          
          {/* Karten-Details */}
          <View style={styles.mapDetails}>
            <Text style={[styles.mapTitle, { color: colors.text }]}>
              📍 {incident?.title || 'Vorfall-Standort'}
            </Text>
            <Text style={[styles.mapAddress, { color: colors.textMuted }]}>
              🏢 {incident?.address || incident?.location || 'Adresse nicht verfügbar'}
            </Text>
            <Text style={[styles.priorityText, { 
              color: incident?.priority === 'high' ? '#FF4444' : 
                     incident?.priority === 'medium' ? '#FF9500' : '#00C851'
            }]}>
              ⚠️ Priorität: {incident?.priority === 'high' ? '🚨 HOCH' : 
                            incident?.priority === 'medium' ? '⚠️ MITTEL' : 
                            '✅ NIEDRIG'}
            </Text>
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

  mapIcon: {
    marginBottom: 16,
  },

  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },

  mapAddress: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  mapInfo: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
    opacity: 0.7,
  },

  mapLegend: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  legendItem: {
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 8,
  },

  loadingText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default GoogleMapsView;