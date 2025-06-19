import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [images, setImages] = useState<PexelsPhoto[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();
  useEffect(() => {
  if (searchText === '') {
    setImages([]);
    setHasSearched(false);
  }
}, [searchText]);
  type PexelsPhoto = {
  id: number;
  src: {
    medium: string;
    original: string;
  };
  photographer: string;
};

const handleSearch = async () => {
  if (!searchText.trim()) return;

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${searchText}`, {
      headers: {
        Authorization: 'PXu96W6QKd5KsGbMAW6t28Zfbht6Puf7T5Lmd57zmd027fWtjwRUGgVW',
      },
    });

    const data = await response.json();
    setImages(data.photos);
    setHasSearched(true);
  } catch (error) {
    console.error('Lỗi khi tìm ảnh:', error);
    setHasSearched(true);
    setImages([]);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tìm chủ đề ảnh</Text>

      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Nhập chủ đề (ví dụ: cat, city, nature)"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Tìm</Text>
      </TouchableOpacity>

      {!hasSearched ? (
        <Text style={styles.greeting}>Xin chào! Nhập một chủ đề và bấm Tìm để xem ảnh.</Text>
      ) : images.length === 0? (
       <View style={styles.centered}>
        <Text style={styles.greeting}>Hình ảnh bạn kiếm không có.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={()=>router.push('/') }>
        <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
  </View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/detail',
          params: {
            imageUrl: item.src.original,
          },
        })
      }
    >
      <Image
        source={{ uri: item.src.medium }}
        style={styles.image}
      />
    </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  greeting: { textAlign: 'center', fontStyle: 'italic' },
  image: { width: '48%', height: 150, margin: '1%' },
  retryButton: {
  marginTop: 12,
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: '#007AFF',
  borderRadius: 8,
},
retryButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
centered: {
  alignItems: 'center',
  marginTop: 20,
},

});
