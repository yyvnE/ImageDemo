import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type PexelsPhoto = {
  id: number;
  src: {
    medium: string;
    original: string;
  };
  photographer: string;
};

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [images, setImages] = useState<PexelsPhoto[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (searchText === '') {
      setImages([]);
      setHasSearched(false);
      setPage(1);
    }
  }, [searchText]);

  const fetchImages = async (isNewSearch = false) => {
    if (!searchText.trim() || loading) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${searchText}&per_page=10&page=${isNewSearch ? 1 : page}`,
        {
          headers: {
            Authorization: 'PXu96W6QKd5KsGbMAW6t28Zfbht6Puf7T5Lmd57zmd027fWtjwRUGgVW',
          },
        }
      );

      const data = await response.json();
      const newPhotos = isNewSearch ? data.photos : [...images, ...data.photos];
      setImages(newPhotos);
      setHasSearched(true);
      setPage((prev) => (isNewSearch ? 2 : prev + 1));
    } catch (error) {
      console.error('Lỗi khi tìm ảnh:', error);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchImages(true);
  };

  const handleLoadMore = () => {
    if (!loading) {
      fetchImages();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tìm chủ đề ảnh</Text>
      <View style={styles.searchRow}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Nhập chủ đề (ví dụ: cat, city, nature)"
          style={styles.input}
        />
        <TouchableOpacity style={styles.iconButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {!hasSearched ? (
        <Text style={styles.greeting}>Xin chào! Nhập một chủ đề và bấm Tìm để xem ảnh.</Text>
      ) : images.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.greeting}>Hình ảnh bạn kiếm không có.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.push('/')}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1} // Mỗi hàng chỉ có 1 ảnh
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/detail',
                  params: { imageUrl: item.src.original },
                })
              }
              style={{ marginBottom: 10 }}
            >
              <Image
                source={{ uri: item.src.medium }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator size="large" color="#007AFF" /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 30, marginBottom: 10, textAlign: 'left' },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    width: 350,
  },
  searchRow: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    height: 40,
    width: 40,
    marginLeft: 10,
  },
  greeting: { textAlign: 'center', fontStyle: 'italic' },
  image: { width: '100%', height: 250, borderRadius: 10 },
  retryButton: {
    marginTop: 10,
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
