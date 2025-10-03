import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MeusPets() {
  const [pets, setPets] = useState([]);

  // Simulação inicial (mock sem banco)
  useEffect(() => {
    // Aqui entraria a chamada ao backend para buscar os pets do usuário
    // Exemplo com fetch (quando tiver o backend pronto):
    /*
    fetch("http://localhost:3000/pets") // ajuste para sua rota no Node
      .then(response => response.json())
      .then(data => setPets(data))
      .catch(err => console.error(err));
    */

    // Mock para visualização da tela
    setPets([
      { id: "1", nome: "Rex", especie: "Cachorro" },
      { id: "2", nome: "Mimi", especie: "Gato" },
    ]);
  }, []);

  const handleEditar = (pet) => {
    // Aqui você pode navegar para uma tela de edição ou abrir modal
    console.log("Editar pet:", pet);
  };

  const handleAdicionar = () => {
    // Aqui você pode navegar para a tela de cadastro de pet
    console.log("Adicionar novo pet");
  };

  const renderPet = ({ item }) => (
    <View style={styles.petCard}>
      <Text style={styles.petText}>{item.nome} ({item.especie})</Text>
      <TouchableOpacity style={styles.editButton} onPress={() => handleEditar(item)}>
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Pets</Text>

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={renderPet}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAdicionar}>
        <Text style={styles.buttonText}>+ Adicionar Novo Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  petCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  petText: {
    fontSize: 18,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
