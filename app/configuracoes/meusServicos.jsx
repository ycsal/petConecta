import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { API_SERVICOS } from "../../config";
import { useAuth } from '../../context/AuthContext';


export default function MeusServicos() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ID do usuário (mesmo usado nos Pets)
  //const userId = "64f3e2a7c9d1f2b4a1e5f6a7"; 

  // --- BUSCAR SERVIÇOS ---
  const fetchServices = async () => {
    setLoading(true);
    if (!user) return;
    try {
      const response = await fetch(`${API_SERVICOS}/meus/${user._id}`);
      const data = await response.json();

      // Verifica se a API retornou o array dentro de 'servicos' (conforme seu controller)
      if (data.success && Array.isArray(data.servicos)) {
        setServices(data.servicos);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.log("Erro ao buscar serviços:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [])
  );

  // --- NAVEGAÇÃO ---
  const createService = () => {
    navigation.navigate("CadastroServico/index");
  };

  const editService = (service) => {
    // Passamos o serviço inteiro para a tela de cadastro preencher
    navigation.navigate("CadastroServico/index", { servicoParaEditar: service });
  };

  // --- EXCLUIR SERVIÇO ---
  const deleteService = (id) => {
    const confirmDelete = async () => {
      try {
        const response = await fetch(`${API_SERVICOS}/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setServices((prev) => prev.filter((s) => s._id !== id));
          if (Platform.OS === 'web') alert("Serviço excluído!");
          else Alert.alert("Sucesso", "Serviço excluído!");
        } else {
          alert("Erro ao excluir.");
        }
      } catch (err) {
        console.log("Erro ao excluir serviço:", err);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        "Excluir Serviço",
        "Tem certeza que deseja excluir este serviço?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", style: "destructive", onPress: confirmDelete },
        ]
      );
    }
  };

  const renderService = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* Correção: Usando os nomes do seu Schema (titulo, valores, descricao) */}
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.categoria}>{item.nomeUsuario} • {item.cidade}</Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {item.descricao}
        </Text>
        
        <Text style={styles.price}>
          {item.valores ? `R$ ${item.valores}` : "Valor a combinar"}
        </Text>
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, 
          { backgroundColor: item.status === 'Ativo' ? '#E8F5E9' : '#FFEBEE' }
        ]}>
          <Text style={[styles.statusText, 
            { color: item.status === 'Ativo' ? '#2E7D32' : '#C62828' }
          ]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => editService(item)}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteService(item._id)}>
          <Ionicons name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Serviços</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00C7BE" style={{ marginTop: 20 }} />
      ) : services.length === 0 ? (
        <View style={styles.emptyContainer}>
           <Text style={styles.emptyText}>Você não possui serviços cadastrados.</Text>
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderService}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={createService}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Novo Serviço</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00C7BE',
    marginBottom: 16,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center'
  },
  emptyText: {
    color: '#666',
    fontSize: 16
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  categoria: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00C7BE",
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  actions: {
    justifyContent: "space-around",
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#eee",
  },
  editButton: {
    backgroundColor: "#00C7BE",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    padding: 8,
    borderRadius: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00C7BE",
    padding: 16,
    borderRadius: 12,
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    elevation: 4,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
