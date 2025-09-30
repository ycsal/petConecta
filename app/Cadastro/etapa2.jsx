import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Footer } from "../../components/FooterCadastro";

export default function Etapa2() {
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Digite seu e-mail
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Footer
        etapa={2}
        totalEtapas={5}
        onPress={() => router.push("/Cadastro/etapa3")}
        disabled={email.trim().length === 0}
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
