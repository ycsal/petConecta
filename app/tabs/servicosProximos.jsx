import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function ServicosProximos() {
  const [searchText, setSearchText] = useState('');
  
  // Dados mockados para prestadores de serviço
  const prestadoresServico = [
    {
      id: 1,
      nome: "João Silva - Taxi Dog",
      tipo: "Taxi Pet",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      telefone: "(11) 99999-9999"
    },
    {
      id: 2,
      nome: "Maria Santos - Adestramento",
      tipo: "Adestrador",
      bairro: "Jardins",
      cidade: "São Paulo",
      estado: "SP", 
      telefone: "(11) 98888-8888"
    },
    {
      id: 3,
      nome: "Carlos Oliveira - Babá Pet",
      tipo: "Pet Sitter",
      bairro: "Vila Madalena",
      cidade: "São Paulo",
      estado: "SP",
      telefone: "(11) 97777-7777"
    },
    {
      id: 4,
      nome: "Ana Costa - Passeios",
      tipo: "Passeador",
      bairro: "Moema",
      cidade: "São Paulo", 
      estado: "SP",
      telefone: "(11) 96666-6666"
    },
    {
      id: 5,
      nome: "Pedro Martins - Hotel",
      tipo: "Hotel Pet",
      bairro: "Pinheiros",
      cidade: "São Paulo",
      estado: "SP",
      telefone: "(11) 95555-5555"
    },
    {
      id: 6,
      nome: "Fernanda Lima - Banho",
      tipo: "Banho & Tosa",
      bairro: "Itaim Bibi",
      cidade: "São Paulo",
      estado: "SP",
      telefone: "(11) 94444-4444"
    },
    {
      id: 7,
      nome: "Ricardo Souza - Transporte",
      tipo: "Transporte Pet",
      bairro: "Brooklin",
      cidade: "São Paulo",
      estado: "SP",
      telefone: "(11) 93333-3333"
    },
    {
      id: 8,
      nome: "Juliana Rocha - Creche",
      tipo: "Creche Pet",
      bairro: "Perdizes",
      cidade: "São Paulo",
      estado: "SP",
      telefone: "(11) 92222-2222"
    }
  ];

  const prestadoresFiltrados = prestadoresServico.filter(prestador =>
    prestador.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    prestador.tipo.toLowerCase().includes(searchText.toLowerCase()) ||
    prestador.bairro.toLowerCase().includes(searchText.toLowerCase())
  );

  const fazerLigacao = (telefone) => {
    const numeroLimpo = telefone.replace(/\D/g, '');
    const url = `tel:${numeroLimpo}`;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log('Não foi possível fazer a ligação');
        }
      })
      .catch(err => console.error('Erro ao abrir app de telefone:', err));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Serviços</Text>
        <TouchableOpacity 
  style={styles.criarButton} 
  onPress={() => router.push('../CadastroServico/index')}
>
  <Ionicons name="add-circle" size={20} color="#fff" />
  <Text style={styles.criarButtonText}>Oferecer Serviço</Text>
</TouchableOpacity>
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar prestadores..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de Prestadores */}
      <ScrollView style={styles.listaContainer} showsVerticalScrollIndicator={false}>
        {prestadoresFiltrados.map((prestador) => (
          <View key={prestador.id} style={styles.prestadorCard}>
            <View style={styles.prestadorInfo}>
              <Text style={styles.prestadorNome}>{prestador.nome}</Text>
              <Text style={styles.prestadorTipo}>{prestador.tipo}</Text>
              <View style={styles.localizacaoContainer}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.localizacaoText}>
                  {prestador.bairro}, {prestador.cidade} - {prestador.estado}
                </Text>
              </View>
              <View style={styles.telefoneContainer}>
                <Ionicons name="call-outline" size={14} color="#666" />
                <Text style={styles.telefoneText}>{prestador.telefone}</Text>
              </View>
            </View>

            {/* Botão de Ligar */}
            <TouchableOpacity 
              style={styles.ligarButton}
              onPress={() => fazerLigacao(prestador.telefone)}
            >
              <Ionicons name="call" size={18} color="#fff" />
              <Text style={styles.ligarButtonText}>Ligar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Botão Flutuante para Oferecer Serviço */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => router.push('../CadastroServico/index')}>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: 50,
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
  prestadorInfo: {
    flex: 1,
    marginBottom: 12,
  },
  prestadorNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  prestadorTipo: {
    fontSize: 14,
    color: '#00C7BE',
    fontWeight: '500',
    marginBottom: 8,
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
  },
  telefoneText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginLeft: 6,
  },
  ligarButton: {
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