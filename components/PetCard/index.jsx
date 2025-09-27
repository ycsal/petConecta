import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export const PetCard = ({ pet }) => {
  if (!pet) return null;

  return (
    <View style={styles.card}>
      <Image source={{ uri: pet.imagem }} style={styles.cardImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.text}>{pet.nome}, {pet.idade}</Text>
        <Text style={styles.subText}>{pet.raca}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 0.9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardImage: {
    width: '100%',
    height: '85%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: 'gray',
  },
});