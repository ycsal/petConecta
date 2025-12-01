import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { API_AUTH } from "../../config";
import { useAuth } from "../../context/AuthContext";

// ✅ OPÇÕES PARA O TIPO DE USUÁRIO
const tipoOptions = [
  { label: "🐕 Tutor/Adotante", value: "Adotante" },
  { label: "🐕 Tutor", value: "Tutor" },
  { label: "❤️ Protetor", value: "Protetor" },
  { label: "🏠 Abrigo", value: "Abrigo" },
];

export default function MeuPerfil() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
    telefone: "",
    cep: "",
    cidade: "",
    uf: "",
    endereco: "",
    bairro: "",
    numero: "",
    tipo: "",
    complemento: "",
  });

  const [focusedField, setFocusedField] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cepValido, setCepValido] = useState(false);
  const [foto, setFoto] = useState(null);
  const [carregandoDados, setLoading] = useState(true); 
  const [salvando, setSalvando] = useState(false);
  const [showTipoModal, setShowTipoModal] = useState(false);

  const [erros, setErros] = useState({
    email: "",
    telefone: "",
    cep: "",
  });

  // ✅ DEBUG: Verificar se o tipo está carregando corretamente
  useEffect(() => {
    if (user && form.tipo) {
      console.log('Tipo de usuário no contexto:', user.tipousuario);
      console.log('Tipo de usuário no form:', form.tipo);
    }
  }, [user, form.tipo]);

  // ✅ Timeout para evitar loading infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (carregandoDados) {
        console.log('Timeout - parando loading forçadamente');
        setLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [carregandoDados]);

  useEffect(() => {
    if (user) {
      carregarDadosUsuario();
    }
  }, [user]);

  const carregarDadosUsuario = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_AUTH}/profile/${user._id}`);
      const result = await response.json();
      
      console.log('Dados completos da API:', result);
      
      if (result.success && result.user) {
        const usuario = result.user;
        
        // ✅ CORREÇÃO: VERIFICAÇÃO CORRIGIDA PARA O CAMPO COM TYPO
        const tipoUsuario = usuario.tipousuario || usuario.tipolisuario || usuario.tipo || user.tipousuario || user.tipolisuario || "";
        
        console.log('Tipo carregado:', {
          fromAPI_tipousuario: usuario.tipousuario,
          fromAPI_tipolisuario: usuario.tipolisuario,
          fromUserContext: user.tipousuario,
          final: tipoUsuario
        });
        
        setForm({
          nome: usuario.nome || "",
          email: usuario.email || "",
          senha: "",
          confirmSenha: "",
          telefone: usuario.telefone || "",
          cep: usuario.endereco?.cep || "",
          cidade: usuario.endereco?.cidade || "",
          uf: usuario.endereco?.estado || "",
          endereco: usuario.endereco?.rua || "",
          bairro: usuario.endereco?.bairro || "",
          numero: usuario.endereco?.numero || "",
          tipo: tipoUsuario,
          complemento: usuario.endereco?.complemento || "",
        });
        
        if (usuario.foto) {
          setFoto(usuario.foto);
        }
        
        console.log('Form carregado com sucesso');
      } else {
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário");
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Falha ao carregar dados do usuário");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORREÇÃO: FUNÇÃO handleChange MELHORADA
  const handleChange = (key, value) => {
    setForm(prev => ({ 
      ...prev, 
      [key]: value 
    }));
    
    // Limpa erro do campo quando usuário começa a digitar
    if (erros[key]) {
      setErros(prev => ({ ...prev, [key]: "" }));
    }
  };

  // ✅ FUNÇÃO PARA SELECIONAR TIPO
  const selecionarTipo = (tipo) => {
    setForm(prev => ({ ...prev, tipo }));
    setShowTipoModal(false);
  };

  const escolherFoto = async () => {
    if (!isEditing) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Precisamos da permissão para acessar sua galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  // ✅ VERIFICAÇÕES DE SENHA
  const checks = {
    length: form.senha.length >= 8,
    upper: /[A-Z]/.test(form.senha),
    lower: /[a-z]/.test(form.senha),
    number: /\d/.test(form.senha),
    symbol: /[@$!%*?&]/.test(form.senha),
  };
  
  const requisitosValidos = Object.values(checks).every(Boolean);
  const senhasIguais = form.senha === form.confirmSenha && form.senha.length > 0;

  const formatTelefone = (value) => {
    let onlyNumbers = value.replace(/\D/g, "");
    onlyNumbers = onlyNumbers.slice(0, 11);

    if (onlyNumbers.length <= 10) {
      return onlyNumbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      return onlyNumbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setErros((prev) => ({ ...prev, email: "E-mail inválido." }));
      return false;
    }
    setErros((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validarTelefone = (telefone) => {
    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length < 10 || numeros.length > 11) {
      setErros((prev) => ({ ...prev, telefone: "Telefone inválido." }));
      return false;
    }
    setErros((prev) => ({ ...prev, telefone: "" }));
    return true;
  };

  const buscarCep = async (cepValue) => {
    const onlyNumbers = cepValue.replace(/\D/g, "");

    if (onlyNumbers.length !== 8) {
      setErros((prev) => ({ ...prev, cep: "CEP deve ter 8 dígitos." }));
      setCepValido(false);
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${onlyNumbers}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErros((prev) => ({ ...prev, cep: "CEP não encontrado." }));
        setForm(prev => ({ 
          ...prev, 
          endereco: "", 
          bairro: "", 
          cidade: "", 
          uf: "" 
        }));
        setCepValido(false);
        return;
      }

      setErros((prev) => ({ ...prev, cep: "" }));
      setForm(prev => ({
        ...prev,
        endereco: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
        cep: onlyNumbers,
      }));
      setCepValido(true);
    } catch (error) {
      setErros((prev) => ({ ...prev, cep: "Erro ao buscar CEP." }));
      setCepValido(false);
    }
  };

  // ✅ FUNÇÃO ATUALIZADA PARA SALVAR - CORRIGIDA
  const salvarAlteracoes = async () => {
    try {
      setSalvando(true);
      
      const dadosParaEnviar = {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        endereco: {
          cep: form.cep,
          rua: form.endereco,
          numero: form.numero,
          complemento: form.complemento,
          bairro: form.bairro,
          cidade: form.cidade,
          estado: form.uf
        },
        tipousuario: form.tipo,
        foto: foto
      };

      // ✅ SE A SENHA FOI PREENCHIDA, ADICIONA AO ENVIO
      if (form.senha && form.senha.trim() !== "") {
        if (!requisitosValidos) {
          Alert.alert("Erro", "A senha não atende todos os requisitos de segurança.");
          setSalvando(false);
          return;
        }
        
        if (!senhasIguais) {
          Alert.alert("Erro", "As senhas não coincidem.");
          setSalvando(false);
          return;
        }
        
        dadosParaEnviar.senha = form.senha;
      }

      console.log('Enviando dados para atualização:', dadosParaEnviar);

      let response = await fetch(`${API_AUTH}/profile/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (response.status === 404) {
        response = await fetch(`${API_AUTH}/profile/${user._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosParaEnviar),
        });
      }

      const result = await response.json();
      console.log('Resposta da atualização:', result);

      if (result.success) {
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        
        // ✅ ATUALIZA O CONTEXTO DO USUÁRIO COM OS NOVOS DADOS
        if (updateUser && result.user) {
          await updateUser(result.user);
        } else {
          // ✅ SE A API NÃO RETORNOU O USER, ATUALIZA MANUALMENTE
          await updateUser({
            nome: form.nome,
            email: form.email,
            telefone: form.telefone,
            endereco: dadosParaEnviar.endereco,
            tipousuario: form.tipo,
            foto: foto
          });
        }
        
        // ✅ CORREÇÃO: VOLTA AO ESTADO ORIGINAL
        setIsEditing(false);
        
        setForm(prev => ({
          ...prev,
          senha: "",
          confirmSenha: ""
        }));
        
      } else {
        Alert.alert("Erro", result.error || "Erro ao atualizar perfil");
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      Alert.alert("Erro", "Falha ao conectar com o servidor");
    } finally {
      setSalvando(false);
    }
  };

  const handleButtonPress = async () => {
    if (isEditing) {
      // ✅ VALIDAÇÕES MELHORADAS
      if (!form.nome.trim()) {
        Alert.alert("Erro", "O nome é obrigatório.");
        return;
      }

      const emailValido = validarEmail(form.email);
      const telefoneValido = validarTelefone(form.telefone);

      if (!emailValido || !telefoneValido) {
        Alert.alert("Erro", "Verifique os campos destacados em vermelho.");
        return;
      }

      // ✅ VALIDAÇÃO DO TIPO DE USUÁRIO
      if (!form.tipo) {
        Alert.alert("Erro", "Selecione o tipo de usuário.");
        return;
      }

      // ✅ SE CEP FOI PREENCHIDO, DEVE SER VÁLIDO
      if (form.cep && form.cep.length === 8 && !cepValido) {
        Alert.alert("Erro", "CEP inválido. Clique fora do campo para buscar o endereço.");
        return;
      }

      await salvarAlteracoes();
    } else {
      setIsEditing(true);
    }
  };

  // ✅ CORREÇÃO: BOTÃO CANCELAR EDITAR
  const cancelarEdicao = () => {
    setIsEditing(false);
    carregarDadosUsuario(); // Recarrega os dados originais
  };

  // ✅ VERIFICA SE USUÁRIO ESTÁ LOGADO
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Você precisa estar logado para acessar esta página</Text>
        <Text style={styles.loadingSubtext}>Faça login e tente novamente</Text>
      </View>
    );
  }

  // ✅ MOSTRA LOADING ENQUANTO CARREGA DADOS - COM FALLBACK
  if (carregandoDados) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C7BE" />
        <Text style={styles.loadingText}>Carregando seus dados...</Text>
        <TouchableOpacity 
          style={styles.timeoutButton}
          onPress={() => setLoading(false)}
        >
          <Text style={styles.timeoutText}>Se estiver demorando, clique aqui</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ✅ MODAL PARA SELECIONAR TIPO */}
          <Modal
            visible={showTipoModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowTipoModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecione seu tipo</Text>
                {tipoOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.modalOption,
                      form.tipo === option.value && styles.modalOptionSelected
                    ]}
                    onPress={() => selecionarTipo(option.value)}
                  >
                    <Text style={[
                      styles.modalOptionText,
                      form.tipo === option.value && styles.modalOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setShowTipoModal(false)}
                >
                  <Text style={styles.modalCloseText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            style={styles.imageContainer}
            onPress={escolherFoto}
            disabled={!isEditing}
          >
            {foto ? (
              <Image source={{ uri: foto }} style={styles.profileImage} />
            ) : (
              <Ionicons name="camera" size={32} color="#888" />
            )}
          </TouchableOpacity>

          <TextInput
            placeholder="Nome *"
            style={styles.input}
            value={form.nome}
            onChangeText={(text) => handleChange("nome", text)}
            editable={isEditing}
            onFocus={() => setFocusedField('nome')}
            onBlur={() => setFocusedField(null)}
          />

          <TextInput
            placeholder="E-mail *"
            style={styles.input}
            value={form.email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => handleChange("email", text)}
            onBlur={() => validarEmail(form.email)}
            editable={isEditing}
            onFocus={() => setFocusedField('email')}
          />
          {erros.email ? <Text style={styles.erro}>{erros.email}</Text> : null}

          <View style={styles.inputArea}>
            <TextInput
              placeholder="Senha (deixe em branco para manter a atual)"
              style={[styles.input, { flex: 1 }]}
              value={form.senha}
              onChangeText={(text) => handleChange("senha", text)}
              editable={isEditing}
              onFocus={() => setFocusedField('senha')}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputArea}>
            <TextInput
              placeholder="Confirmar Senha"
              style={[styles.input, { flex: 1 }]}
              value={form.confirmSenha}
              onChangeText={(text) => handleChange("confirmSenha", text)}
              editable={isEditing}
              onFocus={() => setFocusedField('confirmSenha')}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons
                name={showConfirm ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {isEditing && (
            <View style={styles.requisitos}>
              <Text style={{ color: checks.length ? "green" : "red" }}>• Mínimo de 8 caracteres</Text>
              <Text style={{ color: checks.upper ? "green" : "red" }}>• Pelo menos 1 letra maiúscula</Text>
              <Text style={{ color: checks.lower ? "green" : "red" }}>• Pelo menos 1 letra minúscula</Text>
              <Text style={{ color: checks.number ? "green" : "red" }}>• Pelo menos 1 número</Text>
              <Text style={{ color: checks.symbol ? "green" : "red" }}>• Pelo menos 1 símbolo (@ $ ! % * ? &)</Text>
            </View>
          )}

          <TextInput
            placeholder="Telefone *"
            style={styles.input}
            keyboardType="numeric"
            value={form.telefone}
            onChangeText={(text) => handleChange("telefone", formatTelefone(text))}
            onBlur={() => validarTelefone(form.telefone)}
            editable={isEditing}
            onFocus={() => setFocusedField('telefone')}
          />
          {erros.telefone ? <Text style={styles.erro}>{erros.telefone}</Text> : null}

          <TextInput
            placeholder="CEP"
            style={styles.input}
            keyboardType="numeric"
            maxLength={8}
            value={form.cep}
            onChangeText={(text) => handleChange("cep", text.replace(/\D/g, ""))}
            onBlur={() => buscarCep(form.cep)}
            editable={isEditing}
            onFocus={() => setFocusedField('cep')}
          />
          {erros.cep ? <Text style={styles.erro}>{erros.cep}</Text> : null}

          <TextInput
            placeholder="Rua"
            style={styles.input}
            value={form.endereco}
            onChangeText={(text) => handleChange("endereco", text)}
            editable={isEditing}
            onFocus={() => setFocusedField('endereco')}
            onBlur={() => setFocusedField(null)}
          />

          <View style={styles.row}>
            <TextInput
              placeholder="Número"
              style={[styles.input, styles.small]}
              keyboardType="numeric"
              value={form.numero}
              onChangeText={(text) => handleChange("numero", text.replace(/\D/g, ""))}
              editable={isEditing}
              onFocus={() => setFocusedField('numero')}
              onBlur={() => setFocusedField(null)}
            />
            <TextInput
              placeholder="Complemento"
              style={[styles.input, styles.medium]}
              value={form.complemento}
              onChangeText={(text) => handleChange("complemento", text)}
              editable={isEditing}
              onFocus={() => setFocusedField('complemento')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <TextInput
            placeholder="Bairro"
            style={styles.input}
            value={form.bairro}
            onChangeText={(text) => handleChange("bairro", text)}
            editable={isEditing}
            onFocus={() => setFocusedField('bairro')}
            onBlur={() => setFocusedField(null)}
          />

          <View style={styles.row}>
            <TextInput
              placeholder="Cidade"
              style={[styles.input, styles.medium]}
              value={form.cidade}
              onChangeText={(text) => handleChange("cidade", text)}
              editable={isEditing}
              onFocus={() => setFocusedField('cidade')}
              onBlur={() => setFocusedField(null)}
            />
            <TextInput
              placeholder="UF"
              style={[styles.input, styles.small]}
              value={form.uf}
              maxLength={2}
              autoCapitalize="characters"
              onChangeText={(text) => handleChange("uf", text)}
              editable={isEditing}
              onFocus={() => setFocusedField('uf')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* ✅ CAMPO DE TIPO AGORA É UM BOTÃO QUE ABRE MODAL */}
          <TouchableOpacity
            style={[styles.input, styles.tipoSelector]}
            onPress={() => isEditing && setShowTipoModal(true)}
            disabled={!isEditing}
          >
            <Text style={form.tipo ? styles.tipoTextSelected : styles.tipoTextPlaceholder}>
              {form.tipo || "Selecione o tipo de usuário *"}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#888" />
          </TouchableOpacity>

          {/* ✅ BOTÕES CONDICIONAIS */}
          {isEditing ? (
            <View style={styles.botoesContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.buttonCancelar]} 
                onPress={cancelarEdicao}
                disabled={salvando}
              >
                <Text style={styles.buttonTextCancelar}>CANCELAR</Text>
                <Ionicons name="close-outline" size={18} color="#FF6B6B" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, salvando && styles.buttonDisabled]} 
                onPress={handleButtonPress}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>SALVAR</Text>
                    <Ionicons name="save-outline" size={18} color="#00C7BE" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleButtonPress}
            >
              <Text style={styles.buttonText}>EDITAR PERFIL</Text>
              <Ionicons name="create-outline" size={18} color="#00C7BE" />
            </TouchableOpacity>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
    color: "#333",
  },
  // ✅ ESTILOS PARA O SELETOR DE TIPO
  tipoSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tipoTextSelected: {
    color: '#333',
  },
  tipoTextPlaceholder: {
    color: '#888',
  },
  // ✅ ESTILOS PARA O MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalOption: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
  },
  modalOptionSelected: {
    backgroundColor: '#00C7BE',
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  modalOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  modalClose: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  modalCloseText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  erro: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  small: {
    flex: 1,
    marginRight: 5,
  },
  medium: {
    flex: 2,
    marginRight: 5,
  },
  // ✅ NOVOS ESTILOS PARA BOTÕES
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonCancelar: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  buttonText: {
    color: "#00C7BE",
    fontWeight: "bold",
    marginRight: 5,
  },
  buttonTextCancelar: {
    color: "#FF6B6B",
    fontWeight: "bold",
    marginRight: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  requisitos: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  timeoutButton: {
    marginTop: 20,
    padding: 10,
  },
  timeoutText: {
    color: '#00C7BE',
    fontSize: 14,
    textAlign: 'center',
  },
});