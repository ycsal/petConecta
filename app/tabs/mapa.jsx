import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';


// Componente para Web
const WebMapView = ({ location, onAddressChange }) => (
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
          <TouchableOpacity style={styles.changeAddressButton} onPress={onAddressChange}>
            <Text style={styles.changeAddressText}>✏️ Alterar Endereço</Text>
          </TouchableOpacity>
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

// Modal para alterar endereço
const AddressModal = ({ visible, onClose, onConfirm, currentLocation }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!address.trim()) {
      Alert.alert('Erro', 'Por favor, digite um endereço válido');
      return;
    }

    setLoading(true);
    try {
      // Usar Google Geocoding API para converter endereço em coordenadas
      const API_KEY = 'AIzaSyApGDpNKditZOFLwLxkSdG4oVRUtCP2OWA';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const newLocation = {
          coords: {
            latitude: location.lat,
            longitude: location.lng,
            altitude: null,
            accuracy: 100,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        };
        
        onConfirm(newLocation);
        setAddress('');
        onClose();
      } else {
        Alert.alert('Erro', 'Endereço não encontrado. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      Alert.alert('Erro', 'Não foi possível encontrar o endereço. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Alterar Endereço</Text>
          
          <Text style={styles.modalSubtitle}>
            Localização atual:{'\n'}
            {currentLocation?.coords.latitude.toFixed(6)}, {currentLocation?.coords.longitude.toFixed(6)}
          </Text>
          
          <TextInput
            style={styles.addressInput}
            placeholder="Digite seu endereço completo (ex: Rua ABC, 123 - São Paulo, SP)"
            value={address}
            onChangeText={setAddress}
            multiline={true}
            numberOfLines={3}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.confirmButton, loading && styles.disabledButton]} 
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Componente para Mobile COM DADOS REAIS
const MobileMapView = ({ location, onLocationChange }) => {
  const [activeFilter, setActiveFilter] = useState('tudo');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true); // Estado para controlar se o painel está aberto

  const filters = [
    { id: 'tudo', label: 'Tudo' },
    { id: 'abrigo', label: 'Abrigos' },
    { id: 'encontrado', label: 'Pets Encontrados' },
    { id: 'clinica', label: 'Clínicas' },
    { id: 'petshop', label: 'Petshops' },
    { id: 'servicos', label: 'Serviços' }
  ];

  // Buscar lugares reais do Google Maps
  const fetchNearbyPlaces = async (type) => {
    if (type === 'encontrado') {
      setPlaces([]); // Pets encontrados ainda não implementados
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const API_KEY = 'AIzaSyApGDpNKditZOFLwLxkSdG4oVRUtCP2OWA';
      
      let keywords = [];
      
      if (type === 'tudo') {
        // Para "Tudo", busca todos os tipos
        keywords = [
          'veterinary+clinic+vet+clínica+veterinária',
          'pet+store+pet+shop+petshop+loja+animal',
          'animal+shelter+abrigo+animal',
          'pet+hotel+hotel+animal+pet+taxi+táxi+animal+dog+walker+passeador+adestrador+dog+trainer'
        ];
      } else {
        // Para filtros específicos
        switch (type) {
          case 'abrigo':
            keywords = ['animal+shelter+abrigo+animal'];
            break;
          case 'clinica':
            keywords = ['veterinary+clinic+vet+clínica+veterinária'];
            break;
          case 'petshop':
            keywords = ['pet+store+pet+shop+petshop+loja+animal'];
            break;
          case 'servicos':
            keywords = ['pet+hotel+hotel+animal+pet+taxi+táxi+animal+dog+walker+passeador+adestrador+dog+trainer'];
            break;
        }
      }

      const radius = 5000; // 5km
      const locationStr = `${location.coords.latitude},${location.coords.longitude}`;
      
      let allResults = [];
      
      // Para "Tudo", faz múltiplas buscas
      if (type === 'tudo') {
        for (const keyword of keywords) {
          const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${locationStr}&radius=${radius}&keyword=${keyword}&key=${API_KEY}`;
          
          try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.results) {
              const placesData = data.results.map(place => ({
                id: place.place_id,
                name: place.name,
                address: place.vicinity,
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
                rating: place.rating,
                type: getPlaceType(place.types),
                openNow: place.opening_hours?.open_now,
                serviceType: getServiceType(place.types, place.name)
              }));
              
              allResults = [...allResults, ...placesData];
            }
          } catch (error) {
            console.error(`Erro na busca por ${keyword}:`, error);
          }
        }
        
        // Remove duplicatas baseado no ID
        const uniqueResults = allResults.filter((place, index, self) =>
          index === self.findIndex(p => p.id === place.id)
        );
        
        setPlaces(uniqueResults);
      } else {
        // Para filtros específicos, busca normal
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${locationStr}&radius=${radius}&keyword=${keywords[0]}&key=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results) {
          const placesData = data.results.map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            rating: place.rating,
            type: getPlaceType(place.types, type),
            openNow: place.opening_hours?.open_now,
            serviceType: getServiceType(place.types, place.name)
          }));
          
          setPlaces(placesData);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar lugares:', error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  // Determinar o tipo do lugar baseado nos tipos do Google
  const getPlaceType = (types, filterType = 'tudo') => {
    if (types.includes('veterinary_care') || types.includes('hospital')) return 'clinica';
    if (types.includes('pet_store')) return 'petshop';
    if (types.includes('animal_shelter')) return 'abrigo';
    if (types.includes('lodging') || types.some(t => t.includes('trainer') || t.includes('walker'))) return 'servico';
    return filterType === 'tudo' ? 'outro' : filterType;
  };

  // Determinar o tipo específico de serviço
  const getServiceType = (types, name) => {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('hotel') || nameLower.includes('hosped') || nameLower.includes('boarding')) {
      return 'Hotel';
    }
    if (nameLower.includes('taxi') || nameLower.includes('táxi') || nameLower.includes('transport')) {
      return 'Pet Táxi';
    }
    if (nameLower.includes('passeador') || nameLower.includes('walker') || nameLower.includes('passeio')) {
      return 'Passeador';
    }
    if (nameLower.includes('adestrador') || nameLower.includes('trainer') || nameLower.includes('trein')) {
      return 'Adestrador';
    }
    if (types.includes('pet_store') || nameLower.includes('pet shop') || nameLower.includes('petshop')) {
      return 'Pet Shop';
    }
    if (types.includes('veterinary_care')) {
      return 'Clínica';
    }
    
    return 'Serviço Pet';
  };

  useEffect(() => {
    if (location) {
      fetchNearbyPlaces(activeFilter);
    }
  }, [location, activeFilter]);

  // Filtra os lugares baseado no filtro ativo
  const filteredPlaces = activeFilter === 'tudo' 
    ? places 
    : activeFilter === 'servicos'
    ? places.filter(place => place.type === 'servico')
    : places.filter(place => place.type === activeFilter);

  const handleLocationChange = (newLocation) => {
    onLocationChange(newLocation);
    setShowAddressModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PETLOCALIZA</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.changeLocationButton} onPress={() => setShowAddressModal(true)}>
            <View style={styles.changeLocationContent}>
              <Ionicons name="pencil" size={14} color="#00C7BE" />
              <Text style={styles.changeLocationText}> Alterar Localização</Text>
            </View>
          </TouchableOpacity>
          
          {/* Botão para abrir/fechar painel */}
          <TouchableOpacity 
            style={styles.togglePanelButton} 
            onPress={() => setIsPanelOpen(!isPanelOpen)}
          >
            <Ionicons 
              name={isPanelOpen ? "chevron-down" : "chevron-up"} 
              size={20} 
              color="#00C7BE" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                activeFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Mapa */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Marcador do usuário */}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Você está aqui"
          pinColor="#4CAF50"
        />

        {/* Marcadores dos lugares reais */}
        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={place.serviceType || 
              (place.type === 'clinica' ? 'Clínica' :
               place.type === 'petshop' ? 'Pet Shop' :
               place.type === 'abrigo' ? 'Abrigo' : 'Serviço')}
            pinColor={getMarkerColor(place.type)}
          />
        ))}
      </MapView>

      {/* Lista de locais - AGORA COM TOGGLE */}
      {isPanelOpen && (
        <View style={styles.locationsPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>
              {filteredPlaces.length} {filteredPlaces.length === 1 ? 'local encontrado' : 'locais encontrados'}
            </Text>
            <TouchableOpacity 
              style={styles.closePanelButton}
              onPress={() => setIsPanelOpen(false)}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4CAF50" />
              <Text style={styles.loadingText}>Buscando lugares...</Text>
            </View>
          ) : (
            <ScrollView style={styles.locationsList}>
              {filteredPlaces.map((place) => (
                <View key={place.id} style={styles.locationItem}>
                  <View style={styles.locationText}>
                    <Text style={styles.locationTitle}>{place.name}</Text>
                    <Text style={styles.locationDescription}>{place.address}</Text>
                    <View style={styles.placeInfo}>
                      <Text style={[
                        styles.placeType,
                        { 
                          backgroundColor: getTypeBackgroundColor(place.type),
                          color: getTypeTextColor(place.type)
                        }
                      ]}>
                        {place.serviceType || 
                         (place.type === 'clinica' ? 'Clínica' :
                          place.type === 'petshop' ? 'Pet Shop' :
                          place.type === 'abrigo' ? 'Abrigo' : 'Serviço')}
                      </Text>
                      <Text style={styles.placeRating}>⭐ {place.rating || 'N/A'}</Text>
                      <Text style={[
                        styles.placeStatus,
                        { color: place.openNow ? '#4CAF50' : '#f44336' }
                      ]}>
                        {place.openNow !== undefined ? 
                          (place.openNow ? 'Aberto' : 'Fechado') : ''}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
              {filteredPlaces.length === 0 && activeFilter === 'encontrado' && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    Em breve: Pets encontrados aparecerão aqui
                  </Text>
                </View>
              )}
              {filteredPlaces.length === 0 && activeFilter !== 'encontrado' && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    {activeFilter === 'tudo' 
                      ? 'Nenhum local encontrado nesta área' 
                      : `Nenhum ${filters.find(f => f.id === activeFilter)?.label.toLowerCase()} encontrado`}
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      )}

      {/* Botão flutuante para abrir painel quando fechado */}
      {!isPanelOpen && (
        <TouchableOpacity 
          style={styles.openPanelButton}
          onPress={() => setIsPanelOpen(true)}
        >
          <View style={styles.openPanelContent}>
            <Ionicons name="list" size={20} color="#fff" />
            <Text style={styles.openPanelText}>Ver locais ({filteredPlaces.length})</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Modal para alterar endereço */}
      <AddressModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onConfirm={handleLocationChange}
        currentLocation={location}
      />
    </View>
  );
};

// Função para cores dos marcadores
const getMarkerColor = (type) => {
  const colors = {
    clinica: '#FF6B6B',     // Vermelho para clínicas
    petshop: '#4ECDC4',     // Verde água para petshops
    abrigo: '#FFA500',      // Laranja para abrigos
    servico: '#9C27B0',     // Roxo para serviços
    outro: '#666'           // Cinza para outros
  };
  return colors[type] || '#666';
};

// Função para cores de fundo dos tipos
const getTypeBackgroundColor = (type) => {
  const colors = {
    clinica: '#FFEBEE',
    petshop: '#E0F2F1',
    abrigo: '#FFF3E0',
    servico: '#F3E5F5',
    outro: '#F5F5F5'
  };
  return colors[type] || '#F5F5F5';
};

// Função para cores do texto dos tipos
const getTypeTextColor = (type) => {
  const colors = {
    clinica: '#D32F2F',
    petshop: '#00796B',
    abrigo: '#F57C00',
    servico: '#7B1FA2',
    outro: '#666'
  };
  return colors[type] || '#666';
};

export default function Mapa() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setErrorMsg('Permissão de localização negada');
          setIsLoading(false);
          return;
        }
        
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        
      } catch (error) {
        setErrorMsg('Erro ao obter localização');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const isWeb = Platform.OS === 'web';

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PETLOCALIZA</Text>
        </View>
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loading} />
        <Text style={styles.loadingText}>Buscando sua localização...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PETLOCALIZA</Text>
        </View>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return isWeb ? (
    <WebMapView location={location} onAddressChange={() => alert('Funcionalidade disponível apenas no mobile')} />
  ) : (
    <MobileMapView location={location} onLocationChange={handleLocationChange} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Header
  header: {
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00C7BE'
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  changeLocationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00C7BE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeLocationText: {
    color: '#00C7BE',
    fontSize: 12,
    fontWeight: '600',
  },
  changeLocationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  togglePanelButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00C7BE',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  // Filtros
  filtersContainer: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtersContent: {
    paddingHorizontal: 15,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: '#00C7BE',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Mapa
  map: {
    flex: 1,
  },
  // Painel de locais
  locationsPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300, // Aumentei a altura para melhor visualização
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  closePanelButton: {
    padding: 5,
  },
  locationsList: {
    flex: 1,
    padding: 10,
  },
  locationItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationText: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  placeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeType: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  placeRating: {
    fontSize: 12,
    color: '#666',
  },
  placeStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Botão flutuante para abrir painel
  openPanelButton: {
    position: 'absolute',
    bottom: 20,
    left: 100,
    right: 100,
    backgroundColor: '#00C7BE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  openPanelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  openPanelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estados
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loading: {
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#00C7BE',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  // Web styles
  webContainer: {
    flex: 1,
    backgroundColor: '#f0f8ff',
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
  changeAddressButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  changeAddressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
});