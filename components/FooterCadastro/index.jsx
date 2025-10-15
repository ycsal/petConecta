import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const Footer = ({ etapa, totalEtapas, onPress, disabled }) => {
  return (
    <View style={styles.footer}>
      <View style={styles.progressContainer}>
        <Text style={styles.footerText}>
          Etapa {etapa} de {totalEtapas}
        </Text>
        <TouchableOpacity
          style={[styles.circleButton, disabled && styles.disabledButton]}
          onPress={onPress}
          disabled={disabled}
        >
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Nova frase abaixo, centralizada */}
      <Text style={styles.infoText}>
        Sente que errou alguma coisa? Você poderá editar sua conta depois!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#00645F",
    paddingTop: 10,
    paddingBottom: 10,
  },
  footerText: {
    color: "#00645F",
    fontSize: 14,
    fontWeight: "500",
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: 10,
    backgroundColor: "#00645F",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#b2dfdb",
  },
  infoText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
    color: "#888",
  },
});
