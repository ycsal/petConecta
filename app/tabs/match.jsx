import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { PetCard } from '../../components/PetCard'; // Caminho ajustado

// Dados de exemplo que viriam da sua API
const mockPets = [
  { id: '1', nome: 'Bolinha', idade: '2 anos', raca: 'SRD', imagem: 'https://hypescience.com/wp-content/uploads/2013/07/210.jpg' },
  { id: '2', nome: 'Frajola', idade: '1 ano', raca: 'Siamês', imagem: 'https://geloelimaodotcom.wordpress.com/wp-content/uploads/2014/03/animais-animais-engracados-83c651.jpg' },
  { id: '3', nome: 'Rex', idade: '3 anos', raca: 'Labrador', imagem: 'https://i.ytimg.com/vi/NdP6U8-gOB0/sddefault.jpg' },
];

export default function Match() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula uma chamada de API
    setTimeout(() => {
      setPets(mockPets);
      setLoading(false);
    }, 1500);
  }, []);

  const handleSwipeRight = (cardIndex) => {
    const pet = pets[cardIndex];
    console.log(`Você deu match com: ${pet.nome}`);
    // Futuramente, enviar a informação do "like" para o backend aqui
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
          renderCard={(pet) => <PetCard pet={pet} />}
          onSwipedRight={handleSwipeRight}
          onSwipedAll={() => setPets([])} // Esvazia o array para mostrar a mensagem final
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
    paddingTop: 40, // Espaço para o topo
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