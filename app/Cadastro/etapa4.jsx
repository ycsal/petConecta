import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { Footer } from "../../components/FooterCadastro";

export default function Etapa2() {
    const [telefone, setTelefone] = useState("");
    const [cep, setCep] = useState("");
    const [rua, setRua] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [cepValido, setCepValido] = useState(false);
    const telefoneNumeros = telefone.replace(/\D/g, "");


    const buscarCep = async (cepValue) => {
    const onlyNumbers = cepValue.replace(/\D/g, "");

    if (onlyNumbers.length !== 8) {
        setCepValido(false);
        return; 
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${onlyNumbers}/json/`);
        const data = await response.json();

        if (data.erro) {
            Alert.alert("CEP inválido", "Por favor, insira um CEP válido.");
            setRua("");
            setBairro("");
            setCidade("");
            setEstado("");
            setCepValido(false);
            return;
        }

        setRua(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");
        setEstado(data.uf || "");
        setCepValido(true); // CEP válido
    } catch (error) {
        Alert.alert("Erro", "Não foi possível buscar o CEP. Tente novamente.");
        setCepValido(false);
    }
};

    const formatTelefone = (value) => {
        let onlyNumbers = value.replace(/\D/g, "");
        onlyNumbers = onlyNumbers.slice(0, 11);

        if (onlyNumbers.length <= 10) {
            return onlyNumbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
        } else {
            return onlyNumbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Informe seu telefone e endereço</Text>

            <TextInput
                style={styles.input}
                placeholder="Telefone"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={telefone}
                onChangeText={(text) => {
                    const formatted = formatTelefone(text);
                    setTelefone(formatted);
                }}
            />

            <TextInput
                style={styles.input}
                placeholder="CEP"
                placeholderTextColor="#888"
                keyboardType="numeric"
                maxLength={8}
                value={cep}
                onChangeText={(text) => {
                    const onlyNumbers = text.replace(/\D/g, "");
                    setCep(onlyNumbers);
                }}
                onBlur={() => {
                    if (cep.length !== 8) {
                        Alert.alert("CEP inválido: o CEP deve ter 8 dígitos.");
                    } else {
                        buscarCep(cep);
                    }
                }}
            />

            <TextInput
                style={styles.input}
                placeholder="Rua"
                placeholderTextColor="#888"
                value={rua}
                onChangeText={setRua}
            />

            <View style={styles.row}>
                <TextInput
                    style={[styles.input, styles.halfInput, { marginRight: 10 }]}
                    placeholder="Número"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={numero}
                    onChangeText={(text) => {
                        const onlyNumbers = text.replace(/\D/g, ""); // só números
                        setNumero(onlyNumbers);
                    }}
                />
                <TextInput
                    style={[styles.input, styles.halfInput, { marginRight: 0 }]}
                    placeholder="Complemento"
                    placeholderTextColor="#888"
                    value={complemento}
                    onChangeText={setComplemento}
                />
            </View>

            {/* Bairro */}
            <TextInput
                style={styles.input}
                placeholder="Bairro"
                placeholderTextColor="#888"
                value={bairro}
                onChangeText={setBairro}
            />


            <View style={styles.row}>
                <TextInput
                    style={[styles.input, styles.halfInput, { marginRight: 10 }]}
                    placeholder="Cidade"
                    placeholderTextColor="#888"
                    value={cidade}
                    onChangeText={setCidade}
                />
                <TextInput
                    style={[styles.input, styles.halfInput, { marginRight: 0 }]}
                    placeholder="Estado"
                    placeholderTextColor="#888"
                    value={estado}
                    onChangeText={setEstado}
                />
            </View>

            <Footer
                etapa={4}
                totalEtapas={5}
                onPress={() => router.push("/Cadastro/etapa5")}
                disabled={
                    telefoneNumeros.length < 10 ||
                    !cepValido ||
                    rua.trim().length === 0 ||
                    numero.trim().length === 0 ||
                    cidade.trim().length === 0 ||
                    estado.trim().length === 0
                }
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
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    halfInput: {
        flex: 1
    },
});
