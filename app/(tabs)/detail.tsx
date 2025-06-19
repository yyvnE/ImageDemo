import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetailScreen() {
  const { imageUrl } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>BACK</Text>
      </TouchableOpacity>

      {imageUrl ? (
        <Image
          source={{ uri: imageUrl as string }}
          style={styles.image}
        />
      ) : (
        <Text>Không có ảnh</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  backText: {
    fontSize: 18,
    color: '#007AFF',
  },
  image: {
    width: 320,
    height: 420,
    borderRadius: 10,
  },
});
