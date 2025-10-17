import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

const API_BASE = "http://localhost:8081"; // ajuste IP

export default function EditarPet() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    // Dados de exemplo para visualização
    nome: "Rex",
    status: "Adotável",
    situacao: "Encontrado",
    dataNascimento: "15/03/2020",
    contato: "13 99999-9999",
    endereco: "Rua das Flores, 123 - Centro",
    especie: "Cachorro",
    raca: "Vira-lata",
    porte: "Médio",
    cor: "Caramelo",
    castrado: true,
    vacinado: false,
    descricao: "Cachorro muito brincalhão e carinhoso. Adora crianças e outros animais."
  });

  // CONEXÃO COM BANCO DE DADOS - Buscar pet pelo ID
  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        /* 
        // DESCOMENTAR PARA CONECTAR COM BANCO:
        const response = await fetch(`${API_BASE}/pets/${id}`);
        if (response.ok) {
          const petData = await response.json();
          setForm(petData);
        } else {
          console.error("Erro ao buscar pet");
        }
        */
        setLoading(false);
      } catch (error) {
        console.error("Erro na requisição:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchPet();
    } else {
      setLoading(false);
    }
  }, [id]);

  // CONEXÃO COM BANCO DE DADOS - Salvar alterações
  const handleSalvar = async () => {
    try {
      setSaving(true);
      /* 
      // DESCOMENTAR PARA CONECTAR COM BANCO:
      const response = await fetch(`${API_BASE}/pets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      if (response.ok) {
        router.back(); // Volta para tela anterior
      } else {
        console.error("Erro ao salvar pet");
      }
      */
      
      // Simulação de salvamento (remover quando conectar ao banco)
      setTimeout(() => {
        setSaving(false);
        router.back();
      }, 1000);
      
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#00C7BE" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>EDITAR - PET</Text>

      {/* Campos obrigatórios marcados com * conforme o design */}
      <TextInput 
        style={styles.input} 
        placeholder="Nome do Pet *" 
        value={form.nome} 
        onChangeText={(v) => setForm({ ...form, nome: v })} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Selecionar Status (ex: Adotável) *" 
        value={form.status} 
        onChangeText={(v) => setForm({ ...form, status: v })} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Encontrado/Perdido? *" 
        value={form.situacao} 
        onChangeText={(v) => setForm({ ...form, situacao: v })} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Data de Nascimento" 
        value={form.dataNascimento} 
        onChangeText={(v) => setForm({ ...form, dataNascimento: v })} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Contato *" 
        value={form.contato} 
        onChangeText={(v) => setForm({ ...form, contato: v })} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Endereço *" 
        value={form.endereco} 
        onChangeText={(v) => setForm({ ...form, endereco: v })} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Espécie *" 
        value={form.especie} 
        onChangeText={(v) => setForm({ ...form, especie: v })} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Raça" 
        value={form.raca} 
        onChangeText={(v) => setForm({ ...form, raca: v })} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Porte" 
        value={form.porte} 
        onChangeText={(v) => setForm({ ...form, porte: v })} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Cor" 
        value={form.cor} 
        onChangeText={(v) => setForm({ ...form, cor: v })} 
      />

      {/* Switches para opções booleanas */}
      <View style={styles.switchRow}>
        <Text>Castrado?</Text>
        <Switch 
          value={form.castrado} 
          onValueChange={(v) => setForm({ ...form, castrado: v })} 
          trackColor={{ false: "#767577", true: "#00C7BE" }}
        />
      </View>

      <View style={styles.switchRow}>
        <Text>Vacinado?</Text>
        <Switch 
          value={form.vacinado} 
          onValueChange={(v) => setForm({ ...form, vacinado: v })} 
          trackColor={{ false: "#767577", true: "#00C7BE" }}
        />
      </View>

      {/* Campo de descrição maior */}
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        placeholder="Descrição (Características, comportamento...)"
        value={form.descricao}
        onChangeText={(v) => setForm({ ...form, descricao: v })}
      />

      <Text style={styles.obrigatorio}>* Campos obrigatórios</Text>

      <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    padding: 16 
  },
  title: { 
    color: "#00C7BE", 
    fontSize: 20, 
    fontWeight: "700", 
    textAlign: "center", 
    marginBottom: 20 
  },
  input: { 
    backgroundColor: "#F2F2F2", 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 12,
    fontSize: 16
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  switchRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 15,
    paddingHorizontal: 5
  },
  button: { 
    backgroundColor: "#00C7BE", 
    padding: 16, 
    borderRadius: 8, 
    alignItems: "center",
    marginTop: 10
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 16
  },
  obrigatorio: {
    color: "#666",
    fontSize: 12,
    marginBottom: 10,
    fontStyle: 'italic'
  }
});