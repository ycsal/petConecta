import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditarServico() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [servico, setServico] = useState({ titulo: "", descricao: "", preco: "" });

  useEffect(() => {
    if (id) {
      // TODO: buscar serviço real do backend
      /*
      fetch(`http://localhost:3000/servicos/${id}`)
        .then(res => res.json())
        .then(data => setServico(data));
      */
      // mock:
      setServico({ titulo: "Banho e Tosa", descricao: "Banho completo", preco: "60" });
    }
  }, [id]);

  const handleSalvar = async () => {
    if (!servico.titulo) {
      Alert.alert("Atenção", "Informe o título.");
      return;
    }

    // TODO: enviar PUT/PATCH para backend
    /*
    await fetch(`http://localhost:3000/servicos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(servico),
    });
    */

    Alert.alert("Sucesso", "Serviço atualizado!");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Serviço</Text>

      <TextInput style={styles.input} value={servico.titulo} onChangeText={(v) => setServico({ ...servico, titulo: v })} placeholder="Título" />
      <TextInput style={styles.input} value={servico.descricao} onChangeText={(v) => setServico({ ...servico, descricao: v })} placeholder="Descrição" multiline />
      <TextInput style={styles.input} value={servico.preco} onChangeText={(v) => setServico({ ...servico, preco: v })} placeholder="Preço" keyboardType="numeric" />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  input: { backgroundColor: "#FFF", padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: "#EAEAEA" },
  button: { backgroundColor: "#00C7BE", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontWeight: "700" },
});
