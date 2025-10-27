import React, { useState, useCallback } from 'react';
// Precisamos do TouchableOpacity para o design de lista
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native'; 
import { useFocusEffect, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

// ATENÇÃO: Use 'localhost' para o navegador web ou SEU IP para o celular/emulador.
const API_URL = 'http://localhost:3001/api/pets';

export default function MeusMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const mockUserId = '64f3e2a7c9d1f2b4a1e5f6a7'; // TODO: Substituir pelo ID real

  useFocusEffect(
    useCallback(() => {
      const fetchMatches = async () => {
        console.log("Tela Meus Matches em foco. Buscando dados...");
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
      return () => {}; // Função de limpeza
    }, []) 
  );

  
  const renderMatch = ({ item }) => (
    <Link href={`/pet/${item._id}`} asChild>
      <TouchableOpacity style={styles.matchCard}>
        <Image 
          source={{ uri: item.foto || 'https://via.placeholder.com/55?text=Foto' }} // 
          style={styles.matchImage} 
        />
        <View style={styles.matchInfo}>
          {/* Ajustado para usar 'item.nome' (e não 'item.especie', que pode não vir da API de matches) */}
          <Text style={styles.matchName}>{item.nome}</Text> 
        </View>
        <Ionicons name="chevron-forward" size={24} color="#A0A0A0" />
      </TouchableOpacity>
    </Link>
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
      <Text style={styles.title}>Meus Matches</Text>

      {matches.length === 0 ? (
         // Mensagem quando a lista está vazia
        <View style={styles.centerContent}>
            <Text style={styles.emptyText}>Você ainda não tem matches.</Text>
            <Text style={styles.emptySubtext}>Volte para a tela principal e deslize para a direita!</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item._id}
          renderItem={renderMatch} // Usa a função de renderização com o design de lista
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // numColumns={1} // Garante que é uma lista, não um grid (padrão já é 1)
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