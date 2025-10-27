import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
// import { useAuth } from "../contexts/AuthContext"; // Para pegar dados do usuário logado

export default function CadastroServico() {
  const navigation = useNavigation();
  // const { user } = useAuth(); // Obter usuário logado

  const [servicoData, setServicoData] = useState({
    titulo: "",
    descricao: "",
    preco: "",
    nomeUsuario: "", // Preenche automaticamente com nome do usuário
    telefone: "", // NOVO CAMPO: telefone para contato
    bairro:  "",
    cidade:  "",
    estado: "",
    valores: "", // Campo para valores/contato
    observacoesValores: "" // Descrição dos valores
  });

  const handleChange = (field, value) => {
    setServicoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSalvar = async () => {
    // Validação básica
    if (!servicoData.titulo || !servicoData.descricao || !servicoData.nomeUsuario) {
      Alert.alert("Atenção", "Preencha pelo menos o título, descrição e seu nome.");
      return;
    }

    // Validação do telefone (opcional, mas se preenchido deve ter formato válido)
    if (servicoData.telefone && !/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/.test(servicoData.telefone)) {
      Alert.alert("Atenção", "Por favor, insira um telefone válido (ex: (11) 99999-9999)");
      return;
    }

    try {
    /*
      // TODO: integrar com backend - endpoint precisa ser criado
      const response = await fetch("http://SEU_IP_LOCAL:3001/api/servicos", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...servicoData,
          id_usuario: user?._id, // ID do usuário logado
          status: "Ativo" // Status padrão
        }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Serviço cadastrado com sucesso!");
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert("Erro", errorData.error || "Erro ao cadastrar serviço");
      } 
    } catch (error) {
      console.log("Erro ao cadastrar serviço:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor");
    }
    */

    // Apagar essa parte quando tiver integração com backend
    console.log("Dados que seriam enviados:", servicoData);
      Alert.alert("Sucesso (Simulação)", "Serviço cadastrado com sucesso!\n\nDados:\n" + 
        `Título: ${servicoData.titulo}\n` +
        `Descrição: ${servicoData.descricao}\n` +
        `Nome: ${servicoData.nomeUsuario}\n` +
        `Telefone: ${servicoData.telefone || 'Não informado'}\n` +
        `Bairro: ${servicoData.bairro}\n` +
        `Cidade: ${servicoData.cidade}\n` +
        `Estado: ${servicoData.estado}\n` +
        `Valores: ${servicoData.valores}\n` +
        `Observações: ${servicoData.observacoesValores}`
      );
      navigation.goBack();
      
    } catch (error) {
      console.log("Erro ao cadastrar serviço:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Cadastrar Serviço</Text>

          {/* Informações Básicas do Serviço */}
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

          {/* Informações de Contato/Valores */}
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

          {/* Informações Pessoais */}
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

          <TouchableOpacity style={styles.button} onPress={handleSalvar}>
            <Text style={styles.buttonText}>Salvar Serviço</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
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