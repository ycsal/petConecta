import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Pressable } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { PetCard } from '../../components/PetCard/index';

const API_URL = 'http://localhost:3001/api/pets';

export default function Match() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado para controlar erros

  // A função de busca de dados, agora otimizada
  const fetchPets = useCallback(async () => {
    console.log("Buscando pets da API...");
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL); // Usando a API_URL diretamente
      if (!response.ok) {
        throw new Error('Não foi possível buscar os pets. Tente novamente mais tarde.');
      }
      const data = await response.json();
      console.log("Pets recebidos:", data.length);
      setPets(data);
    } catch (err) {
      console.error("Houve um problema ao buscar os pets:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca os pets quando a tela carrega
  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // Função que envia o "match" para o backend ao dar swipe
  const handleSwipeRight = async (cardIndex) => {
    const pet = pets[cardIndex];
    if (!pet) return;

    // TODO: Substituir este ID fixo pelo ID do usuário que está logado
    const mockUserId = '64f3e2a7c9d1f2b4a1e5f6a7'; 
    
    console.log(`Você deu match com: ${pet.nome}`);

    try {
      // Usando a API_URL para a rota de match
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

  // Renderiza a tela de loading
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00C7BE" />
      </View>
    );
  }

  // Renderiza a tela de erro, se houver
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

  // Renderização principal da tela
  return (
    <View style={styles.container}>
      {pets.length > 0 ? (
        <Swiper
          cards={pets}
          renderCard={(pet) => <PetCard pet={pet} key={pet._id} />}
          onSwipedRight={handleSwipeRight}
          onSwipedAll={() => setPets([])}
          cardIndex={0}
          backgroundColor={'transparent'}
          stackSize={3}
          infinite={false}
          animateCardOpacity
          verticalSwipe={false}
        />
      ) : (
        <View style={styles.centerContent}>
          <Text style={styles.infoText}>Não há mais pets por aqui!</Text>
          <Pressable style={styles.retryButton} onPress={fetchPets}>
            <Text style={styles.retryButtonText}>Buscar novamente</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
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
});