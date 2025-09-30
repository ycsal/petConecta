import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Footer } from "../../components/FooterCadastro";

export default function Etapa1() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informe seu nome e sobrenome</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#888"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Sobrenome"
        placeholderTextColor="#888"
        value={sobrenome}
        onChangeText={setSobrenome}
      />

      <Footer
        etapa={1}
        totalEtapas={5}
        onPress={() => router.push("/Cadastro/etapa2")}
        disabled={nome.trim().length === 0 || sobrenome.trim().length === 0}
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
    padding: 20
  },
  title: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "bold"
  },
  input: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
    marginBottom: 20
  },
});
