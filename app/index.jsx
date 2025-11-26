import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { EnterButton } from "../components/EnterButton";
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { login, loading } = useAuth();

  //Função de Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha email e senha");
      return;
    }
    const result = await login(email, password);
    
    // Se o login for bem-sucedido, o redirecionamento é tratado no AuthContext
    if (result.success) {
      console.log("Login bem-sucedido, redirecionando...");
      // O AuthContext já deve redirecionar automaticamente
    }
  };

  return (
    <View
      style={styles.container}
    >
      <Image source={require('../assets/images/logoBranco.png')} />
      <View style={styles.inputLogin}>
        <TextInput
          style={styles.textoLogin}
          placeholder="Email"
          placeholderTextColor="#00000070"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Campo de Senha com olho */}
      <View style={[styles.inputLogin, styles.inputSenha]}>
        <TextInput
          style={[styles.textoLogin, { flex: 1 }]}
          placeholder="Senha"
          placeholderTextColor="#00000070"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#00000070"
          />
        </TouchableOpacity>
      </View>

       <View>
        {/* ✅ CORRIGIDO: Usar handleLogin corretamente */}
        {loading ? (
          <View style={styles.loadingButton}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.loadingText}>Entrando...</Text>
          </View>
        ) : (
          <EnterButton 
            title="Entrar" 
            /*onPress={() => router.push('tabs/match')}*/ onPress={handleLogin} // ✅ Corrigido: passa a referência da função
          />
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Primeira vez aqui?</Text>
        <Pressable onPress={() => router.push("Cadastro/etapa1")}>
          <Text style={[styles.footerText, { textDecorationLine: 'underline' }]}>Cadastre-se!</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00C7BE",
    gap: 20
  },
  inputLogin: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    width: '80%',
    borderRadius: 10,
  },
  inputSenha: {
    justifyContent: "space-between"
  },
  textoLogin: {
    flex: 1,
    fontSize: 18,
    color: "#000",
    textAlign: "left"
  },
  title: {
    fontSize: 45,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },
  footer: {
    width: '80%',
    marginTop: 12
  },
  footerText: {
    color: "#014946ff",
    fontSize: 20,
    textAlign: "center"
  },
  loadingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  loadingText: {
    color: '#fff',
    fontSize: 16
  }
});