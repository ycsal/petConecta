import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_PETS } from '../../config';


export default function MeusMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const mockUserId = '64f3e2a7c9d1f2b4a1e5f6a7';

  useFocusEffect(
    useCallback(() => {
      const fetchMatches = async () => {
        console.log("Tela Meus Matches em foco. Buscando dados...");
        setLoading(true);
        try {
          const response = await fetch(`${API_PETS}/mymatches/${mockUserId}`);
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
      return () => {};
    }, []) 
  );

  // Função para obter cor e texto do status - CORRIGIDA
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'disponível':
      case 'disponivel':
      case 'disponível para adoção':
      case 'disponivel para adoção':
        return { color: '#4CAF50', text: 'Disponível para adoção' };
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

  const renderMatch = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);
    
    return (
      <Link href={`/pet/${item._id}`} asChild>
        <TouchableOpacity style={styles.matchCard}>
          <Image 
            source={{ uri: item.foto || 'https://via.placeholder.com/55?text=Foto' }} 
            style={styles.matchImage} 
          />
          <View style={styles.matchInfo}>
            <Text style={styles.matchName}>{item.nome}</Text>
            {/* Linha de informações extras */}
            <View style={styles.extraInfo}>
              <Text style={styles.matchDetails}>
                {item.especie || 'Pet'} • {item.idade ? `${item.idade} ano(s)` : 'Idade não informada'}
              </Text>
            </View>
            {/* Status do pet - AGORA COM COR VERDE PARA "DISPONÍVEL" */}
            <View style={styles.statusContainer}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: statusInfo.color }
                ]} 
              />
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.text}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#A0A0A0" />
        </TouchableOpacity>
      </Link>
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

      {matches.length === 0 ? (
        <View style={styles.centerContent}>
            <Text style={styles.emptyText}>Você ainda não tem matches.</Text>
            <Text style={styles.emptySubtext}>Volte para a tela principal e deslize para a direita!</Text>
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
  matchCard: { 
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
  footerSpace: {
    height: 30,
  }
});