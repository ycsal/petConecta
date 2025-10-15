import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Footer } from "../../components/FooterCadastro";

export default function Etapa5() {
    const [prestadorServico, setPrestadorServico] = useState(null);

    const handleNext = () => {
        if (prestadorServico === "Sim") {
            router.replace("../CadastroServico"); 
        } else if (prestadorServico === "Não") {
            router.replace("../tabs/match"); 
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Você também é prestador de serviços Pet?
            </Text>

            <View style={styles.prestadorBotoes}>
                <TouchableOpacity
                    style={[
                        styles.prestadorBotao,
                        prestadorServico === "Sim" && styles.botaoSelecionado,
                    ]}
                    onPress={() => setPrestadorServico("Sim")}
                >
                    <Text
                        style={[
                            styles.prestadorBotaoTexto,
                            prestadorServico === "Sim" && styles.textoSelecionado,
                        ]}
                    >
                        Sim
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.prestadorBotao,
                        prestadorServico === "Não" && styles.botaoSelecionado,
                    ]}
                    onPress={() => setPrestadorServico("Não")}
                >
                    <Text
                        style={[
                            styles.prestadorBotaoTexto,
                            prestadorServico === "Não" && styles.textoSelecionado,
                        ]}
                    >
                        Não
                    </Text>
                </TouchableOpacity>
            </View>

            <Footer
                etapa={"extra"}
                totalEtapas={"prestadores de serviço"}
                onPress={handleNext}
                disabled={prestadorServico === null}
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
    },
    title: {
        fontSize: 16,
        marginBottom: 40,
        textAlign: "center",
        fontWeight: "bold",
    },
    prestadorBotoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginBottom: 40,
    },
    prestadorBotao: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: "#B6ECF2",
        borderWidth: 1,
        borderColor: "#B6ECF2",
        alignItems: "center",
    },
    botaoSelecionado: {
        backgroundColor: "#00C7BE",
        borderColor: "#00C7BE",
    },
    prestadorBotaoTexto: {
        color: "#00645F",
        fontWeight: "600",
        fontSize: 16,
    },
    textoSelecionado: {
        color: "#fff",
        fontWeight: "bold",
    },
});
