import React, { useState, useCallback } from 'react'; 
import { View, Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router'; 


const API_URL = 'http://localhost:3001/api/pets';

export default function MeusMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false); 

  // TODO: Substituir este ID fixo pelo ID do usuário que está logado
  const mockUserId = '64f3e2a7c9d1f2b4a1e5f6a7';

  
  useFocusEffect(
    useCallback(() => {
      const fetchMatches = async () => {
        console.log("Tela Meus Matches em foco. Buscando dados...");
        setLoading(true); // Mostra o loading enquanto busca
        try {
          const response = await fetch(`${API_URL}/mymatches/${mockUserId}`);
          if (!response.ok) throw new Error('Erro ao buscar matches');
          
          const data = await response.json();
          setMatches(data);
        } catch (error) {
          console.error("Erro ao buscar os matches:", error);
          // Opcional: Adicionar um estado de erro para mostrar ao usuário
        } finally {
          setLoading(false);
        }
      };

      fetchMatches();

      // Função de limpeza opcional, não necessária aqui
      return () => {};
    }, []) // O array de dependências vazio é importante
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00C7BE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seus Matches</Text>
      <FlatList
        data={matches}
        keyExtractor={item => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable style={styles.matchCard} onPress={() => console.log(`Abrir chat com ${item.nome}`)}>
            <Image source={{ uri: item.foto }} style={styles.matchImage} />
            <Text style={styles.matchName}>{item.nome}</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.centerContent}>
            <Text style={styles.infoText}>Você ainda não tem matches.</Text>
          </View>
        }
      />
    </View>
  );
}

// Seus estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, // Adiciona um espaço para não ficar colado no título
  },
  infoText: {
    fontSize: 18,
    color: 'gray',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#014946ff',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 5,
  },
  matchCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: '2.5%',
    alignItems: 'center',
    padding: 10,
    elevation: 3,
  },
  matchImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
});