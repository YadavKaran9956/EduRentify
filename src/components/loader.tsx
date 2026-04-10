import { View, Text, ActivityIndicator } from 'react-native';

export default function Loader() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#6200ee" />
      <Text style={{ marginTop: 10 }}>Please wait...</Text>
    </View>
  );
}
