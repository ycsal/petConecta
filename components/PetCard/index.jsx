import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export const PetCard = ({ pet }) => {
  if (!pet) return null;

  const formatarSexo = (sexo) => {
    if (sexo === 'M') return 'Macho';
    if (sexo === 'F') return 'Fêmea';
    return '';
  };

  return (
    <View style={styles.card}>
     
      <Image source={{ uri: pet.foto }} style={styles.cardImage} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.nome}>{pet.nome}, {pet.idade} anos</Text>
        <Text style={styles.detalhes}>{pet.raca}</Text>
        <Text style={styles.detalhes}>{formatarSexo(pet.sexo)} • {pet.porte}</Text>
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
    height: '75%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#eee', 
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  nome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  detalhes: {
    fontSize: 16,
    color: 'gray',
    marginTop: 2,
  },
});