import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const cart = useBookStore((state) => state.cart);
  const books = useBookStore((state) => state.books);
  const updateCartQuantity = useBookStore((state) => state.updateCartQuantity);
  const removeFromCart = useBookStore((state) => state.removeFromCart);
  const getCartTotal = useBookStore((state) => state.getCartTotal);
  const checkout = useBookStore((state) => state.checkout);

  const cartItems = cart.map((item) => ({
    ...item,
    book: books.find((b) => b.id === item.bookId)!,
  }));

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert("Cart Empty", "Please add some books to your cart first.");
      return;
    }

    Alert.alert(
      "Confirm Purchase",
      `Total: $${getCartTotal().toFixed(2)}\n\nProceed with checkout?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            await checkout();
            Alert.alert(
              "✅ Purchase Successful!",
              "Thank you for your purchase. Check your transaction history.",
              [
                {
                  text: "View History",
                  onPress: () => router.push("/transactions"),
                },
                { text: "OK" },
              ]
            );
          },
        },
      ]
    );
  };

  const handleRemoveItem = (bookId: string, bookTitle: string) => {
    Alert.alert("Remove Item", `Remove "${bookTitle}" from cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        onPress: () => removeFromCart(bookId),
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={[styles.title, isDark && styles.textDark]}>
          Shopping Cart
        </Text>
        <Text style={[styles.itemCount, isDark && styles.textSecondaryDark]}>
          {cart.length} {cart.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="cart-outline"
            size={80}
            color={isDark ? "#555" : "#ccc"}
          />
          <Text style={[styles.emptyText, isDark && styles.textSecondaryDark]}>
            Your cart is empty
          </Text>
          <TouchableOpacity
            style={[styles.browseButton, isDark && styles.browseButtonDark]}
            onPress={() => router.push("/")}
          >
            <Text
              style={[
                styles.browseButtonText,
                isDark && styles.browseButtonTextDark,
              ]}
            >
              Browse Books
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.cartList}
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item) => (
              <View
                key={item.bookId}
                style={[styles.cartItem, isDark && styles.cartItemDark]}
              >
                <Image
                  source={{ uri: item.book.cover_url }}
                  style={styles.bookCover}
                />

                <View style={styles.itemDetails}>
                  <Text
                    style={[styles.bookTitle, isDark && styles.textDark]}
                    numberOfLines={2}
                  >
                    {item.book.title}
                  </Text>
                  <Text
                    style={[
                      styles.bookAuthor,
                      isDark && styles.textSecondaryDark,
                    ]}
                  >
                    {item.book.author}
                  </Text>
                  <Text
                    style={[styles.bookPrice, isDark && styles.bookPriceDark]}
                  >
                    ${item.book.price.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.rightSection}>
                  {/* Quantity Controls */}
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        isDark && styles.quantityButtonDark,
                      ]}
                      onPress={() =>
                        updateCartQuantity(item.bookId, item.quantity - 1)
                      }
                    >
                      <Ionicons
                        name="remove"
                        size={16}
                        color={isDark ? "#fff" : "#000"}
                      />
                    </TouchableOpacity>

                    <Text style={[styles.quantity, isDark && styles.textDark]}>
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        isDark && styles.quantityButtonDark,
                      ]}
                      onPress={() =>
                        updateCartQuantity(item.bookId, item.quantity + 1)
                      }
                    >
                      <Ionicons
                        name="add"
                        size={16}
                        color={isDark ? "#fff" : "#000"}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Remove Button */}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() =>
                      handleRemoveItem(item.bookId, item.book.title)
                    }
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={styles.bottomPadding} />
          </ScrollView>

          {/* Checkout Section */}
          <View
            style={[
              styles.checkoutSection,
              isDark && styles.checkoutSectionDark,
            ]}
          >
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, isDark && styles.textDark]}>
                Total:
              </Text>
              <Text
                style={[styles.totalPrice, isDark && styles.totalPriceDark]}
              >
                ${getCartTotal().toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.checkoutButton,
                isDark && styles.checkoutButtonDark,
              ]}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  },
  textDark: {
    color: "#fff",
  },
  itemCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  textSecondaryDark: {
    color: "#aaa",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 20,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
  },
  browseButtonDark: {
    backgroundColor: "#FFD700",
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  browseButtonTextDark: {
    color: "#000",
  },
  cartList: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cartItemDark: {
    backgroundColor: "#2a2a2a",
  },
  bookCover: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  bookPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B35",
    marginTop: 8,
  },
  bookPriceDark: {
    color: "#FFD700",
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonDark: {
    backgroundColor: "#3a3a3a",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
    color: "#000",
  },
  removeButton: {
    padding: 8,
  },
  checkoutSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  checkoutSectionDark: {
    backgroundColor: "#1a1a1a",
    borderTopColor: "#333",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  totalPriceDark: {
    color: "#FFD700",
  },
  checkoutButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutButtonDark: {
    backgroundColor: "#FFD700",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomPadding: {
    height: 20,
  },
});
