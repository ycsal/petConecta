import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, View } from "react-native";


export default function SobreNos() {
    const equipe = [
        {
            nome: "Arthur D. R. Fabri",
            email: "arthurdrfabri@gmail.com",
            foto: require("../../assets/images/arthur.jpg")
        },
        {
            nome: "Bruno C. Peres",
            email: "bruno.perescp@gmail.com",
            foto: require("../../assets/images/bruno.jpg")
        },
        {
            nome: "Nathan H. M. Rodrigues",
            email: "nathan.holtz0805@gmail.com",
            foto: require("../../assets/images/nathan.jpg")
        },
        {
            nome: "Yasmin C. Salgado",
            email: "yascsalgado@gmail.com",
            foto: require("../../assets/images/yasmin.jpg")
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
                        <Text style={styles.texto}>{pessoa.email}</Text>
                    </View>
                </View>
            ))}

            <Text style={styles.descricao}>
                O PetConecta é um aplicativo desenvolvido por nós, Arthur, Bruno, Nathan e Yasmin, alunos da Faculdade de Tecnologia Baixada Santista - Rubens Lara, como Trabalho de Conclusão de Curso (TCC) do curso de Análise e Desenvolvimento de Sistemas. {"\n"}
                O projeto foi criado com o objetivo de unir tutores, abrigos, prestadores de serviços e a comunidade para estimular adoção responsável e auxiliar a encontrar pets perdidos. O aplicativo une perfis de animais para adoção, de protetores e de prestadores de serviço e mapas interativos com serviços como clínicas, pet shops, abrigos e serviços diversos.{"\n"}
                O desenvolvimento do aplicativo tem como objetivo acelerar o processo de adoção e reencontro de pets, torná-lo seguro e cooperativo, apoiando protetores e abrigos, e com o seu uso, contribuir para a luta contra o abandono de animais, unindo tecnologia e responsabilidade social para um projeto de aplicação prática.
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