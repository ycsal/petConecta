import { Ionicons } from "@expo/vector-icons"; // Para ícones de seta e adicionar
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// URL da sua API Node.js
const API_URL = "http://SEU_SERVIDOR_API"; // Substitua pelo real

export default function MeusPets({ navigation }) {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    // === Conexão com o banco ===
    fetch(`${API_URL}/pets/meus`)
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.log("Erro ao buscar pets:", err));
  }, []);

  // Função para abrir detalhes/chat do pet
  const openPet = (pet) => {
    navigation.navigate("ChatPet", { petId: pet.id, petName: pet.name });
  };

  // Função para adicionar novo pet
  const addNewPet = () => {
    navigation.navigate("../CadastroPet/index");
  };

  // Cores de status
  const statusColor = {
    disponivel: "#4CAF50", // verde
    processo: "#FF9800", // laranja
    adotado: "#E53935", // vermelho
  };

  // Renderização individual de cada pet
  const renderPet = ({ item }) => (
    <TouchableOpacity style={styles.petCard} onPress={() => openPet(item)}>
      <Image source={{ uri: item.image }} style={styles.petImage} />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item.status === "Disponível para adoção"
                    ? statusColor.disponivel
                    : item.status === "Em processo de adoção"
                    ? statusColor.processo
                    : statusColor.adotado,
              },
            ]}
          />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#000" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MEUS PETS</Text>

      {pets.length === 0 ? (
        <Text style={{ marginTop: 16 }}>Nenhum pet cadastrado ainda.</Text>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPet}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={addNewPet}>
        <Ionicons name="add" size={22} color="#000" />
        <Text style={styles.addText}>Adicionar novo pet</Text>
      </TouchableOpacity>

      {/* Ilustração inferior */}
      <View style={styles.footerIllustration}>
       
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00BCCD", // azul-turquesa da imagem
    marginBottom: 16,
  },
  petCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  petImage: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 12,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: "#444",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  addText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 6,
  },
  footerIllustration: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 16,
  },
});