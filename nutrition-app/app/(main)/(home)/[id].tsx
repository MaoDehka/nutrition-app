import { Text, View } from 'react-native';

export default function HomeDetailPage({ id }: { id: string }) {
  return (
    <View>
      <Text>Détails de la page pour l'ID : {id}</Text>
    </View>
  );
}
