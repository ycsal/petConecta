import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from 'react';
import {
  Alert,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// URL da sua API - ATUALIZE COM SEU IP
const API_URL = "http://192.168.15.77:3001/api/servicos";

export default function ServicosProximos() {
  const [searchText, setSearchText] = useState('');
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Função para buscar serviços da API
  const fetchServicos = async (search = '') => {
    try {
      setLoading(true);
      const url = search ? `${API_URL}?search=${encodeURIComponent(search)}` : API_URL;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar serviços');
      }

      const data = await response.json();
      
      if (data.success) {
        setServicos(data.servicos);
      } else {
        throw new Error(data.error || 'Erro ao carregar serviços');
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      Alert.alert('Erro', 'Não foi possível carregar os serviços. Verifique sua conexão.');
      setServicos([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Buscar serviços quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      fetchServicos();
    }, [])
  );

  // Buscar serviços quando o texto de pesquisa mudar
  const handleSearch = (text) => {
    setSearchText(text);
    fetchServicos(text);
  };

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchServicos(searchText);
  }, [searchText]);

  const fazerLigacao = (telefone) => {
    const numeroLimpo = telefone.replace(/\D/g, '');
    const url = `tel:${numeroLimpo}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Erro', 'Não foi possível fazer a ligação');
        }
      })
      .catch(err => {
        console.error('Erro ao abrir app de telefone:', err);
        Alert.alert('Erro', 'Não foi possível fazer a ligação');
      });
  };

  const abrirWhatsApp = (telefone) => {
    const numeroLimpo = telefone.replace(/\D/g, '');
    const url = `https://wa.me/55${numeroLimpo}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
        }
      })
      .catch(err => {
        console.error('Erro ao abrir WhatsApp:', err);
        Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
      });
  };

  const abrirDetalhesServico = (servico) => {
    navigation.navigate('detalhesServico', { servico });
  };

  // Função para renderizar o conteúdo
  const renderContent = () => {
    if (loading && servicos.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando serviços...</Text>
        </View>
      );
    }

    if (servicos.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchText ? 'Nenhum serviço encontrado' : 'Nenhum serviço disponível'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchText ? 'Tente buscar com outros termos' : 'Seja o primeiro a oferecer um serviço!'}
          </Text>
        </View>
      );
    }

    return servicos.map((servico) => (
      <TouchableOpacity 
        key={servico._id} 
        style={styles.prestadorCard}
        onPress={() => abrirDetalhesServico(servico)}
      >
        <View style={styles.prestadorInfo}>
          <View style={styles.headerCard}>
            <Text style={styles.prestadorNome}>{servico.nomeUsuario}</Text>
            <Ionicons name="chevron-forward" size={16} color="#666" />
          </View>
          <Text style={styles.prestadorTipo}>{servico.titulo}</Text>
          <Text style={styles.descricaoText} numberOfLines={2}>
            {servico.descricao}
          </Text>
          <View style={styles.localizacaoContainer}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.localizacaoText}>
              {servico.bairro && `${servico.bairro}, `}{servico.cidade} - {servico.estado}
            </Text>
          </View>
          <View style={styles.telefoneContainer}>
            <Ionicons name="call-outline" size={14} color="#666" />
            <Text style={styles.telefoneText}>{servico.telefone}</Text>
          </View>
          {servico.valores && (
            <View style={styles.valoresContainer}>
              <Ionicons name="pricetag-outline" size={14} color="#666" />
              <Text style={styles.valoresText}>{servico.valores}</Text>
            </View>
          )}
        </View>

        <View style={styles.botoesAcao}>
          <TouchableOpacity
            style={styles.ligarButton}
            onPress={(e) => {
              e.stopPropagation();
              fazerLigacao(servico.telefone);
            }}
          >
            <Ionicons name="call" size={18} color="#fff" />
            <Text style={styles.ligarButtonText}>Ligar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={(e) => {
              e.stopPropagation();
              abrirWhatsApp(servico.telefone);
            }}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#fff" />
            <Text style={styles.whatsappButtonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Serviços</Text>
        <TouchableOpacity
          style={styles.criarButton}
          onPress={() => navigation.navigate("configuracoes/meusServicos")}
        >
          <Ionicons name="list" size={20} color="#fff" />
          <Text style={styles.criarButtonText}>Meus Serviços</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar serviços, prestadores..."
          value={searchText}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de Serviços */}
      <ScrollView 
        style={styles.listaContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
      </ScrollView>

      {/* Botão Flutuante para Oferecer Serviço */}
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => navigation.navigate("CadastroServico/index")}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00C7BE',
  },
  criarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00C7BE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  criarButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listaContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  prestadorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  prestadorInfo: {
    flex: 1,
    marginBottom: 12,
  },
  prestadorNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  prestadorTipo: {
    fontSize: 14,
    color: '#00C7BE',
    fontWeight: '500',
    marginBottom: 8,
  },
  descricaoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  localizacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  localizacaoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  telefoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  telefoneText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginLeft: 6,
  },
  valoresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valoresText: {
    fontSize: 14,
    color: '#00C7BE',
    fontWeight: '500',
    marginLeft: 6,
  },
  botoesAcao: {
    flexDirection: 'row',
    gap: 10,
  },
  ligarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00C7BE',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  ligarButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  whatsappButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00C7BE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});