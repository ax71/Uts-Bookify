import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useBookStore } from "../../store/bookStore";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const getBookById = useBookStore((state) => state.getBookById);
  const addToCart = useBookStore((state) => state.addToCart);
  const deleteBook = useBookStore((state) => state.deleteBook);

  const book = getBookById(id as string);
  const [quantity, setQuantity] = useState(1);

  if (!book) {
    return (
      <View
        style={[
          styles.container,
          styles.errorContainer,
          isDark && styles.containerDark,
        ]}
      >
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={isDark ? "#666" : "#ccc"}
        />
        <Text style={[styles.errorText, isDark && styles.textDark]}>
          Book not found
        </Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    addToCart(book.id, quantity);
    Alert.alert(
      "Added to Cart",
      `${quantity} x "${book.title}" added to your cart.`,
      [
        { text: "Continue Shopping", onPress: () => router.back() },
        { text: "View Cart", onPress: () => router.push("/cart") },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Book",
      `Are you sure you want to delete "${book.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteBook(book.id);
            Alert.alert("Success", "Book deleted successfully.");
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: book.cover_url }} style={styles.coverImage} />

        <View style={styles.content}>
          <View
            style={[styles.categoryBadge, isDark && styles.categoryBadgeDark]}
          >
            <Text
              style={[styles.categoryText, isDark && styles.categoryTextDark]}
            >
              {book.category}
            </Text>
          </View>

          <Text style={[styles.title, isDark && styles.textDark]}>
            {book.title}
          </Text>
          <Text style={[styles.author, isDark && styles.textSecondaryDark]}>
            by {book.author}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, isDark && styles.priceDark]}>
              ${book.price.toFixed(2)}
            </Text>
            <View style={styles.stockBadge}>
              <Ionicons
                name="cube-outline"
                size={16}
                color={isDark ? "#aaa" : "#666"}
              />
              <Text
                style={[styles.stockText, isDark && styles.textSecondaryDark]}
              >
                {book.stock} in stock
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              Description
            </Text>
            <Text
              style={[styles.description, isDark && styles.textSecondaryDark]}
            >
              {book.description}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
              Quantity
            </Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  isDark && styles.quantityButtonDark,
                ]}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons
                  name="remove"
                  size={24}
                  color={isDark ? "#fff" : "#000"}
                />
              </TouchableOpacity>

              <Text style={[styles.quantityText, isDark && styles.textDark]}>
                {quantity}
              </Text>

              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  isDark && styles.quantityButtonDark,
                ]}
                onPress={() => setQuantity(Math.min(book.stock, quantity + 1))}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color={isDark ? "#fff" : "#000"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.editButton, isDark && styles.editButtonDark]}
              onPress={() => router.push(`/book/edit/${book.id}`)}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={isDark ? "#FFD700" : "#FF6B35"}
              />
              <Text
                style={[
                  styles.editButtonText,
                  isDark && styles.editButtonTextDark,
                ]}
              >
                Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteButton, isDark && styles.deleteButtonDark]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#ff4444" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={[styles.footer, isDark && styles.footerDark]}>
        <View style={styles.totalSection}>
          <Text style={[styles.totalLabel, isDark && styles.textSecondaryDark]}>
            Total:
          </Text>
          <Text style={[styles.totalPrice, isDark && styles.totalPriceDark]}>
            ${(book.price * quantity).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addToCartButton, isDark && styles.addToCartButtonDark]}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#999",
    marginTop: 16,
  },
  textDark: {
    color: "#fff",
  },
  coverImage: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryBadgeDark: {
    backgroundColor: "#FFD700",
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  categoryTextDark: {
    color: "#000",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  textSecondaryDark: {
    color: "#aaa",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  priceDark: {
    color: "#FFD700",
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stockText: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonDark: {
    backgroundColor: "#2a2a2a",
  },
  quantityText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    minWidth: 40,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFE8E0",
    paddingVertical: 14,
    borderRadius: 12,
  },
  editButtonDark: {
    backgroundColor: "#2a2a2a",
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B35",
  },
  editButtonTextDark: {
    color: "#FFD700",
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ffe0e0",
    paddingVertical: 14,
    borderRadius: 12,
  },
  deleteButtonDark: {
    backgroundColor: "#2a2a2a",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff4444",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  footerDark: {
    backgroundColor: "#1a1a1a",
    borderTopColor: "#333",
  },
  totalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  totalPriceDark: {
    color: "#FFD700",
  },
  addToCartButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addToCartButtonDark: {
    backgroundColor: "#FFD700",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomPadding: {
    height: 20,
  },
});
