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
          options={{ headerShown: false, 
          drawerItemStyle: { display: 'none' } }} 
        />
        <Drawer.Screen
          name="configuracoes/minhaConta"
          options={{ drawerLabel: 'Minha Conta', /*nome da pagina no drawer*/
            title: "Minha Conta"}}
        />
        <Drawer.Screen
          name="tabs/meusMatches"
          options={{ drawerLabel: 'Meus matches', title: "" }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}