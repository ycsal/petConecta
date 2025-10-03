import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Footer } from "../../components/FooterCadastro";

export default function Etapa2() {
  const [email, setEmail] = useState("");
  const [emailValido, setEmailValido] = useState(false);

  const validarEmail = (texto) => {
    setEmail(texto);

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValido(regex.test(texto.trim()));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digite seu e-mail</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        placeholderTextColor="#888"
        value={email}
        onChangeText={validarEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Footer
        etapa={2}
        totalEtapas={5}
        onPress={() => router.push("/Cadastro/etapa3")}
        disabled={!emailValido}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
});
