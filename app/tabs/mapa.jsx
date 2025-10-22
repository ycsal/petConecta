import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

// Componente para Web
const WebMapView = ({ location }) => (
  <View style={styles.webContainer}>
    <Text style={styles.title}>🐾 PETCONECTA MAPS</Text>
    <Text style={styles.webTitle}>🗺️ Mapa Disponível no Celular</Text>
    
    <View style={styles.webContent}>
      <Text style={styles.webText}>
        ✅ A funcionalidade de mapa está disponível no app mobile!
      </Text>
      
      {location && (
        <View style={styles.locationBox}>
          <Text style={styles.coordsTitle}>📍 Sua Localização:</Text>
          <Text style={styles.coords}>
            Latitude: {location.coords.latitude.toFixed(6)}
          </Text>
          <Text style={styles.coords}>
            Longitude: {location.coords.longitude.toFixed(6)}
          </Text>
        </View>
      )}
      
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>📱 Para testar no celular:</Text>
        <Text style={styles.instruction}>1. Instale o app "Expo Go"</Text>
        <Text style={styles.instruction}>2. Escaneie o QR Code no terminal</Text>
        <Text style={styles.instruction}>3. O mapa funcionará 100%! 🎉</Text>
      </View>
    </View>
  </View>
);

// Componente para Mobile COM MAPA REAL
const MobileMapView = ({ location }) => {
  const MapView = require('react-native-maps').default;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 PETCONECTA MAPS</Text>
      
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        zoomEnabled={true}
        scrollEnabled={true}
      />

      <View style={styles.infoBox}>
        <Text style={styles.successText}>✅ Localização confirmada!</Text>
        <Text style={styles.coords}>
          📍 {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  );
};

// Componente principal
export default function Mapa() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        console.log('📍 Iniciando busca de localização...');
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setErrorMsg('❌ Permissão de localização negada');
          setIsLoading(false);
          return;
        }

        console.log('✅ Permissão concedida!');
        
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        
        console.log('📍 Localização obtida com sucesso!');
        
      } catch (error) {
        console.error('❌ Erro:', error);
        setErrorMsg('Erro ao obter localização');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Detectar plataforma
  const isWeb = Platform.OS === 'web';
  
  console.log(`🌍 Plataforma: ${Platform.OS}`);
  console.log(`🖥️ É web? ${isWeb}`);

  // Loading
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🐾 PETCONECTA</Text>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Buscando sua localização...</Text>
      </View>
    );
  }

  // Erro
  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🐾 PETCONECTA</Text>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  // Renderizar baseado na plataforma
  return isWeb ? (
    <WebMapView location={location} />
  ) : (
    <MobileMapView location={location} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  webContainer: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 15,
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  webTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4CAF50',
    marginTop: 40,
    marginBottom: 20,
  },
  webContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
    lineHeight: 24,
  },
  locationBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '90%',
  },
  coordsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  coords: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  instructions: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 12,
    width: '90%',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: '#555',
    marginVertical: 3,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    margin: 20,
    borderRadius: 15,
    padding: 30,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  placeholderLoader: {
    marginBottom: 15,
  },
  placeholderInfo: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  coords: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    margin: 20,
  },
});