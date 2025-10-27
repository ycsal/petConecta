import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetalhesServico() {
  const navigation = useNavigation();
  const route = useRoute();
  const { servico } = route.params;

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
          Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
        }
      })
      .catch(err => console.error('Erro ao abrir WhatsApp:', err));
  };

  const abrirPerfilProtetor = () => {
    // Navega para a página de perfil passando os dados do protetor
    navigation.navigate('perfilProtetor', { 
      protetor: {
        id: servico.id,
        nome: servico.nomeUsuario || servico.nome,
        cidade: servico.cidade,
        estado: servico.estado,
        telefone: servico.telefone,
        bairro: servico.bairro,
        // Adicione outros dados do protetor que você tenha
      }
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.scrollContent}
    keyboardShouldPersistTaps="handled">
      {/* Header com botão voltar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Detalhes do Serviço</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Card Principal do Serviço */}
      <View style={styles.card}>
        <Text style={styles.titulo}>{servico.titulo || servico.nome}</Text>
        <Text style={styles.tipo}>{servico.tipo}</Text>
        
        {/* Descrição do Serviço */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição do Serviço</Text>
          <Text style={styles.descricao}>
            {servico.descricao || 'Descrição não informada'}
          </Text>
        </View>

        {/* Valores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valores</Text>
          <View style={styles.valorContainer}>
            <Ionicons name="pricetag" size={20} color="#00C7BE" />
            <Text style={styles.valor}>
              {servico.valores || servico.preco || 'A combinar'}
            </Text>
          </View>
          {servico.observacoesValores && (
            <Text style={styles.observacoes}>
              {servico.observacoesValores}
            </Text>
          )}
        </View>

        {/* Informações do Prestador */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Prestador</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person" size={18} color="#666" />
            <Text style={styles.infoText}>{servico.nomeUsuario || servico.nome}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="call" size={18} color="#666" />
            <Text style={styles.infoText}>{servico.telefone}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color="#666" />
            <Text style={styles.infoText}>
              {servico.bairro && servico.cidade && servico.estado 
                ? `${servico.bairro}, ${servico.cidade} - ${servico.estado}`
                : 'Localização não informada'
              }
            </Text>
          </View>

          {/* BOTÃO PARA VER PERFIL DO PRESTADOR */}
          <TouchableOpacity 
            style={styles.verPerfilButton}
            onPress={abrirPerfilProtetor}
          >
            <Ionicons name="person-circle-outline" size={20} color="#00C7BE" />
            <Text style={styles.verPerfilButtonText}>Ver Perfil Completo</Text>
            <Ionicons name="chevron-forward" size={16} color="#00C7BE" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={styles.botoesContainer}>
        <TouchableOpacity 
          style={styles.ligarButton}
          onPress={() => fazerLigacao(servico.telefone)}
        >
          <Ionicons name="call" size={20} color="#fff" />
          <Text style={styles.botaoTexto}>Ligar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.whatsappButton}
          onPress={() => abrirWhatsApp(servico.telefone)}
        >
          <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          <Text style={styles.botaoTexto}>WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {/* Informações de Contato */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Entre em Contato</Text>
        <Text style={styles.contatoInfo}>
          Entre em contato diretamente com {servico.nomeUsuario || servico.nome} para 
          esclarecer dúvidas, combinar valores ou agendar o serviço.
        </Text>
        
        <View style={styles.contatoDestaque}>
          <Ionicons name="call" size={16} color="#00C7BE" />
          <Text style={styles.contatoDestaqueText}>
            {servico.telefone}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00C7BE',
  },
  headerPlaceholder: {
    width: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tipo: {
    fontSize: 16,
    color: '#00C7BE',
    fontWeight: '600',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  descricao: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  valorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  valor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00C7BE',
    marginLeft: 8,
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
  // NOVOS ESTILOS PARA O BOTÃO VER PERFIL
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
  scrollContent: {
    paddingBottom: 90, // Espaço extra no final
  },
});