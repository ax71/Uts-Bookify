import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useBookStore } from "../../store/bookStore";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const books = useBookStore((state) => state.books);
  const transactions = useBookStore((state) => state.transactions);
  const initializeBooks = useBookStore((state) => state.initializeBooks);

  const totalSpent = transactions.reduce((sum, t) => sum + t.total_price, 0);
  const totalPurchases = transactions.reduce(
    (sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "This will delete all books and transactions. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await initializeBooks();
            Alert.alert("Success", "All data has been reset.");
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, isDark && styles.avatarDark]}>
            <Ionicons
              name="person"
              size={40}
              color={isDark ? "#FFD700" : "#FF6B35"}
            />
          </View>
        </View>
        <Text style={[styles.name, isDark && styles.textDark]}>Buktiasa</Text>
        <Text style={[styles.email, isDark && styles.textSecondaryDark]}>
          buktiasa@bookify.com
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Statistics
          </Text>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, isDark && styles.statCardDark]}>
              <Ionicons
                name="book"
                size={32}
                color={isDark ? "#FFD700" : "#FF6B35"}
              />
              <Text style={[styles.statValue, isDark && styles.textDark]}>
                {books.length}
              </Text>
              <Text
                style={[styles.statLabel, isDark && styles.textSecondaryDark]}
              >
                Books
              </Text>
            </View>

            <View style={[styles.statCard, isDark && styles.statCardDark]}>
              <Ionicons
                name="receipt"
                size={32}
                color={isDark ? "#FFD700" : "#FF6B35"}
              />
              <Text style={[styles.statValue, isDark && styles.textDark]}>
                {transactions.length}
              </Text>
              <Text
                style={[styles.statLabel, isDark && styles.textSecondaryDark]}
              >
                Transactions
              </Text>
            </View>

            <View style={[styles.statCard, isDark && styles.statCardDark]}>
              <Ionicons
                name="cart"
                size={32}
                color={isDark ? "#FFD700" : "#FF6B35"}
              />
              <Text style={[styles.statValue, isDark && styles.textDark]}>
                {totalPurchases}
              </Text>
              <Text
                style={[styles.statLabel, isDark && styles.textSecondaryDark]}
              >
                Purchased
              </Text>
            </View>

            <View style={[styles.statCard, isDark && styles.statCardDark]}>
              <Ionicons
                name="cash"
                size={32}
                color={isDark ? "#FFD700" : "#FF6B35"}
              />
              <Text style={[styles.statValue, isDark && styles.textDark]}>
                ${totalSpent.toFixed(0)}
              </Text>
              <Text
                style={[styles.statLabel, isDark && styles.textSecondaryDark]}
              >
                Total Spent
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
            Menu
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, isDark && styles.menuItemDark]}
            onPress={() => router.push("/transactions")}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="receipt-outline"
                size={24}
                color={isDark ? "#FFD700" : "#FF6B35"}
              />
              <Text style={[styles.menuItemText, isDark && styles.textDark]}>
                Transaction History
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={isDark ? "#666" : "#999"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, isDark && styles.menuItemDark]}
            onPress={() => router.push("/book/add")}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={isDark ? "#FFD700" : "#FF6B35"}
              />
              <Text style={[styles.menuItemText, isDark && styles.textDark]}>
                Add New Book
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={isDark ? "#666" : "#999"}
            />
          </TouchableOpacity>

          <View style={[styles.menuItem, isDark && styles.menuItemDark]}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="moon-outline"
                size={24}
                color={isDark ? "#FFD700" : "#FF6B35"}
              />
              <Text style={[styles.menuItemText, isDark && styles.textDark]}>
                Dark Mode
              </Text>
            </View>
            <Text
              style={[styles.menuItemNote, isDark && styles.textSecondaryDark]}
            >
              (System Setting)
            </Text>
          </View>
        </View>
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
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerDark: {
    backgroundColor: "#1a1a1a",
    borderBottomColor: "#333",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFE8E0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarDark: {
    backgroundColor: "#2a2a2a",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  textDark: {
    color: "#fff",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  textSecondaryDark: {
    color: "#aaa",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "48%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statCardDark: {
    backgroundColor: "#2a2a2a",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuItemDark: {
    backgroundColor: "#2a2a2a",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#000",
  },
  menuItemNote: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  dangerItem: {
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  dangerItemDark: {
    borderColor: "#ff4444",
  },
  dangerText: {
    fontSize: 16,
    color: "#ff4444",
    fontWeight: "600",
  },
  appInfo: {
    padding: 16,
    alignItems: "center",
  },
  appInfoText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  bottomPadding: {
    height: 40,
  },
});
