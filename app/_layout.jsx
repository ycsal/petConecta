import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function Layout() {
  return (
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
          options={{ headerShown: false /*esconde icone do drawer no header*/, 
          drawerItemStyle: { display: 'none' } }} /*esconde página do drawer*/
        />
        <Drawer.Screen
          name="tabs"
          options={{ drawerLabel: 'Menu', title: "" }} 
        />
        <Drawer.Screen
          name="configuracoes/buscarServicos"
          options={{ drawerLabel: 'Buscar Serviços', title: "Buscar Serviços" }} 
        />
        <Drawer.Screen
          name="configuracoes/sobreNos"
          options={{ drawerLabel: 'Sobre Nós', title: "Sobre Nós" }} 
        />
        <Drawer.Screen
          name="configuracoes/minhaConta"
          options={{ drawerLabel: 'Minha Conta', /*nome da pagina no drawer*/
            title: "Minha Conta"}}
        />
        <Drawer.Screen
            name="CadastroPet/index"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => {
                return <Ionicons name='arrow-back' size={24} color='#FFF' style={{ marginLeft: 16 }} onPress={() => router.navigate('/tasks')} />
              }
            }} 
          />
          <Drawer.Screen
            name="Cadastro/etapa1"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => {
                return <Ionicons name='arrow-back' size={24} color='#00645F' style={{ marginLeft: 16 }} onPress={() => router.navigate(' ')} />
              }
            }} 
          />
          <Drawer.Screen
            name="Cadastro/etapa2"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => {
                return <Ionicons name='arrow-back' size={24} color='#00645F' style={{ marginLeft: 16 }} onPress={() => router.navigate('Cadastro/etapa1')} />
              }
            }} 
          />
          <Drawer.Screen
            name="Cadastro/etapa3"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => {
                return <Ionicons name='arrow-back' size={24} color='#00645F' style={{ marginLeft: 16 }} onPress={() => router.navigate('Cadastro/etapa2')} />
              }
            }} 
          />
          <Drawer.Screen
            name="Cadastro/etapa4"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => {
                return <Ionicons name='arrow-back' size={24} color='#00645F' style={{ marginLeft: 16 }} onPress={() => router.navigate('Cadastro/etapa3')} />
              }
            }} 
          />
          <Drawer.Screen
            name="Cadastro/etapa5"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => {
                return <Ionicons name='arrow-back' size={24} color='#00645F' style={{ marginLeft: 16 }} onPress={() => router.navigate('Cadastro/etapa4')} />
              }
            }} 
          />
          <Drawer.Screen
            name="Cadastro/etapaServico"
            options={{
              drawerItemStyle: { display: 'none' },
              title: '',
              headerLeft: () => {
                return <Ionicons name='arrow-back' size={24} color='#00645F' style={{ marginLeft: 16 }} onPress={() => router.navigate('Cadastro/etapa5')} />
              }
            }} 
          />
      </Drawer>
    </GestureHandlerRootView>
  );
}
