import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, View } from "react-native";


export default function SobreNos() {
    const equipe = [
        {
            nome: "Arthur Duvareski",
            telefone: "13 98106-8898",
            email: "drfarthur@gmail.com",
            foto: require("../../assets/images/cachorrofeio.jpg"),
            posicaoFoto: "esquerda"
        },
        {
            nome: "Bruno Peres",
            telefone: "13 97417-7986",
            email: "oooo@gmail.com",
            foto: require("../../assets/images/cachorrofeio.jpg"),
            posicaoFoto: "direita"
        },
        {
            nome: "Nathan Holtz",
            telefone: "13 98229-0059",
            email: "ooooo@gmail.com",
            foto: require("../../assets/images/cachorrofeio.jpg"),
            posicaoFoto: "esquerda"
        },
        {
            nome: "Yasmin Costa",
            telefone: "13 97409-8877",
            email: "yascsalgado@gmail.com",
            foto: require("../../assets/images/cachorrofeio.jpg"),
            posicaoFoto: "direita"
        },
    ];
    return (
        <ScrollView contentContainerStyle={styles.container}>

            {equipe.map((pessoa, index) => (
                <View key={index}
                    style={[
                        styles.card,
                        index % 2 === 0 ? styles.cardEsquerda : styles.cardDireita
                    ]}
                >
                    <Image source={pessoa.foto} style={styles.foto} />
                    <View style={[
                        styles.info,
                        index % 2 === 0 ? styles.textoEsquerda : styles.textoDireita
                    ]}>
                        <Text style={styles.nome}>{pessoa.nome}</Text>
                        <Text style={styles.texto}>{pessoa.telefone}</Text>
                        <Text style={styles.texto}>{pessoa.email}</Text>
                    </View>
                </View>
            ))}

            <Text style={styles.descricao}>
                Somos uma equipe de estudantes da Faculdade de Tecnologia de São Paulo,
                em Santos, e estamos desenvolvendo esse aplicativo para salvar todos os
                cães do universo. Apenas cães.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "#fff"
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        width: "100%",
        justifyContent: "space-between"
    },
    cardEsquerda: {
        flexDirection: "row"
    },
    cardDireita: {
        flexDirection: "row-reverse"
    },
    foto: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    info: {
        flex: 1,
        marginLeft: 15
    },
    nome: {
        fontSize: 16,
        fontWeight: "bold"
    },
    texto: {
        fontSize: 14,
        color: "#333"
    },
    textoEsquerda: {
        alignItems: "flex-start",
        textAlign: "left",
        marginLeft: 15
    },
    textoDireita: {
        alignItems: "flex-end",
        textAlign: "right",
        marginRight: 15
    },
    descricao: {
        marginTop: 20,
        fontSize: 14,
        textAlign: "justify"
    },
});