import { router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export const useAuthRedirect = (requireAuth = true) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Se precisa de auth mas não tem usuário → vai para login
        console.log('Redirecionando para login: usuário não autenticado');
        router.replace('/');
      } else if (!requireAuth && user) {
        // Se não precisa de auth mas tem usuário → vai para home
        console.log('Redirecionando para home: usuário já autenticado');
        router.replace('/tabs/match');
      }
    }
  }, [user, loading, requireAuth]);

  return { user, loading };
};