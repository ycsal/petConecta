import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { API_PETS } from "../../config";


const statusOptions = [
  { label: "🐾 Para adoção", value: "Disponível" },
  { label: "🔍 Perdido", value: "Perdido" },
  { label: "🏠 Encontrado", value: "Encontrado" },
  { label: "✅ Adotado", value: "Adotado" },
];

export default function CadastroPet() {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  
  // Verifica se estamos editando
  const petParaEditar = route.params?.petParaEditar;
  const isEditing = !!petParaEditar;

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
    status: "Disponível"
  });

  const userId = "64f3e2a7c9d1f2b4a1e5f6a7";

  useEffect(() => {
    if (isEditing) {
      setPetData({
        nome: petParaEditar.nome || "",
        especie: petParaEditar.especie || "",
        raca: petParaEditar.raca || "",
        sexo: petParaEditar.sexo || "",
        idade: petParaEditar.idade ? petParaEditar.idade.toString() : "",
        porte: petParaEditar.porte || "",
        descricao: petParaEditar.descricao || "",
        foto: petParaEditar.foto || "",
        castrado: petParaEditar.castrado || false,
        vacinado: petParaEditar.vacinado || false,
        status: petParaEditar.status || "Disponível"
      });
      navigation.setOptions({ title: 'Editar Pet' });
    }
  }, [petParaEditar]);

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
    }
  };

  const handleChange = (key, value) => {
    setPetData((prev) => ({ ...prev, [key]: value }));
  };

  const handleStatusSelect = (statusValue) => {
    setPetData((prev) => ({ ...prev, status: statusValue }));
  };

  const toggleCheckbox = (field) => {
    setPetData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    if (!petData.nome || !petData.especie || !petData.porte || !petData.sexo || !petData.idade) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios (*)");
      return;
    }

    setLoading(true);

    try {
      const dadosParaEnviar = {
        id_usuario: userId,
        nome: petData.nome,
        especie: petData.especie,
        raca: petData.raca || "SRD",
        sexo: petData.sexo.toUpperCase(),
        idade: parseInt(petData.idade),
        porte: petData.porte,
        descricao: petData.descricao,
        foto: petData.foto,
        castrado: petData.castrado,
        vacinado: petData.vacinado,
        status: petData.status
      };

      let response;
      
      if (isEditing) {
        console.log("Atualizando pet ID:", petParaEditar._id);
        response = await fetch(`${API_PETS}/${petParaEditar._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosParaEnviar),
        });
      } else {
        console.log("Criando novo pet...");
        response = await fetch(`${API_PETS}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosParaEnviar),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      // --- CORREÇÃO AQUI: VOLTAR PARA MEUS PETS ---
      const mensagem = isEditing ? "Pet atualizado com sucesso!" : "Pet cadastrado com sucesso!";
      
      if (Platform.OS === 'web') {
        // Na Web, usamos o alert simples e forçamos a volta
        alert(mensagem);
        navigation.goBack(); 
      } else {
        // No celular, usamos o Alert bonito com callback
        Alert.alert("Sucesso!", mensagem, [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
      // ---------------------------------------------

    } catch (error) {
      console.log("Erro ao salvar pet:", error);
      Alert.alert("Erro", "Não foi possível salvar o pet. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
    >
      {/* Removido TouchableWithoutFeedback para funcionar clique no PC */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditing ? "Editar Pet" : "Cadastro Pet"}
          </Text>
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {petData.foto ? (
            <Image source={{ uri: petData.foto }} style={styles.petImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={32} color="#aaa" />
              <Text style={styles.imageText}>
                {isEditing ? "Alterar Foto" : "Adicionar Foto"}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome do Pet *"
            value={petData.nome}
            onChangeText={(t) => handleChange("nome", t)}
          />

          <TextInput
            style={styles.input}
            placeholder="Espécie (Cachorro, Gato...) *"
            value={petData.especie}
            onChangeText={(t) => handleChange("especie", t)}
          />

          <TextInput
            style={styles.input}
            placeholder="Raça (Opcional)"
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
            placeholder="Descrição do pet..."
            value={petData.descricao}
            onChangeText={(t) => handleChange("descricao", t)}
          />

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitText}>
                {isEditing ? "Atualizar Pet" : "Salvar Pet"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 40, paddingBottom: 20 },
  header: { marginBottom: 20 },
  headerTitle: { color: "#00C7BE", fontWeight: "bold", fontSize: 24, marginLeft: 10 },
  imagePicker: { alignSelf: "center", marginBottom: 20 },
  petImage: { width: 120, height: 120, borderRadius: 60 },
  imagePlaceholder: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: "#00C7BE", borderStyle: "dashed", justifyContent: "center", alignItems: "center", backgroundColor: "#f7f7f7" },
  imageText: { color: "#aaa", fontSize: 12, marginTop: 5 },
  form: { flex: 1 },
  input: { backgroundColor: "#f2f2f2", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 10 },
  textArea: { height: 100, textAlignVertical: "top" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { width: "48%" },
  statusSection: { marginBottom: 15 },
  sectionLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#333" },
  statusContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  statusOption: { width: "48%", padding: 12, borderRadius: 8, backgroundColor: "#f8f8f8", borderWidth: 1, borderColor: "#ddd", alignItems: "center", marginBottom: 10 },
  statusOptionSelected: { backgroundColor: "#00C7BE", borderColor: "#00C7BE" },
  statusOptionText: { fontSize: 13, color: "#666", textAlign: "center" },
  statusOptionTextSelected: { color: "#fff", fontWeight: "600" },
  checkboxRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", width: "48%" },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: "#00C7BE", borderRadius: 4, marginRight: 8, justifyContent: "center", alignItems: "center" },
  checkboxChecked: { backgroundColor: "#00C7BE" },
  checkboxLabel: { fontSize: 14, color: "#333" },
  submitButton: { backgroundColor: "#00C7BE", borderRadius: 8, padding: 14, alignItems: "center", marginBottom: 40, marginTop: 10 },
  submitButtonDisabled: { backgroundColor: "#ccc" },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});