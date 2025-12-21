import { Book } from "@/type";
import { useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity
      style={[styles.card, isDark && styles.cardDark]}
      onPress={() => router.push(`/book/${book.id}`)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: book.cover_url }} style={styles.cover} />
      <View style={styles.info}>
        <Text
          style={[styles.title, isDark && styles.textDark]}
          numberOfLines={2}
        >
          {book.title}
        </Text>
        <Text
          style={[styles.author, isDark && styles.textSecondaryDark]}
          numberOfLines={1}
        >
          {book.author}
        </Text>
        <Text
          style={[styles.description, isDark && styles.textSecondaryDark]}
          numberOfLines={2}
        >
          {book.description}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.price, isDark && styles.priceDark]}>
            ${book.price.toFixed(2)}
          </Text>
          <Text style={[styles.stock, isDark && styles.textSecondaryDark]}>
            {book.stock} remaining
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardDark: {
    backgroundColor: "#2a2a2a",
  },
  cover: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  textDark: {
    color: "#fff",
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  textSecondaryDark: {
    color: "#aaa",
  },
  description: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  priceDark: {
    color: "#FFD700",
  },
  stock: {
    fontSize: 12,
    color: "#888",
  },
});
