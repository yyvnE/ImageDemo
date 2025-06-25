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
  // Nếu không có nội dung tìm kiếm hoặc đang tải, thì dừng luôn
  if (!searchText.trim() || loading) {
    return;
  }

  // Đặt trạng thái đang tải để tránh gọi API nhiều lần
  setLoading(true);

  try {
    // Tạo biến xác định trang cần gọi
    let currentPage;
    if (isNewSearch) {
      // Nếu là tìm kiếm mới, luôn bắt đầu từ trang 1
      currentPage = 1;
    } else {
      // Nếu đang cuộn để tải thêm, thì giữ nguyên page hiện tại
      currentPage = page;
    }

    // Gọi API Pexels, truyền từ khóa và số trang cần lấy
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${searchText}&per_page=10&page=${currentPage}`,
      {
        headers: {
          // Gửi API key vào phần headers để xác thực
          Authorization: 'PXu96W6QKd5KsGbMAW6t28Zfbht6Puf7T5Lmd57zmd027fWtjwRUGgVW',
        },
      }
    );

    // Chuyển dữ liệu JSON từ API thành object JavaScript
    const data = await response.json();

    // Tạo biến chứa danh sách ảnh mới
    let newPhotos;
    if (isNewSearch) {
      // Nếu tìm mới thì chỉ dùng ảnh mới
      newPhotos = data.photos;
    } else {
      // Nếu tải thêm thì nối ảnh cũ với ảnh mới
      newPhotos = [...images, ...data.photos];
    }

    // Cập nhật danh sách ảnh lên UI
    setImages(newPhotos);

    // Đánh dấu rằng đã từng tìm kiếm
    setHasSearched(true);

    // Tăng số trang để lần sau gọi tiếp
    if (isNewSearch) {
      // Nếu vừa mới tìm, trang kế tiếp là 2
      setPage(2);
    } else {
      // Nếu đang cuộn thì tăng lên 1
      setPage(prev => prev + 1);
    }
  } catch (error) {
    // Nếu có lỗi khi gọi API, ghi log và vẫn đánh dấu đã tìm
    console.error('Lỗi khi tìm ảnh:', error);
    setHasSearched(true);
  } finally {
    // Sau khi gọi xong (dù thành công hay lỗi), tắt trạng thái loading
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
          numColumns={1}
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
