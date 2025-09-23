import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { EnterButton } from "../components/EnterButton";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Image source={require('../assets/images/logoBranco.png')}/> 
      <View style={styles.inputLogin}>
        <text style={styles.textoLogin}>Email</text>
      </View>
      <View style={styles.inputLogin}>
        <Text style={styles.textoLogin}>Senha</Text>
      </View>
      <View>
        <EnterButton title="Entrar" onPress={()=> console.log('entrar match')}/> 
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Primeira vez aqui?</Text>
        <Pressable>
          <Text style={styles.footerText}>Cadastre-se!</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00C7BE",
    gap: 20
  },
  inputLogin: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    width: '80%',
    borderRadius: 10,
    gap: 12
  },
  textoLogin: {
    fontSize: 18,
    color: "#00000070",
    textAlign: "left"
  },
  title: {
    fontSize: 45,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },
  footer: {
    width: '80%',
    marginTop: 12
  },
  footerText: {
    color: "#014946ff",
    fontSize: 20,
    textAlign: "center"
  }
});
