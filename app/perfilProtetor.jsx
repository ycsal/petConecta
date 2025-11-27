import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";


const PROTETOR_EXEMPLO = {
  id: "1",
  nome: "Ana Silva",
  cidade: "Guarujá",
  estado: "SP",
  telefone: "(13) 98765-4321",
  foto: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop",
  tipoUsuario: "Protetor",
  descricaoTipo: "Pessoa que resgata e cuida temporariamente de animais."
};

const PETS_EXEMPLO = [
  {
    id: 1,
    name: "Rex",
    especie: "Cachorro",
    raca: "Vira-lata",
    idade: 2,
    status: "Disponível para adoção",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&h=150&fit=crop",
    protetorId: "1",
    tipo: "adocao"
  },
  {
    id: 2,
    name: "Luna",
    especie: "Gato",
    raca: "Siamês",
    idade: 1,
    status: "Disponível para adoção",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop",
    protetorId: "1",
    tipo: "adocao"
  },
  {
    id: 3,
    name: "Thor",
    especie: "Cachorro",
    raca: "Labrador",
    idade: 3,
    status: "Disponível para adoção",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&h=150&fit=crop",
    protetorId: "1",
    tipo: "adocao"
  },
  {
    id: 4,
    name: null, 
    especie: "Cachorro",
    raca: "Desconhecida",
    idade: "Adulto",
    status: "Encontrado - Procurando dono",
    image: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=150&h=150&fit=crop",
    protetorId: "1",
    tipo: "encontrado",
    localEncontro: "Parque Ibirapuera",
    dataEncontro: "15/10/2023"
  },
  {
    id: 5,
    name: null, // Pet encontrado sem nome
    especie: "Gato",
    raca: "SRD",
    idade: "Filhote",
    status: "Encontrado - Procurando dono",
    image: "https://images.unsplash.com/photo-1536589961741-88c3a8f6b8de?w=150&h=150&fit=crop",
    protetorId: "1",
    tipo: "encontrado",
    localEncontro: "Rua Augusta",
    dataEncontro: "20/10/2023"
  }
];

// Dados de exemplo dos serviços
const SERVICOS_EXEMPLO = [
  {
    id: 1,
    titulo: "Hospedagem para Pets",
    descricao: "Cuido do seu pet enquanto você viaja. Ambiente seguro e acolhedor.",
    preco: "R$ 50/dia",
    tipo: "Hotel Pet",
    protetorId: "1"
  },
  {
    id: 2,
    titulo: "Passeio com Cães",
    descricao: "Passeios de 30min a 1hora em parques seguros.",
    preco: "R$ 25/passeio",
    tipo: "Passeador",
    protetorId: "1"
  },
  {
    id: 3,
    titulo: "Banho e Tosa",
    descricao: "Banho completo e tosa higiênica para cães de pequeno e médio porte.",
    preco: "R$ 40",
    tipo: "Banho/Tosa",
    protetorId: "1"
  }
];

export default function PerfilProtetor({ route }) {
  const [filtroAtivo, setFiltroAtivo] = useState('pets'); 
  
  // Em uma implementação real, esses dados viriam do route.params
  const protetor = PROTETOR_EXEMPLO;
  const pets = PETS_EXEMPLO;
  const servicos = SERVICOS_EXEMPLO;

  const petsAdocao = pets.filter(pet => pet.tipo === 'adocao');
  const petsEncontrados = pets.filter(pet => pet.tipo === 'encontrado');

  const handleContato = () => {
    Alert.alert(
      "Entrar em contato",
      `Ligar para ${protetor.telefone}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Ligar", onPress: () => console.log("Ligando...") }
      ]
    );
  };

  const handleWhatsApp = () => {
    Alert.alert(
      "Enviar mensagem",
      `Abrir conversa no WhatsApp com ${protetor.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Abrir", onPress: () => console.log("Abrindo WhatsApp...") }
      ]
    );
  };

  // Renderizar card de pet
  const renderPet = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {item.name || "Pet Encontrado"}
        </Text>
        <Text style={styles.cardSubtitle}>{item.especie} • {item.raca}</Text>
        <Text style={styles.cardDetails}>{item.idade}</Text>
        
        {item.tipo === 'encontrado' ? (
          <View style={styles.encontradoInfo}>
            <Text style={styles.encontradoText}>
              📍 {item.localEncontro} • {item.dataEncontro}
            </Text>
          </View>
        ) : null}
        
        <View style={[
          styles.statusBadge, 
          { 
            backgroundColor: item.tipo === 'encontrado' ? '#FF9800' : '#4CAF50',
            marginTop: item.tipo === 'encontrado' ? 4 : 8
          }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Renderizar card de serviço
  const renderServico = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardSubtitle}>{item.descricao}</Text>
        <View style={styles.servicoInfo}>
          <Text style={styles.preco}>{item.preco}</Text>
          <View style={styles.tipoBadge}>
            <Text style={styles.tipoText}>{item.tipo}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header com foto e informações básicas */}
      <View style={styles.header}>
        <Image source={{ uri: protetor.foto }} style={styles.fotoPerfil} />
        <View style={styles.infoBasica}>
          <Text style={styles.nome}>{protetor.nome}</Text>
          <View style={styles.localizacao}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.cidade}>
              {protetor.cidade}, {protetor.estado}
            </Text>
          </View>
        </View>
      </View>

      {/* Tipo de Usuário - NOVA SEÇÃO */}
      <View style={styles.tipoUsuarioSection}>
        <Text style={styles.sectionTitle}>Perfil do Usuário</Text>
        <View style={styles.tipoUsuarioContainer}>
          <View style={[styles.opcao, styles.opcaoSelecionada]}>
            <Text style={[styles.opcaoTexto, styles.opcaoTextoSelecionado]}>
              {protetor.tipoUsuario}
            </Text>
            <Text style={styles.opcaoDescricao}>
              {protetor.descricaoTipo}
            </Text>
          </View>
        </View>
      </View>

      {/* Contato */}
      <View style={styles.contatoSection}>
        <Text style={styles.sectionTitle}>Contato</Text>
        <View style={styles.contatoInfo}>
          <Ionicons name="call" size={20} color="#00C7BE" />
          <Text style={styles.telefone}>{protetor.telefone}</Text>
        </View>
        <View style={styles.botoesContato}>
          <TouchableOpacity style={styles.botaoContato} onPress={handleContato}>
            <Ionicons name="call" size={18} color="#FFF" />
            <Text style={styles.botaoTexto}>Ligar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.botaoContato, styles.botaoWhatsApp]} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={18} color="#FFF" />
            <Text style={styles.botaoTexto}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtro Pets/Serviços */}
      <View style={styles.filtroSection}>
        <Text style={styles.sectionTitle}>Disponíveis</Text>
        <View style={styles.filtroContainer}>
          <TouchableOpacity 
            style={[styles.filtroBotao, filtroAtivo === 'pets' && styles.filtroAtivo]} 
            onPress={() => setFiltroAtivo('pets')}
          >
            <Text style={[styles.filtroTexto, filtroAtivo === 'pets' && styles.filtroTextoAtivo]}>
              Pets ({pets.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filtroBotao, filtroAtivo === 'servicos' && styles.filtroAtivo]} 
            onPress={() => setFiltroAtivo('servicos')}
          >
            <Text style={[styles.filtroTexto, filtroAtivo === 'servicos' && styles.filtroTextoAtivo]}>
              Serviços ({servicos.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de Pets ou Serviços */}
      <View style={styles.listaSection}>
        {filtroAtivo === 'pets' ? (
          <View>
            {/* Seção de Pets para Adoção */}
            {petsAdocao.length > 0 && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Pets para Adoção</Text>
                <FlatList
                  data={petsAdocao}
                  renderItem={renderPet}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
            
            {/* Seção de Pets Encontrados */}
            {petsEncontrados.length > 0 && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Pets Encontrados</Text>
                <Text style={styles.subsectionDescription}>
                  Estes pets foram encontrados e estão procurando por seus donos
                </Text>
                <FlatList
                  data={petsEncontrados}
                  renderItem={renderPet}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </View>
        ) : (
          <FlatList
            data={servicos}
            renderItem={renderServico}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  fotoPerfil: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  infoBasica: {
    flex: 1,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  localizacao: {
    flexDirection: "row",
    alignItems: "center",
  },
  cidade: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  // NOVOS ESTILOS PARA TIPO DE USUÁRIO
  tipoUsuarioSection: {
    backgroundColor: "#FFF",
    padding: 20,
    marginTop: 8,
  },
  tipoUsuarioContainer: {
    width: "100%",
  },
  opcao: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#00645F",
    borderWidth: 1,
    borderColor: "#00645F",
  },
  opcaoSelecionada: {
    backgroundColor: "#00c7bd38",
    borderColor: "#fff",
  },
  opcaoTexto: {
    fontSize: 16,
    color: "#00c7be",
    fontWeight: "bold",
    marginBottom: 4,
  },
  opcaoTextoSelecionado: {
    color: "#000",
    fontWeight: "bold",
  },
  opcaoDescricao: {
    fontSize: 13,
    color: "#000",
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  contatoSection: {
    backgroundColor: "#FFF",
    padding: 20,
    marginTop: 8,
  },
  contatoInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  telefone: {
    fontSize: 16,
    color: "#000",
    marginLeft: 8,
  },
  botoesContato: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botaoContato: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00C7BE",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  botaoWhatsApp: {
    backgroundColor: "#25D366",
  },
  botaoTexto: {
    color: "#FFF",
    fontWeight: "600",
    marginLeft: 6,
  },
  filtroSection: {
    backgroundColor: "#FFF",
    padding: 20,
    marginTop: 8,
  },
  filtroContainer: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 4,
  },
  filtroBotao: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  filtroAtivo: {
    backgroundColor: "#00C7BE",
  },
  filtroTexto: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  filtroTextoAtivo: {
    color: "#FFF",
  },
  listaSection: {
    backgroundColor: "#FFF",
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  subsection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subsectionDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
    fontStyle: 'italic',
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  cardDetails: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  encontradoInfo: {
    marginTop: 4,
  },
  encontradoText: {
    fontSize: 11,
    color: "#666",
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: "600",
  },
  servicoInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  preco: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00C7BE",
  },
  tipoBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipoText: {
    fontSize: 10,
    color: "#1976D2",
    fontWeight: "600",
  },
});