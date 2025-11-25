import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // NOVO: Para navegar para a tela de filtros
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { PetCard } from '../../components/PetCard/index';
import { useFilters } from '../../context/FilterContext';
import {API_PETS } from '../../config';




export default function Match() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const swiperRef = useRef(null);

  
  const { filters } = useFilters();

 
  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Constrói a query string com os filtros ativos
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null) {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    const fullUrl = queryString ? `${API_PETS}?${queryString}` : API_PETS;

    console.log("Buscando pets da API:", fullUrl);

    try {
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error('Não foi possível buscar os pets.');
      }
      const data = await response.json();
      setPets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]); // A busca é refeita sempre que os filtros mudam

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleSwipeRight = async (cardIndex) => {
    const pet = pets[cardIndex];
    if (!pet) return;
    const mockUserId = '64f3e2a7c9d1f2b4a1e5f6a7'; 
    try {
      await fetch(`${API_URL}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: mockUserId,
          petId: pet._id,
        }),
      });
    } catch (err) {
      console.error('Erro ao enviar o match:', err);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00C7BE" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchPets}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
     
      <Pressable style={styles.filterButton} onPress={() => router.push('/filters')}>
        <Ionicons name="filter" size={24} color="#333" />
      </Pressable>

      <View style={styles.swiperContainer}>
        {pets.length > 0 ? (
          <Swiper
            ref={swiperRef}
            cards={pets}
            renderCard={(pet) => <PetCard pet={pet} key={pet._id} />}
            onSwipedRight={handleSwipeRight}
            onSwipedLeft={(cardIndex) => console.log('Swipe para a esquerda no', pets[cardIndex]?.nome)}
            onSwipedAll={() => setPets([])}
            cardIndex={0}
            backgroundColor={'transparent'}
            stackSize={3}
            infinite={false}
            animateCardOpacity
            verticalSwipe={false}
            overlayLabels={{
              left: { title: 'NÃO GOSTEI', style: { label: { backgroundColor: '#FF5A5F', color: 'white', fontSize: 18 }, wrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 30, marginLeft: -30 } } },
              right: { title: 'GOSTEI', style: { label: { backgroundColor: '#00C7BE', color: 'white', fontSize: 18 }, wrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 30, marginLeft: 30 } } }
            }}
          />
        ) : (
          <View style={styles.centerContent}>
            <Text style={styles.infoText}>Nenhum pet encontrado com esses filtros.</Text>
            <Pressable style={styles.retryButton} onPress={fetchPets}>
              <Text style={styles.retryButtonText}>Buscar novamente</Text>
            </Pressable>
          </View>
        )}
      </View>
      
      {pets.length > 0 && (
        <View style={styles.buttonsContainer}>
          <Pressable style={[styles.button, styles.dislikeButton]} onPress={() => swiperRef.current.swipeLeft()}>
            <Ionicons name="close" size={32} color="#FF5A5F" />
          </Pressable>
          <Pressable style={[styles.button, styles.likeButton]} onPress={() => swiperRef.current.swipeRight()}>
            <Ionicons name="heart" size={32} color="#00C7BE" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  swiperContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#c0392b',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#00C7BE',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 2,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    alignItems: 'center',
    paddingBottom: 20,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dislikeButton: {
    borderColor: '#FF5A5F',
    borderWidth: 2,
  },
  likeButton: {
    borderColor: '#00C7BE',
    borderWidth: 2,
  },
  
  filterButton: {
    position: 'absolute',
    top: 5,
    right: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
});