import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function MeuPerfil() {
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

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cepValido, setCepValido] = useState(false);
  const [foto, setFoto] = useState(null); 

  const [erros, setErros] = useState({
    email: "",
    telefone: "",
    cep: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
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

  const checks = {
    length: form.senha.length >= 8,
    upper: /[A-Z]/.test(form.senha),
    lower: /[a-z]/.test(form.senha),
    number: /\d/.test(form.senha),
    symbol: /[@$!%*?&]/.test(form.senha),
  };
  const requisitosValidos = Object.values(checks).every(Boolean);
  const senhasIguais =
    form.senha === form.confirmSenha && form.senha.length > 0;

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
        setForm({ ...form, endereco: "", bairro: "", cidade: "", uf: "" });
        setCepValido(false);
        return;
      }

      setErros((prev) => ({ ...prev, cep: "" }));
      setForm({
        ...form,
        endereco: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
        cep: onlyNumbers,
      });
      setCepValido(true);
    } catch (error) {
      setErros((prev) => ({ ...prev, cep: "Erro ao buscar CEP." }));
      setCepValido(false);
    }
  };

  const handleButtonPress = () => {
    if (isEditing) {
      const emailValido = validarEmail(form.email);
      const telefoneValido = validarTelefone(form.telefone);

      if (!emailValido || !telefoneValido || !cepValido) return;

      if (!requisitosValidos || !senhasIguais) {
        setErros((prev) => ({
          ...prev,
          senha: "A senha não atende os requisitos.",
        }));
        return;
      }

      console.log("Dados salvos:", form);
    }
    setIsEditing(!isEditing);
  };

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
            placeholder="Nome"
            style={styles.input}
            value={form.nome}
            onChangeText={(text) => handleChange("nome", text)}
            editable={isEditing}
          />

          <TextInput
            placeholder="E-mail"
            style={styles.input}
            value={form.email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => handleChange("email", text)}
            onBlur={() => validarEmail(form.email)}
            editable={isEditing}
          />
          {erros.email ? <Text style={styles.erro}>{erros.email}</Text> : null}

          <View style={styles.inputArea}>
            <TextInput
              placeholder="Senha"
              style={[styles.input, { flex: 1 }]}
              secureTextEntry={!showPassword}
              value={form.senha}
              onChangeText={(text) => handleChange("senha", text)}
              editable={isEditing}
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
              secureTextEntry={!showConfirm}
              value={form.confirmSenha}
              onChangeText={(text) => handleChange("confirmSenha", text)}
              editable={isEditing}
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
            placeholder="Telefone"
            style={styles.input}
            keyboardType="numeric"
            value={form.telefone}
            onChangeText={(text) => handleChange("telefone", formatTelefone(text))}
            onBlur={() => validarTelefone(form.telefone)}
            editable={isEditing}
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
          />
          {erros.cep ? <Text style={styles.erro}>{erros.cep}</Text> : null}

          <TextInput
            placeholder="Rua"
            style={styles.input}
            value={form.endereco}
            onChangeText={(text) => handleChange("endereco", text)}
            editable={isEditing}
          />

          <View style={styles.row}>
            <TextInput
              placeholder="Número"
              style={[styles.input, styles.small]}
              keyboardType="numeric"
              value={form.numero}
              onChangeText={(text) => handleChange("numero", text.replace(/\D/g, ""))}
              editable={isEditing}
            />
            <TextInput
              placeholder="Complemento"
              style={[styles.input, styles.medium]}
              value={form.complemento}
              onChangeText={(text) => handleChange("complemento", text)}
              editable={isEditing}
            />
          </View>

          <TextInput
            placeholder="Bairro"
            style={styles.input}
            value={form.bairro}
            onChangeText={(text) => handleChange("bairro", text)}
            editable={isEditing}
          />

          <View style={styles.row}>
            <TextInput
              placeholder="Cidade"
              style={[styles.input, styles.medium]}
              value={form.cidade}
              onChangeText={(text) => handleChange("cidade", text)}
              editable={isEditing}
            />
            <TextInput
              placeholder="UF"
              style={[styles.input, styles.small]}
              value={form.uf}
              maxLength={2}
              autoCapitalize="characters"
              onChangeText={(text) => handleChange("uf", text)}
              editable={isEditing}
            />
          </View>

          <TextInput
            placeholder="Tipo (Tutor, Protetor ou Abrigo)"
            style={styles.input}
            value={form.tipo}
            onChangeText={(text) => handleChange("tipo", text)}
            editable={isEditing}
          />

          <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
            <Text style={styles.buttonText}>
              {isEditing ? "SALVAR ALTERAÇÕES" : "EDITAR PERFIL"}
            </Text>
            <Ionicons
              name={isEditing ? "save-outline" : "create-outline"}
              size={18}
              color="#00C7BE"
            />
          </TouchableOpacity>
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
  button: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#00C7BE",
    fontWeight: "bold",
    marginRight: 5,
  },
  requisitos: {
    marginBottom: 10,
  },
});
