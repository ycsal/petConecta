import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { API_PETS } from '../../config';
import { useAuth } from '../../context/AuthContext';

export default function MeusPets() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPets = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log("🔄 Buscando meus pets...");
      
      const response = await fetch(`${API_PETS}/meus/${user._id}`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setPets(data);
      } else {
        setPets([]);
      }

    } catch (err) {
      console.log("❌ Erro ao buscar pets:", err.message);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyPets();
    }, [user])
  );

  const handleDelete = (petId) => {
    const confirmDelete = async () => {
      try {
        const response = await fetch(`${API_PETS}/${petId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPets((currentPets) => currentPets.filter(pet => pet._id !== petId));
          
          if (Platform.OS === 'web') {
            alert("Sucesso: Pet excluído!");
          } else {
            Alert.alert("Sucesso", "Pet excluído!");
          }
        } else {
          if (Platform.OS === 'web') alert("Erro ao excluir.");
          else Alert.alert("Erro", "Não foi possível excluir o pet.");
        }
      } catch (error) {
        console.log("Erro ao excluir:", error);
        if (Platform.OS === 'web') alert("Erro de conexão.");
        else Alert.alert("Erro", "Erro de conexão.");
      }
    };

    if (Platform.OS === 'web') {
      if (confirm("Tem certeza que deseja excluir este pet permanentemente?")) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        "Excluir Pet",
        "Tem certeza que deseja excluir este pet permanentemente?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", style: "destructive", onPress: confirmDelete }
        ]
      );
    }
  };

  const handleEdit = (pet) => {
    navigation.navigate("CadastroPet/index", { petParaEditar: pet });
  };

  const addNewPet = () => {
    navigation.navigate("CadastroPet/index");
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'disponível': case 'disponivel': return { color: '#4CAF50', text: 'Disponível' };
      case 'encontrado': return { color: '#FF9800', text: 'Encontrado' };
      case 'perdido': return { color: '#F44336', text: 'Perdido' };
      case 'adotado': return { color: '#9E9E9E', text: 'Adotado' };
      default: return { color: '#757575', text: status || 'Status?' };
    }
  };

  const renderPet = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);

    return (
      // MUDANÇA: View no lugar de TouchableOpacity (remove o clique do card)
      <View style={styles.card}>
        
        {/* Imagem Original (sem tratamento para Web) */}
        <Image 
          source={{ uri: item.foto ? item.foto : 'https://via.placeholder.com/55?text=Foto' }} 
          style={styles.cardImage} 
        />
        
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.nome}</Text>
          <View style={styles.extraInfo}>
             <Text style={styles.cardDetails}>
                {item.especie || 'Pet'} • {item.raca || 'SRD'}
             </Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
            <Ionicons name="pencil" size={20} color="#00C7BE" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleDelete(item._id)} style={[styles.actionButton, { marginLeft: 5 }]}>
            <Ionicons name="trash-outline" size={20} color="#E53935" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Pets</Text>

      {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#00C7BE" />
            <Text style={styles.loadingText}>Carregando seus pets...</Text>
          </View>
      ) : pets.length === 0 ? (
        <View style={styles.centerContent}>
            <Text style={styles.emptyText}>Você ainda não tem pets.</Text>
            <Text style={styles.emptySubtext}>Clique em adicionar para começar!</Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
          renderItem={renderPet}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={addNewPet}>
        <Ionicons name="add" size={22} color="#fff" />
        <Text style={styles.addText}>Adicionar novo pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00C7BE", 
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 100, 
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    elevation: 2,
  },
  cardImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  extraInfo: {
    marginBottom: 6,
  },
  cardDetails: {
    fontSize: 14,
    color: "#666",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
});