import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  View
} from "react-native";

// URL da sua API - ATUALIZE com seu IP local
const API_URL = "http://localhost:3001/api/pets";

// Opções de status
const statusOptions = [
  { label: "🐾 Para adoção", value: "Disponível" },
  { label: "🔍 Perdido", value: "Perdido" },
  { label: "🏠 Encontrado", value: "Encontrado" },
  { label: "✅ Adotado", value: "Adotado" },
];

export default function CadastroPet() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  
  // Estado do formulário ajustado para o modelo do seu Pet
  const [petData, setPetData] = useState({
    nome: "",
    especie: "",
    raca: "",
    sexo: "",
    idade: "",
    porte: "",
    descricao: "",
    foto: "",
    castrado: false,
    vacinado: false,
    status: "Disponível" // Novo campo com valor padrão
  });

  // TEMPORÁRIO: ID do usuário fixo para testes
  const userId = "SEU_USER_ID_AQUI"; // ← SUBSTITUA por um ID real

  // Função para selecionar imagem
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setPetData({ ...petData, foto: result.assets[0].uri });
      }
    } catch (error) {
      console.log("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem");
    }
  };

  // Função para atualizar estado dos campos
  const handleChange = (key, value) => {
    setPetData((prev) => ({ ...prev, [key]: value }));
  };

  // Função para selecionar status
  const handleStatusSelect = (statusValue) => {
    setPetData((prev) => ({ ...prev, status: statusValue }));
  };

  // Enviar dados para o backend
  const handleSubmit = async () => {
    // Validação dos campos obrigatórios
    if (!petData.nome || !petData.especie || !petData.porte || !petData.sexo || !petData.idade) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios (*)");
      return;
    }

    // Validação do sexo
    if (petData.sexo.toUpperCase() !== 'M' && petData.sexo.toUpperCase() !== 'F') {
      Alert.alert("Atenção", "Sexo deve ser 'M' ou 'F'");
      return;
    }

    // Validação do status
    if (!petData.status) {
      Alert.alert("Atenção", "Selecione a situação do pet");
      return;
    }

    setLoading(true);

    try {
      // Preparar dados para enviar
      const dadosParaEnviar = {
        id_usuario: userId,
        nome: petData.nome,
        especie: petData.especie,
        raca: petData.raca,
        sexo: petData.sexo.toUpperCase(),
        idade: parseInt(petData.idade),
        porte: petData.porte,
        descricao: petData.descricao,
        foto: petData.foto,
        castrado: petData.castrado,
        vacinado: petData.vacinado,
        status: petData.status // Usar o status selecionado
      };

      console.log("Enviando dados:", dadosParaEnviar);

      const response = await fetch(`${API_URL}/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const novoPet = await response.json();
      
      Alert.alert(
        "Sucesso!", 
        `Pet ${novoPet.nome} cadastrado com sucesso!`,
        [
          { 
            text: "OK", 
            onPress: () => navigation.goBack() 
          }
        ]
      );

    } catch (error) {
      console.log("Erro ao cadastrar pet:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o pet. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle para checkboxes
  const toggleCheckbox = (field) => {
    setPetData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>CADASTRO - PET</Text>
          </View>

          {/* Foto */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {petData.foto ? (
              <Image source={{ uri: petData.foto }} style={styles.petImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={32} color="#aaa" />
                <Text style={styles.imageText}>Adicionar Foto</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Campos do Formulário */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nome do Pet *"
              value={petData.nome}
              onChangeText={(t) => handleChange("nome", t)}
            />

            <TextInput
              style={styles.input}
              placeholder="Espécie (Cachorro, Gato, etc.) *"
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
                placeholder="Sexo (M/F) *"
                value={petData.sexo}
                onChangeText={(t) => handleChange("sexo", t)}
                maxLength={1}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Idade (anos) *"
                value={petData.idade}
                onChangeText={(t) => handleChange("idade", t)}
                keyboardType="numeric"
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Porte (Pequeno, Médio, Grande) *"
              value={petData.porte}
              onChangeText={(t) => handleChange("porte", t)}
            />

            {/* NOVO: Seleção de Status */}
            <View style={styles.statusSection}>
              <Text style={styles.sectionLabel}>Situação do Pet *</Text>
              <View style={styles.statusContainer}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.statusOption,
                      petData.status === option.value && styles.statusOptionSelected
                    ]}
                    onPress={() => handleStatusSelect(option.value)}
                  >
                    <Text style={[
                      styles.statusOptionText,
                      petData.status === option.value && styles.statusOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Checkboxes */}
            <View style={styles.checkboxRow}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => toggleCheckbox('castrado')}
              >
                <View style={[styles.checkbox, petData.castrado && styles.checkboxChecked]}>
                  {petData.castrado && <Ionicons name="checkmark" size={16} color="#FFF" />}
                </View>
                <Text style={styles.checkboxLabel}>Castrado</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => toggleCheckbox('vacinado')}
              >
                <View style={[styles.checkbox, petData.vacinado && styles.checkboxChecked]}>
                  {petData.vacinado && <Ionicons name="checkmark" size={16} color="#FFF" />}
                </View>
                <Text style={styles.checkboxLabel}>Vacinado</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              placeholder="Descrição do pet (comportamento, características...)"
              value={petData.descricao}
              onChangeText={(t) => handleChange("descricao", t)}
            />

            <Text style={styles.requiredText}>*: Campos obrigatórios</Text>

            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitText}>Salvar Pet</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#00C7BE",
    fontWeight: "bold",
    fontSize: 24,
    marginLeft: 10,
  },
  imagePicker: {
    alignSelf: "center",
    marginBottom: 20,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#00C7BE",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  imageText: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 5,
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  // NOVOS ESTILOS PARA A SELEÇÃO DE STATUS
  statusSection: {
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statusOption: {
    width: "48%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    marginBottom: 10,
  },
  statusOptionSelected: {
    backgroundColor: "#00C7BE",
    borderColor: "#00C7BE",
  },
  statusOptionText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  statusOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#00C7BE",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#00C7BE",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
  },
  requiredText: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#00C7BE",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});