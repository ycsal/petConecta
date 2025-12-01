import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Footer } from "../../components/FooterCadastro";
import { useCadastro } from '../../context/CadastroContext';

export default function Etapa3() {
  const router = useRouter();
  const { dadosCadastro, atualizarDados } = useCadastro();
  const [password, setPassword] = useState(dadosCadastro.senha);
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const passwordInputRef = useRef(null);
  const confirmInputRef = useRef(null);

  // Regras de verificação
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[@$!%*?&]/.test(password),
  };

  const requisitosValidos = Object.values(checks).every(Boolean);
  const senhasIguais = password === confirm && password.length > 0;

  const avancar = () => {
    atualizarDados({ senha: password });
    router.push("/Cadastro/etapa4");
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.innerContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Agora crie uma senha para acessar:</Text>

          {/* Campo senha */}
          <View style={styles.inputArea}>
            <TextInput
              ref={passwordInputRef}
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#888"
              secureTextEntry={false} // Importante: false para captura
              value={showPassword ? password : "•".repeat(password.length)}
              onChangeText={(text) => {
                if (showPassword) {
                  // Se está mostrando, atualiza normalmente
                  setPassword(text);
                } else {
                  // Se está escondido, precisa de lógica especial
                  // Quando usuário digita com senha oculta
                  if (text.length > password.length) {
                    // Adicionou caractere
                    const newChar = text.charAt(text.length - 1);
                    if (newChar !== "•") {
                      setPassword(password + newChar);
                    }
                  } else if (text.length < password.length) {
                    // Removeu caractere
                    setPassword(password.slice(0, text.length));
                  }
                }
              }}
              autoCapitalize="none"
            />
            
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Campo confirmação - com a MESMA lógica */}
          <View style={styles.inputArea}>
            <TextInput
              ref={confirmInputRef}
              style={styles.input}
              placeholder="Confirme sua senha"
              placeholderTextColor="#888"
              secureTextEntry={false} // Também false para captura
              value={showConfirm ? confirm : "•".repeat(confirm.length)}
              onChangeText={(text) => {
                if (showConfirm) {
                  // Se está mostrando, atualiza normalmente
                  setConfirm(text);
                } else {
                  // Se está escondido, mesma lógica
                  if (text.length > confirm.length) {
                    // Adicionou caractere
                    const newChar = text.charAt(text.length - 1);
                    if (newChar !== "•") {
                      setConfirm(confirm + newChar);
                    }
                  } else if (text.length < confirm.length) {
                    // Removeu caractere
                    setConfirm(confirm.slice(0, text.length));
                  }
                }
              }}
              autoCapitalize="none"
            />
            
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons name={showConfirm ? "eye-off" : "eye"} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Requisitos */}
          <View style={styles.requisitos}>
            <Text style={[styles.reqItem, { color: checks.length ? "green" : "red" }]}>
              • Mínimo de 8 caracteres
            </Text>
            <Text style={[styles.reqItem, { color: checks.upper ? "green" : "red" }]}>
              • Pelo menos 1 letra maiúscula
            </Text>
            <Text style={[styles.reqItem, { color: checks.lower ? "green" : "red" }]}>
              • Pelo menos 1 letra minúscula
            </Text>
            <Text style={[styles.reqItem, { color: checks.number ? "green" : "red" }]}>
              • Pelo menos 1 número
            </Text>
            <Text style={[styles.reqItem, { color: checks.symbol ? "green" : "red" }]}>
              • Pelo menos 1 símbolo (@ $ ! % * ? &)
            </Text>
          </View>

          {!senhasIguais && confirm.length > 0 && (
            <Text style={{ color: "red", marginBottom: 10 }}>As senhas não coincidem</Text>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>

      <View style={styles.footerWrapper}>
        <Footer
          etapa={3}
          totalEtapas={5}
          onPress={avancar} 
          disabled={!requisitosValidos || !senhasIguais}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 100
  },
  title: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "bold",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    color: "#000",
  },
  requisitos: {
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  reqItem: {
    fontSize: 14,
    marginVertical: 2,
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});