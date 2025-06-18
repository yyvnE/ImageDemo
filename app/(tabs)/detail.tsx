import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetailScreen() {
  const { imageUrl } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}> *BACK*</Text>
      </TouchableOpacity>

      {imageUrl ? (
        <>
          <Text style={styles.title}>Ảnh chi tiết</Text>
          <Image source={{ uri: imageUrl as string }} style={styles.image} />
        </>
      ) : (
        <Text>Không có ảnh để hiển thị</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  title: {
    fontSize: 22,
    marginBottom: 12,
  },
  image: {
    width: 320,
    height: 240,
    borderRadius: 10,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
});
