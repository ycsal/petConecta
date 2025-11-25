import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Footer } from "../../components/FooterCadastro";
import { useCadastro } from '../../context/CadastroContext';

export default function Etapa1() {
  const { dadosCadastro, atualizarDados } = useCadastro();
  const [nome, setNome] = useState(dadosCadastro.nome);
  const [sobrenome, setSobrenome] = useState(dadosCadastro.sobrenome);

  const avancar = () => {
    atualizarDados({ nome, sobrenome });
    router.push("/Cadastro/etapa2");
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
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

          <View style={styles.footerWrapper}>
            <Footer
              etapa={1}
              totalEtapas={5}
              onPress={avancar}
              disabled={nome.trim().length === 0 || sobrenome.trim().length === 0}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
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
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});