import { createContext, useContext, useState } from 'react';

const CadastroContext = createContext();

export const CadastroProvider = ({ children }) => {
  const [dadosCadastro, setDadosCadastro] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    tipoUsuario: ''
  });

  const atualizarDados = (novosDados) => {
    setDadosCadastro(prev => ({ ...prev, ...novosDados }));
  };

  const limparDados = () => {
    setDadosCadastro({
      nome: '',
      sobrenome: '',
      email: '',
      senha: '',
      telefone: '',
      endereco: {
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
      },
      tipoUsuario: ''
    });
  };

  return (
    <CadastroContext.Provider value={{
      dadosCadastro,
      atualizarDados,
      limparDados
    }}>
      {children}
    </CadastroContext.Provider>
  );
};

export const useCadastro = () => useContext(CadastroContext);