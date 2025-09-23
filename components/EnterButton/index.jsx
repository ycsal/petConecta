import { Pressable, StyleSheet, Text } from "react-native";

export const EnterButton = ({ onPress, title, icon }) => {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            {icon}
            <Text style={styles.buttonText}>
                {title}
            </Text>
        </Pressable>   
    )
} 

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    backgroundColor: "#00645F",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,      
    alignSelf: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold"
  }
}); 