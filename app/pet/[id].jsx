import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, Pressable, Linking, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// ATENÇÃO: Use 'localhost' para o navegador web ou SEU IP para o celular/emulador.
const API_URL = 'http://localhost:3001/api/pets';

export default function PetDetail() {
  const { id: petId } = useLocalSearchParams(); // Pega o 'id' da URL
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPetDetails = async () => {
      if (!petId) {
        setError('ID do pet não encontrado.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/${petId}`);
        if (!response.ok) {
           if(response.status === 404) throw new Error('Pet não encontrado.');
           throw new Error('Erro ao buscar detalhes do pet.');
        }
        const data = await response.json();
        setPet(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [petId]);

  // Função para abrir o discador do telefone
  const handleCall = () => {
    if (pet?.id_usuario?.telefone) {
      const phoneNumber = pet.id_usuario.telefone;
      Linking.openURL(`tel:${phoneNumber}`).catch(err => {
          console.error("Erro ao abrir discador", err);
          Alert.alert("Erro", "Não foi possível abrir o discador.");
      });
    } else {
         Alert.alert("Contato", "Telefone não disponível.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00C7BE" style={styles.center} />;
  }

  if (error) {
    return (
        <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Voltar</Text>
            </Pressable>
        </View>
    );
  }

  if (!pet) {
    return <Text style={styles.center}>Nenhum dado do pet para exibir.</Text>;
  }

  // Função simples para formatar o sexo
  const formatarSexo = (sexo) => (sexo === 'M' ? 'Macho' : 'Fêmea');

  return (
    <ScrollView style={styles.container}>
      {/* Configuração do Cabeçalho: Força a exibição e define título */}
      <Stack.Screen options={{ 
          headerShown: true, // Garante que o header seja mostrado
          title: pet.nome || "Detalhes do Pet", 
          headerBackTitle: "Matches", // Texto ao lado da seta (iOS)
          headerStyle: { backgroundColor: '#fff' }, 
          headerTintColor: '#00C7BE', 
       }} />

      <Image 
        source={{ uri: pet.foto || 'https://via.placeholder.com/400x300.png?text=Sem+Foto' }} 
        style={styles.petImage} 
      />
      
      <View style={styles.detailsContainer}>
        <Text style={styles.petName}>{pet.nome}</Text>
        
        <View style={styles.quickDetails}>
            <Text style={styles.detailItem}><Ionicons name="paw-outline" size={16} /> {pet.raca}</Text>
            <Text style={styles.detailItem}><Ionicons name="calendar-outline" size={16} /> {pet.idade} anos</Text>
            <Text style={styles.detailItem}><Ionicons name="male-female-outline" size={16} /> {formatarSexo(pet.sexo)}</Text>
            <Text style={styles.detailItem}><Ionicons name="resize-outline" size={16} /> {pet.porte}</Text>
        </View>
        
        <Text style={styles.descriptionTitle}>Sobre {pet.nome}</Text>
        <Text style={styles.descriptionText}>{pet.descricao}</Text>

        <View style={styles.additionalInfoContainer}>
          <View style={styles.additionalInfo}>
              <Text style={styles.infoLabel}>Castrado:</Text>
              <Text style={styles.infoValue}>{pet.castrado ? 'Sim' : 'Não'}</Text>
          </View>
          <View style={styles.additionalInfo}>
              <Text style={styles.infoLabel}>Vacinado:</Text>
              <Text style={styles.infoValue}>{pet.vacinado ? 'Sim' : 'Não'}</Text>
          </View>
        </View>

        <Text style={styles.contactTitle}>Contato do Responsável</Text>
        <Text style={styles.contactName}>{pet.id_usuario?.nome || 'Nome não informado'}</Text>
        {pet.id_usuario?.telefone ? (
          <Pressable style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.callButtonText}>{pet.id_usuario.telefone}</Text>
          </Pressable>
        ) : (
          <Text style={styles.contactInfoNA}>Telefone não disponível</Text>
        )}
      </View>
    </ScrollView>
  );
}

// Estilos completos para a tela de detalhes
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff',
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
    },
    errorText: { 
        color: '#c03b2b', 
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginTop: 15,
        backgroundColor: '#eee',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 5,
    },
    backButtonText: {
        color: '#555',
        fontSize: 16,
    },
    petImage: { 
        width: '100%', 
        height: 300, 
        backgroundColor: '#eee',
    },
    detailsContainer: { 
        padding: 20,
    },
    petName: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        marginBottom: 10, 
        color: '#333',
    },
    quickDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
        gap: 10, 
    },
    detailItem: { 
        fontSize: 16, 
        color: '#555', 
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    descriptionTitle: { 
        fontSize: 22, 
        fontWeight: '600', 
        marginTop: 20, 
        marginBottom: 8, 
        color: '#333',
        borderTopColor: '#eee',
        borderTopWidth: 1,
        paddingTop: 20,
    },
    descriptionText: { 
        fontSize: 16, 
        color: '#555', 
        lineHeight: 24,
        marginBottom: 20,
    },
    additionalInfoContainer: {
        marginTop: 10,
        marginBottom: 20,
        borderTopColor: '#eee',
        borderTopWidth: 1,
        paddingTop: 20,
    },
    additionalInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 1,
    },
    infoLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 16,
        color: '#555',
    },
    contactTitle: { 
        fontSize: 22, 
        fontWeight: '600', 
        marginTop: 25, 
        marginBottom: 10, 
        color: '#333',
        borderTopColor: '#eee',
        borderTopWidth: 1,
        paddingTop: 20,
    },
    contactName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#444',
        marginBottom: 10,
    },
    callButton: { 
        flexDirection: 'row', 
        backgroundColor: '#00C7BE', 
        paddingVertical: 12, 
        paddingHorizontal: 20, 
        borderRadius: 8, 
        alignItems: 'center', 
        justifyContent: 'center', 
        alignSelf: 'flex-start',
        marginTop: 5,
        elevation: 2,
    },
    callButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginLeft: 10 
    },
    contactInfoNA: {
        fontSize: 16,
        color: '#888',
        fontStyle: 'italic',
        marginTop: 5,
    },
});