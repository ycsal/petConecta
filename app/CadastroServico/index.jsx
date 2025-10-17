import { useNavigation } from "@react-navigation/native"; // Adicione esta importação
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// URL da sua API Node.js
const API_URL = "http://SEU_SERVIDOR_API"; // <- Substitua pelo real

export default function MeusServicos() {
  const navigation = useNavigation(); // Obtém o objeto de navegação
  const [services, setServices] = useState([]);

  // ... restante do código

  // Criar novo serviço
  const createService = () => {
    // Navega para a tela de cadastro de serviço
    navigation.navigate("Cadastro/CadastroServico"); // <- Verifique se este é o nome exato da rota
  };
  // Editar serviço
  const editService = (service) => {
    // Navega para a tela de edição com os dados do serviço
    navigation.navigate("EditarServico", { service });
  };

  // Remover serviço
  const deleteService = (id) => {
    Alert.alert(
      "Excluir Serviço",
      "Tem certeza que deseja excluir este serviço?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            fetch(`${API_URL}/services/${id}`, {
              method: "DELETE",
            })
              .then(() => {
                setServices((prev) => prev.filter((s) => s.id !== id));
              })
              .catch((err) =>
                console.log("Erro ao excluir serviço:", err)
              );
          },
        },
      ]
    );
  };

  const renderService = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>Preço: R$ {item.price}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editService(item)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteService(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Serviços</Text>

      <TouchableOpacity style={styles.addButton} onPress={createService}>
        <Text style={styles.addText}>+ Adicionar Serviço</Text>
      </TouchableOpacity>

      {services.length === 0 ? (
        <Text>Você ainda não cadastrou nenhum serviço.</Text>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderService}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  price: {
    marginTop: 4,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#2196F3",
    alignItems: "center",
    marginBottom: 12,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
