import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect, Link } from 'expo-router'; // NOVO: Importamos o Link

const API_URL = 'http://localhost:3001/api/pets';

export default function MeusMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const mockUserId = '64f3e2a7c9d1f2b4a1e5f6a7';

  useFocusEffect(
    useCallback(() => {
      const fetchMatches = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/mymatches/${mockUserId}`);
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
          // --- ALTERAÇÃO AQUI ---
          // Envolvemos o Pressable com o Link para criar a navegação
          <Link href={`/pet/${item._id}`} asChild>
            <Pressable style={styles.matchCard}>
              <Image source={{ uri: item.foto }} style={styles.matchImage} />
              <Text style={styles.matchName}>{item.nome}</Text>
            </Pressable>
          </Link>
          // --- FIM DA ALTERAÇÃO ---
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

// Seus estilos (não mudaram)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
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
  }
});