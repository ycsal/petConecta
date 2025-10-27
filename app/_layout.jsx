import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CadastroProvider } from '../context/CadastroContext';
import { FilterProvider } from '../context/FilterContext';

function RootLayoutNav() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00C7BE' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        // Usuário NÃO logado - Telas
        <>
          <Stack.Screen name="index" />
          <Stack.Screen name="Cadastro" />
        </>
      ) : (
        // Usuário LOGADO - Telas
        <>
          <Stack.Screen name="tabs" />
          <Stack.Screen name="CadastroServico" />
          <Stack.Screen name="MeusPets" />
          {/* Adicione outras telas protegidas aqui */}
        </>
      )}
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
    <CadastroProvider>
    <FilterProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: '#00C7BE',
            drawerStyle: { backgroundColor: '#fff' },
            drawerLabelStyle: { color: '#00C7BE' },
          }}
        >

          <Drawer.Screen
            name="index"
            options={{ headerShown: false, drawerItemStyle: { display: 'none' } }}
          />
          <Drawer.Screen
            name="tabs"
            options={{ drawerLabel: 'Menu', title: "" }}
          />
          <Drawer.Screen
            name="configuracoes/meusServicos"
            options={{ drawerLabel: 'Meus Serviços', title: "" }}
          />
          <Drawer.Screen
            name="configuracoes/minhaConta"
            options={{ drawerLabel: 'Minha Conta', title: "Minha Conta" }}
          />
          <Drawer.Screen
            name="configuracoes/sobreNos"
            options={{ drawerLabel: 'Sobre Nós', title: "Sobre Nós" }}
          />
          <Drawer.Screen
            name="CadastroPet/index"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => (
                <Ionicons name='arrow-back' size={24} color='#00C7BE' style={{ marginLeft: 16 }} onPress={() => router.navigate('tabs/meusPets')} />
              )
            }}
          />
          <Drawer.Screen
            name="pet/[id]" 
            options={{ drawerItemStyle: { display: 'none' }, title: "Detalhes do Pet",
          headerLeft: () => (
                <Ionicons name='arrow-back' size={24} color='#00C7BE' style={{ marginLeft: 16 }} onPress={() => router.navigate('tabs/meusMatches')} />
              ) }}
          />
          <Drawer.Screen
            name="Cadastro/etapa1"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => (
                <Ionicons name='arrow-back' size={24} color='#00C7BE' style={{ marginLeft: 16 }} onPress={() => router.navigate(' ')} />
              )
            }}
          />
          <Drawer.Screen
            name="Cadastro/etapa2"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => (
                <Ionicons name='arrow-back' size={24} color='#00C7BE' style={{ marginLeft: 16 }} onPress={() => router.navigate('Cadastro/etapa1')} />
              )
            }}
          />
          <Drawer.Screen
            name="Cadastro/etapa3"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => (
                <Ionicons name='arrow-back' size={24} color='#00C7BE' style={{ marginLeft: 16 }} onPress={() => router.navigate('Cadastro/etapa2')} />
              )
            }}
          />
          <Drawer.Screen
            name="Cadastro/etapa4"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => (
                <Ionicons name='arrow-back' size={24} color='#00C7BE' style={{ marginLeft: 16 }} onPress={() => router.navigate('Cadastro/etapa3')} />
              )
            }}
          />
          <Drawer.Screen
            name="Cadastro/etapa5"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => (
                <Ionicons name='arrow-back' size={24} color='#00C7BE' style={{ marginLeft: 16 }} onPress={() => router.navigate('Cadastro/etapa4')} />
              )
            }}
          />
          <Drawer.Screen
            name="Cadastro/etapaServico"
            icon options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => (
                <Ionicons name='arrow-back' size={24} color='#00C7BE' style={{ marginLeft: 16 }} onPress={() => router.navigate('Cadastro/etapa5')} />
              )
            }}
          />

          <Drawer.Screen
            name="filters"
            options={{
              presentation: 'modal',
              title: 'Filtros',
              headerShown: false,
              drawerItemStyle: { display: 'none' }
            }}
          />

          <Drawer.Screen
            name="editar/editaPet"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => {
                return <Ionicons name='arrow-back' size={24} color='#00C7BE' style={{ marginLeft: 16 }} onPress={() => router.back()} />
              }
            }}
          />

          <Drawer.Screen
            name="editar/editaServico"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => {
                return <Ionicons name='arrow-back' size={24} color='#00C7BE' style={{ marginLeft: 16 }} onPress={() => router.back()} />
              }
            }}
          />

          <Drawer.Screen
            name="CadastroServico/index"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => {
                return <Ionicons name='arrow-back' size={24} color='#00C7BE' style={{ marginLeft: 16 }} onPress={() => router.navigate('/tabs')} />
              }
            }}
          />

          <Drawer.Screen
            name="perfilProtetor"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => {
                return <Ionicons name='arrow-back' size={24} color='#00C7BE' style={{ marginLeft: 16 }} onPress={() => router.navigate('/tabs')} />
              }
            }}
          />

          <Drawer.Screen
            name="detalhesServico"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => {
                return <Ionicons name='arrow-back' size={24} color='#00C7BE' style={{ marginLeft: 16 }} onPress={() => router.navigate('/tabs')} />
              }
            }}
          />
          

        </Drawer>
      </GestureHandlerRootView>
    </FilterProvider>
    </CadastroProvider>
    </AuthProvider>
  );
}