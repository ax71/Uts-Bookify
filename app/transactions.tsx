import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useBookStore } from "../store/bookStore";

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const transactions = useBookStore((state) => state.transactions);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="receipt-outline"
            size={80}
            color={isDark ? "#555" : "#ccc"}
          />
          <Text style={[styles.emptyText, isDark && styles.textSecondaryDark]}>
            No transactions yet
          </Text>
          <Text
            style={[styles.emptySubtext, isDark && styles.textSecondaryDark]}
          >
            Your purchase history will appear here
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.transactionsList}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.header, isDark && styles.textDark]}>
            Transaction History
          </Text>
          <Text style={[styles.subheader, isDark && styles.textSecondaryDark]}>
            {transactions.length}{" "}
            {transactions.length === 1 ? "transaction" : "transactions"}
          </Text>

          {transactions.map((transaction) => (
            <View
              key={transaction.id}
              style={[
                styles.transactionCard,
                isDark && styles.transactionCardDark,
              ]}
            >
              {/* Transaction Header */}
              <View style={styles.transactionHeader}>
                <View style={styles.transactionHeaderLeft}>
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={isDark ? "#FFD700" : "#4CAF50"}
                  />
                  <View style={styles.transactionInfo}>
                    <Text
                      style={[styles.transactionId, isDark && styles.textDark]}
                    >
                      Order #{transaction.id.slice(-8)}
                    </Text>
                    <Text
                      style={[
                        styles.transactionDate,
                        isDark && styles.textSecondaryDark,
                      ]}
                    >
                      {formatDate(transaction.date)}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.transactionTotal,
                    isDark && styles.transactionTotalDark,
                  ]}
                >
                  ${transaction.totalPrice.toFixed(2)}
                </Text>
              </View>

              {/* Transaction Items */}
              <View style={styles.itemsList}>
                {transaction.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Image
                      source={{ uri: item.book.coverUrl }}
                      style={styles.itemCover}
                    />
                    <View style={styles.itemDetails}>
                      <Text
                        style={[styles.itemTitle, isDark && styles.textDark]}
                        numberOfLines={1}
                      >
                        {item.book.title}
                      </Text>
                      <Text
                        style={[
                          styles.itemAuthor,
                          isDark && styles.textSecondaryDark,
                        ]}
                        numberOfLines={1}
                      >
                        {item.book.author}
                      </Text>
                      <Text
                        style={[
                          styles.itemPrice,
                          isDark && styles.textSecondaryDark,
                        ]}
                      >
                        ${item.book.price.toFixed(2)} x {item.quantity}
                      </Text>
                    </View>
                    <Text
                      style={[styles.itemSubtotal, isDark && styles.textDark]}
                    >
                      ${(item.book.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Transaction Summary */}
              <View
                style={[
                  styles.transactionSummary,
                  isDark && styles.transactionSummaryDark,
                ]}
              >
                <View style={styles.summaryRow}>
                  <Text
                    style={[
                      styles.summaryLabel,
                      isDark && styles.textSecondaryDark,
                    ]}
                  >
                    Total Items:
                  </Text>
                  <Text
                    style={[styles.summaryValue, isDark && styles.textDark]}
                  >
                    {transaction.items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text
                    style={[
                      styles.summaryLabel,
                      styles.totalLabel,
                      isDark && styles.textDark,
                    ]}
                  >
                    Total Amount:
                  </Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      styles.totalValue,
                      isDark && styles.totalValueDark,
                    ]}
                  >
                    ${transaction.totalPrice.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.bottomPadding} />
        </ScrollView>
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    color: "#999",
    marginTop: 20,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  textSecondaryDark: {
    color: "#aaa",
  },
  transactionsList: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
    marginBottom: 4,
  },
  textDark: {
    color: "#fff",
  },
  subheader: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionCardDark: {
    backgroundColor: "#2a2a2a",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  transactionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  transactionInfo: {
    gap: 2,
  },
  transactionId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  transactionDate: {
    fontSize: 12,
    color: "#666",
  },
  transactionTotal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  transactionTotalDark: {
    color: "#FFD700",
  },
  itemsList: {
    paddingVertical: 12,
    gap: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemCover: {
    width: 50,
    height: 70,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  itemAuthor: {
    fontSize: 12,
    color: "#666",
  },
  itemPrice: {
    fontSize: 12,
    color: "#888",
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  transactionSummary: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 8,
  },
  transactionSummaryDark: {
    borderTopColor: "#3a3a3a",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  totalValueDark: {
    color: "#FFD700",
  },
  bottomPadding: {
    height: 20,
  },
});
