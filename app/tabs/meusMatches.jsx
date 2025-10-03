import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

const mockMatches = [
  { id: '1', nome: 'Bolinha', imagem: 'https://hypescience.com/wp-content/uploads/2013/07/210.jpg' },
  { id: '2', nome: 'Frajola', imagem: 'https://geloelimaodotcom.wordpress.com/wp-content/uploads/2014/03/animais-animais-engracados-83c651.jpg' },
];

export default function MeusMatches() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seus Matches</Text>
      <FlatList
        data={mockMatches}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable style={styles.matchCard} onPress={() => console.log(`Abrir chat com ${item.nome}`)}>
            <Image source={{ uri: item.imagem }} style={styles.matchImage} />
            <Text style={styles.matchName}>{item.nome}</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#014946ff',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  listContainer: {
    alignItems: 'center',
  },
  matchCard: {
    width: '45%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: '2.5%',
    alignItems: 'center',
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  matchImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
});