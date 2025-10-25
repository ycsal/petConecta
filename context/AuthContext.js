import { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

const AuthContext = createContext();

// ⚠️ SUBSTITUA pelo seu IP real
const API_URL = "http://localhost:3001"; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async (userData) => {
    setLoading(true);
    try {
      console.log('Enviando dados para registro:', userData);
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('Resposta do servidor:', data);

      if (data.success) {
        setUser(data.user);
        Alert.alert('Sucesso!', 'Conta criada com sucesso');
        return { success: true, user: data.user };
      } else {
        Alert.alert('Erro', data.error || 'Erro ao criar conta');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.log('Erro no registro:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor');
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      register,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);