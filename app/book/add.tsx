import { Category } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useBookStore } from "../../store/bookStore";

const categories: Category[] = [
  "Child",
  "Humanities",
  "Education",
  "Science",
  "Fiction",
  "Technology",
];

export default function AddBookScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const addBook = useBookStore((state) => state.addBook);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    coverUrl: "",
    description: "",
    category: "Fiction" as Category,
    stock: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.coverUrl.trim()) newErrors.coverUrl = "Cover URL is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.stock || parseInt(formData.stock) < 0)
      newErrors.stock = "Valid stock is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fill all required fields correctly."
      );
      return;
    }

    try {
      await addBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        price: parseFloat(formData.price),
        coverUrl: formData.coverUrl.trim(),
        description: formData.description.trim(),
        category: formData.category,
        stock: parseInt(formData.stock),
      });

      Alert.alert("Success", "Book added successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to add book. Please try again.");
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, isDark && styles.labelDark]}>
            Title *
          </Text>
          <TextInput
            style={[
              styles.input,
              isDark && styles.inputDark,
              errors.title && styles.inputError,
            ]}
            placeholder="Enter book title"
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={formData.title}
            onChangeText={(text) => {
              setFormData({ ...formData, title: text });
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Author */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, isDark && styles.labelDark]}>
            Author *
          </Text>
          <TextInput
            style={[
              styles.input,
              isDark && styles.inputDark,
              errors.author && styles.inputError,
            ]}
            placeholder="Enter author name"
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={formData.author}
            onChangeText={(text) => {
              setFormData({ ...formData, author: text });
              if (errors.author) setErrors({ ...errors, author: "" });
            }}
          />
          {errors.author && (
            <Text style={styles.errorText}>{errors.author}</Text>
          )}
        </View>

        {/* Price */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, isDark && styles.labelDark]}>
            Price *
          </Text>
          <TextInput
            style={[
              styles.input,
              isDark && styles.inputDark,
              errors.price && styles.inputError,
            ]}
            placeholder="0.00"
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={formData.price}
            onChangeText={(text) => {
              setFormData({ ...formData, price: text });
              if (errors.price) setErrors({ ...errors, price: "" });
            }}
            keyboardType="decimal-pad"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        {/* Cover URL */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, isDark && styles.labelDark]}>
            Cover Image URL *
          </Text>
          <TextInput
            style={[
              styles.input,
              isDark && styles.inputDark,
              errors.coverUrl && styles.inputError,
            ]}
            placeholder="https://example.com/image.jpg"
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={formData.coverUrl}
            onChangeText={(text) => {
              setFormData({ ...formData, coverUrl: text });
              if (errors.coverUrl) setErrors({ ...errors, coverUrl: "" });
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.coverUrl && (
            <Text style={styles.errorText}>{errors.coverUrl}</Text>
          )}
        </View>

        {/* Category */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, isDark && styles.labelDark]}>
            Category *
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  formData.category === category && styles.categoryChipActive,
                  isDark && styles.categoryChipDark,
                  formData.category === category &&
                    isDark &&
                    styles.categoryChipActiveDark,
                ]}
                onPress={() => setFormData({ ...formData, category })}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    formData.category === category &&
                      styles.categoryChipTextActive,
                    isDark && styles.categoryChipTextDark,
                    formData.category === category &&
                      isDark &&
                      styles.categoryChipTextActiveDark,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stock */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, isDark && styles.labelDark]}>
            Stock *
          </Text>
          <TextInput
            style={[
              styles.input,
              isDark && styles.inputDark,
              errors.stock && styles.inputError,
            ]}
            placeholder="0"
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={formData.stock}
            onChangeText={(text) => {
              setFormData({ ...formData, stock: text });
              if (errors.stock) setErrors({ ...errors, stock: "" });
            }}
            keyboardType="number-pad"
          />
          {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, isDark && styles.labelDark]}>
            Description *
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              isDark && styles.inputDark,
              errors.description && styles.inputError,
            ]}
            placeholder="Enter book description"
            placeholderTextColor={isDark ? "#666" : "#999"}
            value={formData.description}
            onChangeText={(text) => {
              setFormData({ ...formData, description: text });
              if (errors.description) setErrors({ ...errors, description: "" });
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Submit Button */}
      <View style={[styles.footer, isDark && styles.footerDark]}>
        <TouchableOpacity
          style={[styles.cancelButton, isDark && styles.cancelButtonDark]}
          onPress={() => router.back()}
        >
          <Text
            style={[
              styles.cancelButtonText,
              isDark && styles.cancelButtonTextDark,
            ]}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, isDark && styles.submitButtonDark]}
          onPress={handleSubmit}
        >
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={styles.submitButtonText}>Add Book</Text>
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
  content: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  labelDark: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
  },
  inputDark: {
    backgroundColor: "#2a2a2a",
    borderColor: "#3a3a3a",
    color: "#fff",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryChip: {
    paddingHorizontal: 16,
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
  categoryChipText: {
    fontSize: 14,
    color: "#666",
  },
  categoryChipTextDark: {
    color: "#aaa",
  },
  categoryChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  categoryChipTextActiveDark: {
    color: "#000",
    fontWeight: "600",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    flexDirection: "row",
    gap: 12,
  },
  footerDark: {
    backgroundColor: "#1a1a1a",
    borderTopColor: "#333",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  cancelButtonDark: {
    backgroundColor: "#2a2a2a",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  cancelButtonTextDark: {
    color: "#aaa",
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonDark: {
    backgroundColor: "#FFD700",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  bottomPadding: {
    height: 40,
  },
});
