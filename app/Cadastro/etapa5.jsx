import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Footer } from "../../components/FooterCadastro";

export default function Etapa5() {
  const [tipoUsuario, setTipoUsuario] = useState("");

  const opcoes = [
    { key: "Adotante", desc: "Pessoa interessada em adotar um animal." },
    { key: "Protetor", desc: "Pessoa que resgata e cuida temporariamente de animais." },
    { key: "Abrigo", desc: "Organização ou espaço que acolhe vários animais." },
    { key: "Outro", desc: "Outro tipo de participante que não se encaixa nas categorias acima." },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Defina seu perfil de usuário</Text>

      <View style={styles.opcoesContainer}>
        {opcoes.map(({ key, desc }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.opcao,
              tipoUsuario === key && styles.opcaoSelecionada,
            ]}
            onPress={() => setTipoUsuario(key)}
          >
            <Text
              style={[
                styles.opcaoTexto,
                tipoUsuario === key && styles.opcaoTextoSelecionado,
              ]}
            >
              {key}
            </Text>
            <Text style={styles.opcaoDescricao}>{desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Footer
        etapa={5}
        totalEtapas={5}
        onPress={() => router.push("/Cadastro/etapaServico")}
        disabled={tipoUsuario.trim().length === 0}
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
    paddingBottom: 80
  },
  title: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  opcoesContainer: {
    width: "100%",
    marginBottom: 20,
  },
  opcao: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  opcaoSelecionada: {
    backgroundColor: "#00645F",
    borderColor: "#00645F",
  },
  opcaoTexto: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginBottom: 4,
  },
  opcaoTextoSelecionado: {
    color: "#fff",
    fontWeight: "bold",
  },
  opcaoDescricao: {
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
  },
  aviso: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
