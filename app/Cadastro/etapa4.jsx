import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { Footer } from "../../components/FooterCadastro";
import { useCadastro } from '../../context/CadastroContext';

export default function Etapa4() {
    const { dadosCadastro, atualizarDados } = useCadastro();
    const [telefone, setTelefone] = useState(dadosCadastro.telefone || "");
    const [cep, setCep] = useState(dadosCadastro.endereco?.cep || "");
    const [rua, setRua] = useState(dadosCadastro.endereco?.rua || "");
    const [numero, setNumero] = useState(dadosCadastro.endereco?.numero || "");
    const [complemento, setComplemento] = useState(dadosCadastro.endereco?.complemento || "");
    const [bairro, setBairro] = useState(dadosCadastro.endereco?.bairro || "");
    const [cidade, setCidade] = useState(dadosCadastro.endereco?.cidade || "");
    const [estado, setEstado] = useState(dadosCadastro.endereco?.estado || "");
    const [cepValido, setCepValido] = useState(false);
    const telefoneNumeros = telefone.replace(/\D/g, "");

    const avancarParaEtapa5 = () => {
        // Salvar dados no contexto antes de avançar
        atualizarDados({
            telefone: telefoneNumeros,
            endereco: {
                cep,
                rua,
                numero,
                complemento,
                bairro,
                cidade,
                estado
            }
        });
        router.push("/Cadastro/etapa5");
    };

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
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 40}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <ScrollView 
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        style={styles.scrollView}
                    >
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
                        
                        {/* Espaço extra para garantir que o conteúdo não fique escondido */}
                        <View style={styles.espacoExtra} />
                    </ScrollView>

                    {/* Footer com overlay branco */}
                    <View style={styles.footerOverlay}>
                        <View style={styles.footerWrapper}>
                            <Footer
                                etapa={4}
                                totalEtapas={5}
                                onPress={avancarParaEtapa5}
                                disabled={
                                    telefoneNumeros.length < 10 ||
                                    !cepValido ||
                                    rua.trim().length === 0 ||
                                    numero.trim().length === 0 ||
                                    bairro.trim().length === 0 ||
                                    cidade.trim().length === 0 ||
                                    estado.trim().length === 0
                                }
                            />
                        </View>
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
        position: 'relative',
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: "center",
        padding: 20,
        paddingTop: 40,
        paddingBottom: 120, // Espaço para o footer
    },
    title: {
        fontSize: 18,
        marginBottom: 30,
        textAlign: "center",
        fontWeight: "bold"
    },
    input: {
        width: "100%",
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: "#000",
        marginBottom: 15
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 15,
    },
    halfInput: {
        flex: 1
    },
    footerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        height: 150, 
    },
    footerWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    espacoExtra: {
        height: 50,
    }
});