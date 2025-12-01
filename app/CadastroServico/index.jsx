import { useNavigation, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { API_SERVICOS } from "../../config";
import { useAuth } from '../../context/AuthContext';

export default function CadastroServico() {
  const { user } = useAuth(); 
  // MUDANÇA 2: Usar o router em vez de navigation
  const router = useRouter();
  const route = useRoute(); 
  const [loading, setLoading] = useState(false);

  // Verifica se estamos editando
  const servicoParaEditar = route.params?.servicoParaEditar;
  const isEditing = !!servicoParaEditar;
   const navigation = useNavigation();

  // ID do usuário fixo
 // const userId = "64f3e2a7c9d1f2b4a1e5f6a7";
 

  const [servicoData, setServicoData] = useState({
    titulo: "",
    descricao: "",
    nomeUsuario: "",
    telefone: "",
    bairro:  "",
    cidade:  "",
    estado: "",
    valores: "",
    observacoesValores: ""
  });

  useEffect(() => {
    if (isEditing) {
      setServicoData({
        titulo: servicoParaEditar.titulo || "",
        descricao: servicoParaEditar.descricao || "",
        nomeUsuario: servicoParaEditar.nomeUsuario || "",
        telefone: servicoParaEditar.telefone || "",
        bairro: servicoParaEditar.bairro || "",
        cidade: servicoParaEditar.cidade || "",
        estado: servicoParaEditar.estado || "",
        valores: servicoParaEditar.valores || "",
        observacoesValores: servicoParaEditar.observacoesValores || ""
      });
    }
  }, [servicoParaEditar]);

  const handleChange = (field, value) => {
    setServicoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSalvar = async () => {
    if (!servicoData.titulo || !servicoData.descricao || !servicoData.nomeUsuario) {
      Alert.alert("Atenção", "Preencha pelo menos o título, descrição e seu nome.");
      return;
    }

    setLoading(true);

    try {
      
      const dadosParaEnviar = {
        id_usuario: user._id,
        titulo: servicoData.titulo,
        descricao: servicoData.descricao,
        nomeUsuario: servicoData.nomeUsuario,
        telefone: servicoData.telefone,
        bairro: servicoData.bairro,
        cidade: servicoData.cidade,
        estado: servicoData.estado,
        valores: servicoData.valores,
        observacoesValores: servicoData.observacoesValores,
        status: "Ativo"
      };

      let response;

      if (isEditing) {
        response = await fetch(`${API_SERVICOS}/${servicoParaEditar._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosParaEnviar),
        });
      } else {
        response = await fetch(`${API_SERVICOS}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosParaEnviar),
        });
      }

      const data = await response.json();

      if (response.ok) {
        const mensagem = isEditing ? "Serviço atualizado com sucesso!" : "Serviço cadastrado com sucesso!";
    
        alert(mensagem);
        navigation.navigate("configuracoes/meusServicos");
        

      } else {
        Alert.alert("Sucesso!", mensagem, [
          { text: "OK", onPress: () => navigation.navigate("tabs/meusServicos") }
        ]);

      } 

    } catch (error) {
      console.log("Erro ao salvar serviço:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
    >
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>
            {isEditing ? "Editar Serviço" : "Cadastrar Serviço"}
        </Text>

        <Text style={styles.sectionTitle}>Informações do Serviço</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Título do serviço *" 
          value={servicoData.titulo} 
          onChangeText={(text) => handleChange("titulo", text)} 
        />
        
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Descrição detalhada do serviço *" 
          value={servicoData.descricao} 
          onChangeText={(text) => handleChange("descricao", text)} 
          multiline 
          numberOfLines={4}
        />

        <Text style={styles.sectionTitle}>Valores e Contato</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Valores (ex: R$ 50,00 hora | A combinar | Gratuito)" 
          value={servicoData.valores} 
          onChangeText={(text) => handleChange("valores", text)} 
        />
        
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Observações sobre valores (forma de pagamento, condições, etc.)" 
          value={servicoData.observacoesValores} 
          onChangeText={(text) => handleChange("observacoesValores", text)} 
          multiline 
          numberOfLines={3}
        />

        <Text style={styles.sectionTitle}>Seus Dados para Contato</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Seu nome *" 
          value={servicoData.nomeUsuario} 
          onChangeText={(text) => handleChange("nomeUsuario", text)} 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Telefone para contato (ex: (11) 99999-9999) *" 
          value={servicoData.telefone} 
          onChangeText={(text) => handleChange("telefone", text)} 
          keyboardType="phone-pad"
        />
        
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, styles.halfInput]} 
            placeholder="Bairro *" 
            value={servicoData.bairro} 
            onChangeText={(text) => handleChange("bairro", text)} 
          />
          <TextInput 
            style={[styles.input, styles.halfInput]} 
            placeholder="Cidade *" 
            value={servicoData.cidade} 
            onChangeText={(text) => handleChange("cidade", text)} 
          />
        </View>
        
        <TextInput 
          style={styles.input} 
          placeholder="Estado *" 
          value={servicoData.estado} 
          onChangeText={(text) => handleChange("estado", text)} 
        />

        <Text style={styles.obs}>
          * Campos obrigatórios{'\n'}
          Seus dados de contato serão visíveis para outros usuários interessados no serviço.
        </Text>

        <TouchableOpacity 
            style={styles.button} 
            onPress={handleSalvar}
            disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>
                {isEditing ? "Atualizar Serviço" : "Salvar Serviço"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: { 
    fontSize: 22, 
    fontWeight: "700", 
    marginBottom: 16,
    color: "#00BCCD",
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#333"
  },
  input: { 
    backgroundColor: "#f8f8f8", 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: "#EAEAEA",
    fontSize: 14
  },
  textArea: {
    height: 100,
    textAlignVertical: "top"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  halfInput: {
    width: "48%"
  },
  button: { 
    backgroundColor: "#00BCCD", 
    padding: 16, 
    borderRadius: 8, 
    alignItems: "center", 
    marginTop: 20,
    marginBottom: 30
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 16
  },
  obs: {
    fontSize: 12,
    color: "#666",
    marginTop: 10,
    lineHeight: 16
  }
});
