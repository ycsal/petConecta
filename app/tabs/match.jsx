import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { PetCard } from '../../components/PetCard/index';

// Como o app e o backend estão rodando em localhost, podemos usar este endereço
const API_URL = 'http://localhost:3001/api/pets';

export default function Match() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Buscando pets da API...");
    const fetchPets = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('A resposta da rede não foi boa');
        }
        const data = await response.json();
        console.log("Pets recebidos:", data);
        setPets(data);
      } catch (error) {
        console.error("Houve um problema ao buscar os pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleSwipeRight = (cardIndex) => {
    const pet = pets[cardIndex];
    console.log(`Você deu match com: ${pet.nome}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00C7BE" />
      </View>
    );
  }

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
        />
      ) : (
        <View style={styles.centerContent}>
          <Text style={styles.infoText}>Não há mais pets por aqui!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 40, 
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 20,
    color: '#888',
  },
});