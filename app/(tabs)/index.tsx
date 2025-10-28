import { Category } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import BookCard from "../../components/BookCard";
import { useBookStore } from "../../store/bookStore";

const categories: Category[] = ["All", "Child", "Education", "Technology"];

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const books = useBookStore((state) => state.books);
  const initializeBooks = useBookStore((state) => state.initializeBooks);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [refreshing, setRefreshing] = useState(false);

  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter((book) => book.category === selectedCategory);

  const onRefresh = async () => {
    setRefreshing(true);
    await initializeBooks();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View>
          <Text style={[styles.greeting, isDark && styles.textDark]}>
            WELCOME, Bukti!
          </Text>
          <Text style={[styles.subtitle, isDark && styles.textSecondaryDark]}>
            Discover your next great book
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, isDark && styles.addButtonDark]}
          onPress={() => router.push("/book/add")}
        >
          <Ionicons
            name="add"
            size={24}
            color={isDark ? "#FFD700" : "#FF6B35"}
          />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
              isDark && styles.categoryChipDark,
              selectedCategory === category &&
                isDark &&
                styles.categoryChipActiveDark,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
                isDark && styles.categoryTextDark,
                selectedCategory === category &&
                  isDark &&
                  styles.categoryTextActiveDark,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Books List */}
      <ScrollView
        style={styles.booksContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            {selectedCategory === "All" ? "All Books" : selectedCategory}
          </Text>
          <Text style={[styles.bookCount, isDark && styles.textSecondaryDark]}>
            {filteredBooks.length} books
          </Text>
        </View>

        {filteredBooks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="book-outline"
              size={64}
              color={isDark ? "#555" : "#ccc"}
            />
            <Text
              style={[styles.emptyText, isDark && styles.textSecondaryDark]}
            >
              No books found in this category
            </Text>
          </View>
        ) : (
          filteredBooks.map((book) => <BookCard key={book.id} book={book} />)
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerDark: {
    backgroundColor: "#1a1a1a",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  textDark: {
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  textSecondaryDark: {
    color: "#aaa",
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFE8E0",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonDark: {
    backgroundColor: "#2a2a2a",
  },
  categoriesContainer: {
    maxHeight: 60,
    backgroundColor: "#fff",
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  categoryChipDark: {
    backgroundColor: "#2a2a2a",
  },
  categoryChipActive: {
    backgroundColor: "#FF6B35",
  },
  categoryChipActiveDark: {
    backgroundColor: "#FFD700",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  categoryTextDark: {
    color: "#aaa",
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  categoryTextActiveDark: {
    color: "#000",
    fontWeight: "600",
  },
  booksContainer: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  bookCount: {
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
  },
  bottomPadding: {
    height: 20,
  },
});
