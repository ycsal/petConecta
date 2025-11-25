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

// URL base da API
const API_URL = 'http://192.168.15.77:3001/api/pets';

export default function MeusPets() {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ID do usuário
  const userId = "64f3e2a7c9d1f2b4a1e5f6a7"; 

  // ⭐⭐ FUNÇÃO CORRIGIDA - COM ENDPOINT CORRETO E DEBUG ⭐⭐
  const fetchMyPets = async () => {
    setLoading(true);
    try {
      console.log("🔄 Buscando meus pets...");
      
      // ⭐⭐ ENDPOINT CORRETO BASEADO NO SEU PETCONTROLLER ⭐⭐
      const response = await fetch(`${API_URL}/meus/${userId}`);
      
      console.log("📡 URL usada:", `${API_URL}/meus/${userId}`);
      console.log("✅ Status da resposta:", response.status);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("📦 Dados recebidos:", data);
      
      if (Array.isArray(data)) {
        setPets(data);
        console.log(`🎉 ${data.length} pets carregados!`);
      } else {
        console.log("⚠️ Nenhum pet encontrado ou dados inválidos");
        setPets([]);
      }

    } catch (err) {
      console.log("❌ Erro ao buscar pets:", err.message);
      setPets([]);
      
      // ⭐⭐ MENSAGEM DE ERRO MAIS ESPECÍFICA ⭐⭐
      if (Platform.OS === 'web') {
        alert(`Erro: ${err.message}\n\nTente:\n1. Verificar se o backend está rodando\n2. Conferir a rota /my-pets no backend`);
      } else {
        Alert.alert(
          "Erro de Conexão", 
          `Não foi possível carregar seus pets.\n\nErro: ${err.message}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('🎯 Tela MeusPets focada - iniciando busca...');
      fetchMyPets();
    }, [])
  );

  // --- FUNÇÃO DE EXCLUIR ATUALIZADA (Funciona na Web e no Celular) ---
  const handleDelete = (petId) => {
    
    // Função que executa a exclusão de verdade
    const confirmDelete = async () => {
      try {
        console.log("🗑️ Excluindo pet:", petId);
        const response = await fetch(`${API_URL}/${petId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPets((currentPets) => currentPets.filter(pet => pet._id !== petId));
          
          // Aviso de sucesso compatível
          if (Platform.OS === 'web') {
            alert("Sucesso: Pet excluído!");
          } else {
            Alert.alert("Sucesso", "Pet excluído!");
          }
        } else {
          if (Platform.OS === 'web') {
            alert("Erro: Não foi possível excluir o pet.");
          } else {
            Alert.alert("Erro", "Não foi possível excluir o pet.");
          }
        }
      } catch (error) {
        console.log("Erro ao excluir:", error);
        if (Platform.OS === 'web') {
          alert("Erro de conexão ao tentar excluir.");
        } else {
          Alert.alert("Erro", "Erro de conexão ao tentar excluir.");
        }
      }
    };

    // Verifica onde estamos rodando
    if (Platform.OS === 'web') {
      // No Computador (Web): Usa o confirm do navegador
      const confirmacao = window.confirm("Tem certeza que deseja excluir este pet permanentemente?");
      if (confirmacao) {
        confirmDelete();
      }
    } else {
      // No Celular: Usa o Alert nativo bonito
      Alert.alert(
        "Excluir Pet",
        "Tem certeza que deseja excluir este pet permanentemente?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: confirmDelete
          }
        ]
      );
    }
  };

  const handleEdit = (pet) => {
    navigation.navigate("CadastroPet/index", { petParaEditar: pet });
  };

  const openPet = (pet) => {
    navigation.navigate("ChatPet", { petId: pet._id, petName: pet.nome });
  };

  const addNewPet = () => {
    navigation.navigate("CadastroPet/index");
  };

  // --- Lógica de Status visualmente igual ao MeusMatches ---
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'disponível':
      case 'disponivel':
      case 'disponível para adoção':
      case 'disponivel para adoção':
        return { color: '#4CAF50', text: 'Disponível' };
      case 'encontrado - procurando dono':
      case 'encontrado':
        return { color: '#FF9800', text: 'Encontrado' };
      case 'perdido':
        return { color: '#F44336', text: 'Perdido' };
      case 'adotado':
        return { color: '#9E9E9E', text: 'Adotado' };
      case 'em processo de adoção':
        return { color: '#2196F3', text: 'Em processo' };
      default:
        return { color: '#757575', text: status || 'Status não informado' };
    }
  };

  const renderPet = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);

    return (
      <TouchableOpacity style={styles.card} onPress={() => openPet(item)}>
        {/* Imagem (Estilo do Matches) */}
        <Image 
          source={{ uri: item.foto ? item.foto : 'https://via.placeholder.com/55?text=Foto' }} 
          style={styles.cardImage} 
        />
        
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.nome}</Text>
          
          {/* Linha Extra (Especie/Raça) igual ao Matches */}
          <View style={styles.extraInfo}>
             <Text style={styles.cardDetails}>
                {item.especie || 'Pet'} • {item.raca || 'SRD'}
             </Text>
          </View>

          {/* Status (Estilo do Matches) */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        {/* --- BOTÕES DE AÇÃO (Lápis/Lixeira) --- */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
            <Ionicons name="pencil" size={20} color="#00C7BE" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleDelete(item._id)} style={[styles.actionButton, { marginLeft: 5 }]}>
            <Ionicons name="trash-outline" size={20} color="#E53935" />
          </TouchableOpacity>
        </View>
        {/* -------------------------------------- */}

      </TouchableOpacity>
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

// ESTILOS COPIADOS E ADAPTADOS DO MEUSMATCHES
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
    paddingBottom: 100, // Espaço para o botão flutuante
  },
  // CARD VISUAL
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    // Sombras idênticas ao Matches
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
  // ESTILOS ESPECÍFICOS DO MEUS PETS (Ações e Botão Add)
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
    elevation: 4, // Sombra do botão
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