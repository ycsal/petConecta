import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native"; // Adicione esta importação
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
  const navigation = useNavigation();

  // Dados mockados para prestadores de serviço
  const prestadoresServico = [
    {
      id: 1,
      nome: "João Silva - Transpopet",
      tipo: "Taxi Pet",
      bairro: "Centro",
      cidade: "Guarujá",
      estado: "SP",
      telefone: "(13) 99999-9999",
      descricao: "Serviço de transporte seguro e confortável para seu pet. Veículo adaptado com caixas de transporte e ar condicionado.",
      valores: "R$ 30,00 por corrida",
      observacoes: "Atendo emergências 24h"
    },
    {
      id: 2,
      nome: "Maria Santos - Obedecão",
      tipo: "Adestrador",
      bairro: "Jardim Las Palmas",
      cidade: "Guarujá",
      estado: "SP",
      telefone: "(13) 98888-8888",
      descricao: "Adestramento profissional para cães de todas as raças e idades. Métodos positivos e sem violência.",
      valores: "R$ 80,00 por aula",
      observacoes: "Primeira aula experimental gratuita"
    },
    {
      id: 3,
      nome: "Carlos Oliveira - Pet Sitter",
      tipo: "Babá Pet",
      bairro: "Santo Antônio",
      cidade: "Guarujá",
      estado: "SP",
      telefone: "(13) 97777-7777",
      descricao: "Cuido do seu pet enquanto você viaja. Visitas diárias, alimentação, medicamentos e muito carinho.",
      valores: "R$ 40,00 por visita",
      observacoes: "Plantão de feriados e finais de semana"
    },
    {
      id: 4,
      nome: "Ana Costa - Passeios",
      tipo: "Passeador",
      bairro: "Perequê",
      cidade: "Guarujá",
      estado: "SP",
      telefone: "(13) 96666-6666",
      descricao: "Passeios recreativos em parques e praças. Duração de 30min a 1hora, conforme necessidade do pet.",
      valores: "R$ 25,00 por passeio",
      observacoes: "Pacote semanal com desconto"
    },
    {
      id: 5,
      nome: "Pedro Martins - Hotel",
      tipo: "Hotel Pet",
      bairro: "Jardim dos Pássaros",
      cidade: "Guarujá",
      estado: "SP",
      telefone: "(13) 95555-5555",
      descricao: "Hotelzinho familiar com amplo espaço externo. Acomodações individuais, alimentação especial e monitoramento 24h.",
      valores: "R$ 60,00 diária",
      observacoes: "Desconto para estadias longas"
    },
    {
      id: 6,
      nome: "Fernanda Lima - Banho",
      tipo: "Banho & Tosa",
      bairro: "Santa Rosa",
      cidade: "Guarujá",
      estado: "SP",
      telefone: "(13) 94444-4444",
      descricao: "Banho completo com produtos hipoalergênicos e tosa higiênica. Secagem adequada e cuidados com unhas e ouvidos.",
      valores: "R$ 45,00 banho e tosa",
      observacoes: "Agendamento prévio necessário"
    },
    {
      id: 7,
      nome: "Ricardo Souza - Transporte",
      tipo: "Transporte Pet",
      bairro: "Pitangueiras",
      cidade: "Guarujá",
      estado: "SP",
      telefone: "(13) 93333-3333",
      descricao: "Transporte especializado para pets. Viagens intermunicipais, consultas veterinárias e demais deslocamentos.",
      valores: "R$ 2,50 por km",
      observacoes: "Atendo toda a Baixada Santista"
    },
    {
      id: 8,
      nome: "Juliana Rocha - Creche",
      tipo: "Creche Pet",
      bairro: "Centro",
      cidade: "Guarujá",
      estado: "SP",
      telefone: "(13) 92222-2222",
      descricao: "Creche diária para pets. Atividades recreativas, socialização com outros animais e muito entretenimento.",
      valores: "R$ 35,00 diária",
      observacoes: "Horário flexível das 7h às 19h"
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

  const abrirWhatsApp = (telefone) => {
    const numeroLimpo = telefone.replace(/\D/g, '');
    const url = `https://wa.me/55${numeroLimpo}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log('Não foi possível abrir o WhatsApp');
        }
      })
      .catch(err => console.error('Erro ao abrir WhatsApp:', err));
  };

  const abrirDetalhesServico = (servico) => {
    navigation.navigate('detalhesServico', { servico });
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
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.criarButtonText}>Meus Serviços</Text>
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
          <TouchableOpacity 
            key={prestador.id} 
            style={styles.prestadorCard}
            onPress={() => abrirDetalhesServico(prestador)}
          >
            <View style={styles.prestadorInfo}>
              <View style={styles.headerCard}>
                <Text style={styles.prestadorNome}>{prestador.nome}</Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </View>
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

            {/* Botões de Ação - Lado a Lado */}
            <View style={styles.botoesAcao}>
              <TouchableOpacity
                style={styles.ligarButton}
                onPress={(e) => {
                  e.stopPropagation(); // Impede que o clique propague para o card
                  fazerLigacao(prestador.telefone);
                }}
              >
                <Ionicons name="call" size={18} color="#fff" />
                <Text style={styles.ligarButtonText}>Ligar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.whatsappButton}
                onPress={(e) => {
                  e.stopPropagation(); // Impede que o clique propague para o card
                  abrirWhatsApp(prestador.telefone);
                }}
              >
                <Ionicons name="logo-whatsapp" size={18} color="#fff" />
                <Text style={styles.whatsappButtonText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Botão Flutuante para Oferecer Serviço */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate("CadastroServico/index")}>
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
  // NOVOS ESTILOS PARA OS BOTÕES LADO A LADO
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