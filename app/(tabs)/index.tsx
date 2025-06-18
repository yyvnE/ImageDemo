import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_KEY = 'PXu96W6QKd5KsGbMAW6t28Zfbht6Puf7T5Lmd57zmd027fWtjwRUGgVW';

export default function HomeScreen() {
  const [images, setImages] = useState<
    {
      id: number;
      photographer: string;
      src: { original: string; medium: string };
    }[]
  >([]);

  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get('https://api.pexels.com/v1/search', {
          headers: {
            Authorization: API_KEY,
          },
          params: {
            query: 'tiger',
            per_page: 15,
          },
        });
        setImages(res.data.photos);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Ảnh chủ đề:</Text>

    {/* looking and press */}
    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Nhập từ khóa..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => setHasSearched(true)}
      >
        <Text style={{ color: '#fff' }}>Tìm</Text>
      </TouchableOpacity>
    </View>

    {/* Show result */}
    {hasSearched ? (
      <FlatList
        data={images}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/detail',
                params: { imageUrl: item.src.original },
              })
            }
          >
            <Image
              source={{ uri: item.src.medium }}
              style={styles.image}
            />
            <Text style={styles.name}>{item.photographer}</Text>
          </TouchableOpacity>
        )}
      />
) : (
      <Text>Chao</Text>
    )}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    textAlign: 'center',
  },
  image: {
    width: '50%',
    height: 100,
    textAlign:'center',
  },
  name: {
    padding: 8,
    fontSize: 14,
    textAlign: 'left',
  },
  searchInput: {
  flex: 1,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 12,
  height: 40,
  marginRight: 8,
},
searchButton: {
  backgroundColor: '#007AFF',
  paddingHorizontal: 16,
  borderRadius: 8,
  justifyContent: 'center',
},

});