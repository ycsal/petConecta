import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// ATENÇÃO: Use 'localhost' para o navegador web ou SEU IP para o celular/emulador.
const API_URL = 'http://192.168.15.77:3001/api/pets';

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

  // Função para abrir WhatsApp
  const handleWhatsApp = () => {
    if (pet?.id_usuario?.telefone) {
      const phoneNumber = pet.id_usuario.telefone.replace(/\D/g, '');
      const url = `https://wa.me/55${phoneNumber}`;
      
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
          }
        })
        .catch(err => console.error('Erro ao abrir WhatsApp:', err));
    } else {
      Alert.alert("Contato", "Telefone não disponível.");
    }
  };

  // Função para navegar para o perfil do protetor
  const handleViewProtectorProfile = () => {
    if (pet?.id_usuario?._id) {
      router.push(`../perfilProtetor/${pet.id_usuario._id}`);
    } else {
      Alert.alert("Erro", "Informações do protetor não disponíveis.");
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

        {/* SEÇÃO DE INFORMAÇÕES DO PRESTADOR (SUBSTITUIU CONTATO DO RESPONSÁVEL) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Protetor</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person" size={18} color="#666" />
            <Text style={styles.infoText}>{pet.id_usuario?.nome || 'Nome não informado'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="call" size={18} color="#666" />
            <Text style={styles.infoText}>{pet.id_usuario?.telefone || 'Telefone não informado'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color="#666" />
            <Text style={styles.infoText}>
              {pet.id_usuario?.cidade && pet.id_usuario?.estado 
                ? `${pet.id_usuario.cidade} - ${pet.id_usuario.estado}`
                : 'Localização não informada'
              }
            </Text>
          </View>

          <Pressable 
            style={styles.verPerfilButton}
            onPress={handleViewProtectorProfile}
          >
            <Ionicons name="person-circle-outline" size={20} color="#00C7BE" />
            <Text style={styles.verPerfilButtonText}>Ver Perfil Completo</Text>
            <Ionicons name="chevron-forward" size={16} color="#00C7BE" />
          </Pressable>
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={styles.botoesContainer}>
        <Pressable 
          style={styles.ligarButton}
          onPress={handleCall}
        >
          <Ionicons name="call" size={20} color="#fff" />
          <Text style={styles.botaoTexto}>Ligar</Text>
        </Pressable>
        
        <Pressable 
          style={styles.whatsappButton}
          onPress={handleWhatsApp}
        >
          <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          <Text style={styles.botaoTexto}>WhatsApp</Text>
        </Pressable>
      </View>

      {/* Informações de Contato */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Entre em Contato</Text>
        <Text style={styles.contatoInfo}>
          Entre em contato diretamente com {pet.id_usuario?.nome || 'o responsável'} para 
          esclarecer dúvidas sobre {pet.nome}.
        </Text>
        
        <View style={styles.contatoDestaque}>
          <Ionicons name="call" size={16} color="#00C7BE" />
          <Text style={styles.contatoDestaqueText}>
            {pet.id_usuario?.telefone || 'Telefone não disponível'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Estilos completos para a tela de detalhes
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f8f8f8',
        paddingTop: 32,
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
    // NOVOS ESTILOS DA SEÇÃO DE INFORMAÇÕES DO PRESTADOR
    section: {
        marginBottom: 24,
        marginTop: 25,
        borderTopColor: '#eee',
        borderTopWidth: 1,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    verPerfilButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0f9f9',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#00C7BE',
        marginTop: 8,
    },
    verPerfilButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#00C7BE',
        flex: 1,
        textAlign: 'center',
    },
    botoesContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    ligarButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00C7BE',
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
    },
    whatsappButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25D366',
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
    },
    botaoTexto: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        margin: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    contatoInfo: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    contatoDestaque: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f9f9',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#00C7BE',
    },
    contatoDestaqueText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00C7BE',
        marginLeft: 8,
    },
});