import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import BookCard from "../../components/BookCard";
import { useBookStore } from "../../store/bookStore";

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const books = useBookStore((state) => state.books);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;

    const query = searchQuery.toLowerCase();
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query)
    );
  }, [books, searchQuery]);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={[styles.title, isDark && styles.textDark]}>
          Search Books
        </Text>

        <View
          style={[styles.searchContainer, isDark && styles.searchContainerDark]}
        >
          <Ionicons
            name="search"
            size={20}
            color={isDark ? "#aaa" : "#999"}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, isDark && styles.searchInputDark]}
            placeholder="Search by title, author, or category..."
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close-circle"
              size={20}
              color={isDark ? "#aaa" : "#999"}
              style={styles.clearIcon}
              onPress={() => setSearchQuery("")}
            />
          )}
        </View>
      </View>

      <ScrollView
        style={styles.resultsContainer}
        showsVerticalScrollIndicator={false}
      >
        {searchQuery.trim() === "" ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={64}
              color={isDark ? "#555" : "#ccc"}
            />
            <Text
              style={[styles.emptyText, isDark && styles.textSecondaryDark]}
            >
              Start typing to search for books
            </Text>
          </View>
        ) : filteredBooks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="sad-outline"
              size={64}
              color={isDark ? "#555" : "#ccc"}
            />
            <Text
              style={[styles.emptyText, isDark && styles.textSecondaryDark]}
            >
              {`No books found for "${searchQuery}"`}
            </Text>
          </View>
        ) : (
          <>
            <Text
              style={[styles.resultCount, isDark && styles.textSecondaryDark]}
            >
              Found {filteredBooks.length}{" "}
              {filteredBooks.length === 1 ? "book" : "books"}
            </Text>
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </>
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
  },
  headerDark: {
    backgroundColor: "#1a1a1a",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  textDark: {
    color: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchContainerDark: {
    backgroundColor: "#2a2a2a",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#000",
  },
  searchInputDark: {
    color: "#fff",
  },
  clearIcon: {
    marginLeft: 8,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  textSecondaryDark: {
    color: "#aaa",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    textAlign: "center",
  },
  bottomPadding: {
    height: 20,
  },
});
