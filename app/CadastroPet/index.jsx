import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "http://SEU_SERVIDOR_API"; // Substitua pelo seu endpoint Node.js

export default function CadastroPet({ navigation }) {
  const [petData, setPetData] = useState({
    nome: "",
    status: "",
    encontradoPerdido: "",
    data: "",
    contato: "",
    endereco: "",
    especie: "",
    raca: "",
    porte: "",
    cor: "",
    castrado: "",
    vacinado: "",
    descricao: "",
    imagem: null,
  });

  // Função para atualizar estado dos campos
  const handleChange = (key, value) => {
    setPetData((prev) => ({ ...prev, [key]: value }));
  };

  // Escolher imagem
  const pickImage = () => {
  alert("Função de escolher imagem ainda não implementada!");
};

  // Enviar dados para o backend
  const handleSubmit = async () => {
    if (!petData.nome || !petData.status || !petData.especie) {
      alert("Preencha os campos obrigatórios (*)");
      return;
    }

    const formData = new FormData();
    Object.entries(petData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (petData.imagem) {
      formData.append("imagem", {
        uri: petData.imagem,
        name: "pet.jpg",
        type: "image/jpeg",
      });
    }

    try {
      const response = await fetch(`${API_URL}/pets`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.ok) {
        alert("Pet cadastrado com sucesso!");
        navigation.goBack();
      } else {
        alert("Erro ao cadastrar pet.");
      }
    } catch (error) {
      console.log("Erro:", error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#00BCCD" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CADASTRO - PET</Text>
      </View>

      {/* Foto */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {petData.imagem ? (
          <Image source={{ uri: petData.imagem }} style={styles.petImage} />
        ) : (
          <Ionicons name="camera" size={32} color="#aaa" />
        )}
      </TouchableOpacity>

      {/* Campos */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome do Pet"
          value={petData.nome}
          onChangeText={(t) => handleChange("nome", t)}
        />
        <TextInput
          style={styles.input}
          placeholder="*Selecionar Status"
          value={petData.status}
          onChangeText={(t) => handleChange("status", t)}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Encontrado/Perdido?"
            value={petData.encontradoPerdido}
            onChangeText={(t) => handleChange("encontradoPerdido", t)}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Data"
            value={petData.data}
            onChangeText={(t) => handleChange("data", t)}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Contato"
          value={petData.contato}
          onChangeText={(t) => handleChange("contato", t)}
        />
        <TextInput
          style={styles.input}
          placeholder="Endereço"
          value={petData.endereco}
          onChangeText={(t) => handleChange("endereco", t)}
        />
        <TextInput
          style={styles.input}
          placeholder="*Espécie"
          value={petData.especie}
          onChangeText={(t) => handleChange("especie", t)}
        />
        <TextInput
          style={styles.input}
          placeholder="Raça"
          value={petData.raca}
          onChangeText={(t) => handleChange("raca", t)}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="*Porte P/M/G"
            value={petData.porte}
            onChangeText={(t) => handleChange("porte", t)}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="*Cor"
            value={petData.cor}
            onChangeText={(t) => handleChange("cor", t)}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Castrado?"
            value={petData.castrado}
            onChangeText={(t) => handleChange("castrado", t)}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Vacinado?"
            value={petData.vacinado}
            onChangeText={(t) => handleChange("vacinado", t)}
          />
        </View>

        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          multiline
          placeholder="Descrição (Coleira, Comportamento...)"
          value={petData.descricao}
          onChangeText={(t) => handleChange("descricao", t)}
        />

        <Text style={styles.requiredText}>*: Obrigatório</Text>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Salvar Pet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#00BCCD",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
  imagePicker: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    marginBottom: 16,
  },
  petImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  form: {
    flex: 1,
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  requiredText: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#00BCCD",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 40,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
