import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

const AuthContext = createContext();

// ⚠️ SUBSTITUA pelo seu IP real
const API_URL = "http://192.168.1.8:3001"; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        console.log('Usuário recuperado do storage:', JSON.parse(storedUser).email);
      }
    } catch (error) {
      console.log('Erro ao recuperar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

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
        await AsyncStorage.setItem('@user', JSON.stringify(data.user));
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

  const login = async (email, senha) => {
  setLoading(true);
  try {
    console.log('Tentando login:', email);
    
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    console.log('Resposta do login:', data);

    if (data.success) {
      setUser(data.user);
      await AsyncStorage.setItem('@user', JSON.stringify(data.user));
      console.log('Usuário salvo no storage');
      Alert.alert('Sucesso!', 'Login realizado com sucesso');
      router.replace('/tabs/match');
      return { success: true, user: data.user };
    } else {
      Alert.alert('Erro', data.error || 'Erro ao fazer login');
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.log('Erro no login:', error);
    Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    return { success: false, error: 'Erro de conexão' };
  } finally {
    setLoading(false);
  }
};
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@user');
      setUser(null);
      console.log('Usuário deslogado e storage limpo');
    } catch (error) {
      console.log('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      register,
      loading,
      login,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
