import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_PETS } from '../../config';

export default function MeusMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const mockUserId = '64f3e2a7c9d1f2b4a1e5f6a7';

  useFocusEffect(
    useCallback(() => {
      fetchMatches();
    }, [])
  );

  const fetchMatches = async () => {
    console.log("Buscando matches...");
    setLoading(true);
    try {
      // Tente diferentes endpoints possíveis
      const endpoints = [
        `${API_PETS}/matches/${mockUserId}`,
        `${API_PETS}/mymatches/${mockUserId}`,
        `${API_PETS}/match/${mockUserId}`
      ];

      let response;
      let lastError;

      for (const endpoint of endpoints) {
        try {
          console.log("Tentando endpoint:", endpoint);
          response = await fetch(endpoint);
          if (response.ok) {
            const data = await response.json();
            console.log("Matches carregados:", data.length);
            setMatches(data);
            return; // Sucesso, sai do loop
          }
        } catch (error) {
          lastError = error;
          console.log("Falha no endpoint:", endpoint, error.message);
        }
      }

      // Se nenhum endpoint funcionou
      throw new Error(lastError || 'Nenhum endpoint de matches funcionou');

    } catch (error) {
      console.error("Erro ao buscar os matches:", error);
      Alert.alert(
        'Erro', 
        'Não foi possível carregar os matches. Verifique sua conexão.',
        [{ text: 'Tentar Novamente', onPress: fetchMatches }]
      );
      setMatches([]); // Garante que a lista fique vazia em caso de erro
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com erro de carregamento de imagem
  const handleImageError = (petId) => {
    setImageErrors(prev => ({
      ...prev,
      [petId]: true
    }));
  };

  // Função para remover match
  const handleRemoveMatch = async (petId) => {
    setRemoving(petId);
    
    try {
      console.log('Tentando remover match...');
      
      // Tente diferentes endpoints para remover match
      const endpoints = [
        `${API_PETS}/matches/remove`,
        `${API_PETS}/match/remove`,
        `${API_PETS}/mymatches/remove`
      ];

      let response;
      let success = false;

      for (const endpoint of endpoints) {
        try {
          console.log("Tentando endpoint de remoção:", endpoint);
          response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: mockUserId,
              petId: petId
            })
          });

          if (response.ok) {
            const responseData = await response.json();
            console.log("Match removido com sucesso");
            
            // Remove o match da lista localmente
            setMatches(prev => prev.filter(match => match._id !== petId));
            Alert.alert('Sucesso!', 'Match removido com sucesso.');
            success = true;
            break;
          }
        } catch (error) {
          console.log("Falha no endpoint de remoção:", endpoint, error.message);
        }
      }

      if (!success) {
        throw new Error('Não foi possível remover o match em nenhum endpoint');
      }
      
    } catch (error) {
      console.error("Erro ao remover match:", error);
      Alert.alert(
        'Erro', 
        error.message || 'Não foi possível remover o match.',
        [{ text: 'OK' }]
      );
    } finally {
      setRemoving(null);
    }
  };

  // Função de confirmação antes de remover
  const confirmRemoveMatch = (petId, petName) => {
    Alert.alert(
      'Remover Match',
      `Tem certeza que deseja remover o match com ${petName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => handleRemoveMatch(petId) }
      ]
    );
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'disponível':
      case 'disponivel':
        return { color: '#4CAF50', text: 'Disponível para adoção' };
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
    const isRemoving = removing === item._id;
    const hasImageError = imageErrors[item._id];
    
    // URL da imagem - usa placeholder se houver erro ou se não tiver foto
    const imageSource = hasImageError || !item.foto 
      ? { uri: 'https://via.placeholder.com/100x100/CCCCCC/666666?text=Pet' }
      : { uri: item.foto };

    return (
      <View style={styles.matchCard}>
        <Link href={`/pet/${item._id}`} asChild>
          <TouchableOpacity style={styles.matchInfoContainer}>
            <Image 
              source={imageSource}
              style={styles.matchImage} 
              onError={() => handleImageError(item._id)}
            />
            <View style={styles.matchInfo}>
              <Text style={styles.matchName}>{item.nome}</Text>
              <View style={styles.extraInfo}>
                <Text style={styles.matchDetails}>
                  {item.especie || 'Pet'} • {item.idade ? `${item.idade} ano(s)` : 'Idade não informada'}
                </Text>
              </View>
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
        
        {/* Botão de remover match */}
        <TouchableOpacity 
          style={[
            styles.removeButton,
            isRemoving && styles.removeButtonDisabled
          ]}
          onPress={() => confirmRemoveMatch(item._id, item.nome)}
          disabled={isRemoving}
        >
          {isRemoving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Ionicons name="heart-dislike" size={20} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00C7BE" />
        <Text style={styles.loadingText}>Carregando matches...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Matches</Text>
        <Text style={styles.subtitle}>Pets que você deu like</Text>
        
        {/* Botão para recarregar manualmente */}
        <TouchableOpacity onPress={fetchMatches} style={styles.reloadButton}>
          <Ionicons name="refresh" size={20} color="#00C7BE" />
          <Text style={styles.reloadText}>Recarregar</Text>
        </TouchableOpacity>
      </View>

      {matches.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="heart-dislike-outline" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>
            {loading ? 'Carregando...' : 'Você ainda não tem matches'}
          </Text>
          <Text style={styles.emptySubtext}>
            {loading ? 'Buscando seus matches...' : 'Volte para a tela principal e deslize para a direita nos pets que você gostar!'}
          </Text>
          
          {!loading && (
            <TouchableOpacity onPress={fetchMatches} style={styles.tryAgainButton}>
              <Text style={styles.tryAgainText}>Tentar Novamente</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item._id}
          renderItem={renderMatch}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchMatches}
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
    paddingTop: 16,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00C7BE",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 8,
  },
  reloadText: {
    color: '#00C7BE',
    marginLeft: 6,
    fontWeight: '500',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 24,
  },
  matchCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchInfoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  matchImage: { 
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#f0f0f0',
  },
  matchInfo: { 
    flex: 1, 
  },
  matchName: { 
    fontWeight: "600",
    fontSize: 18,
    color: "#333",
    marginBottom: 6,
  },
  extraInfo: {
    marginBottom: 8,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  removeButtonDisabled: {
    backgroundColor: '#FFB8B8',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
  tryAgainButton: {
    marginTop: 20,
    backgroundColor: '#00C7BE',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  tryAgainText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  footerSpace: {
    height: 20,
  }
});