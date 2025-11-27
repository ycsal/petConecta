import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Alert, Platform } from 'react-native';
import { API_PETS } from '../../config';
import { useAuth } from '../../context/AuthContext'; 

export default function MeusMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); 

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      const fetchMatches = async () => {
        setLoading(true);
        try {
          const userId = user._id || user.id; 
          const response = await fetch(`${API_PETS}/mymatches/${userId}`);
          
          if (!response.ok) throw new Error('Erro ao buscar matches');
          
          const data = await response.json();
          setMatches(data);
        } catch (error) {
          console.error("Erro ao buscar os matches:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMatches();
    }, [user]) 
  );

  // --- FUNÇÃO DE UNLIKE (REMOVER) ---
  const handleUnlike = (petId, petName) => {
    const confirmUnlike = async () => {
      try {
        const userId = user._id || user.id;
        
        // Chama a rota de delete
        const response = await fetch(`${API_PETS}/match/${petId}/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove da lista visualmente
          setMatches(prev => prev.filter(item => item._id !== petId));
          if (Platform.OS === 'web') alert(`Match com ${petName} desfeito.`);
          else Alert.alert("Pronto", `Match com ${petName} desfeito.`);
        } else {
          alert("Erro ao desfazer match.");
        }
      } catch (error) {
        console.log("Erro ao unlike:", error);
      }
    };

    if (Platform.OS === 'web') {
      if (confirm(`Remover ${petName} dos seus matches?`)) confirmUnlike();
    } else {
      Alert.alert(
        "Desfazer Match",
        `Deseja remover ${petName}?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Sim", style: "destructive", onPress: confirmUnlike }
        ]
      );
    }
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

  const renderMatch = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);
    
    // --- CORREÇÃO DO ERRO DA IMAGEM ---
    let imageSource;
    
    // Se não tem foto, ou se estamos na WEB e a foto começa com 'file://' (caminho de celular)
    // Mostramos uma imagem genérica para não travar o navegador
    if (!item.foto || (Platform.OS === 'web' && item.foto.startsWith('file://'))) {
        imageSource = { uri: 'https://via.placeholder.com/150?text=Pet' };
    } else {
        // Se for celular ou imagem da internet, mostra normal
        imageSource = { uri: item.foto };
    }
    // ----------------------------------

    return (
      <View style={styles.cardContainer}>
        {/* Link para detalhes */}
        <Link href={`/pet/${item._id}`} asChild>
          <TouchableOpacity style={styles.matchCard}>
            <Image 
              source={imageSource} 
              style={styles.matchImage} 
            />
            <View style={styles.matchInfo}>
              <Text style={styles.matchName}>{item.nome}</Text>
              <View style={styles.extraInfo}>
                <Text style={styles.matchDetails}>
                  {item.especie} • {item.raca || 'SRD'}
                </Text>
              </View>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
                <Text style={[styles.statusText, { color: statusInfo.color }]}>
                  {statusInfo.text}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>

        {/* Botão de Unlike (Lixeira/Coração Quebrado) */}
        <TouchableOpacity 
          style={styles.unlikeButton} 
          onPress={() => handleUnlike(item._id, item.nome)}
        >
          <Ionicons name="trash-outline" size={24} color="#E53935" />
        </TouchableOpacity>
      </View>
    );
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
      <Text style={styles.title}>Meus Matches</Text>

      {!user ? (
         <View style={styles.centerContent}>
            <Text style={styles.emptyText}>Faça login para ver.</Text>
         </View>
      ) : matches.length === 0 ? (
        <View style={styles.centerContent}>
            <Text style={styles.emptyText}>Você ainda não tem matches.</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item._id}
          renderItem={renderMatch}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
       <View style={styles.footerSpace} />
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
    paddingBottom: 24,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    paddingRight: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    elevation: 2,
  },
  matchCard: { 
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 16,
  },
  matchImage: { 
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  matchInfo: { 
    flex: 1, 
  },
  matchName: { 
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  extraInfo: {
    marginBottom: 6,
  },
  matchDetails: {
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
  unlikeButton: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  footerSpace: {
    height: 30,
  }
});