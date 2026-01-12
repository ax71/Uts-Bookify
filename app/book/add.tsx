import { supabase } from "@/lib/supabase";
import { Category } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useBookStore } from "../../store/bookStore";

const categories: Category[] = ["Child", "Education", "Technology"];

export default function AddBookScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const addBook = useBookStore((state) => state.addBook);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    cover_url: "",
    description: "",
    category: "Fiction" as Category,
    stock: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const uploadImageToSupabase = async (uri: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      let ext = "jpg";
      if (blob.type === "image/png") ext = "png";
      if (blob.type === "image/jpeg" || blob.type === "image/jpg") ext = "jpg";
      if (blob.type === "image/webp") ext = "webp";

      const fileName = `${Date.now()}.${ext}`;
      const filePath = fileName;

      console.log("Memulai upload file:", filePath);

      const { data, error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, blob, {
          contentType: blob.type,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Upload error detail:", error);
      Alert.alert("Upload Failed", "Could not upload image to server.");
      return null;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to upload images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFormData({ ...formData, cover_url: result.assets[0].uri });
      if (errors.cover_url) setErrors({ ...errors, cover_url: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.cover_url.trim())
      newErrors.cover_url = "Cover image is required";
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

    setIsUploading(true);

    try {
      let finalCoverUrl = formData.cover_url;

      console.log("🚀 Submit dimulai. URL Awal:", finalCoverUrl);
      if (!finalCoverUrl.startsWith("http")) {
        console.log("⚡ Mendeteksi file lokal, melakukan upload...");
        const uploadedUrl = await uploadImageToSupabase(finalCoverUrl);

        if (!uploadedUrl) {
          setIsUploading(false);
          Alert.alert("Error", "Gagal mendapatkan URL gambar. Coba lagi.");
          return;
        }

        finalCoverUrl = uploadedUrl;
        console.log("✅ URL Final untuk Database:", finalCoverUrl);
      }

      await addBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        price: parseFloat(formData.price),
        cover_url: finalCoverUrl,
        description: formData.description.trim(),
        category: formData.category,
        stock: parseInt(formData.stock),
      });

      Alert.alert("Success", "Book added successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Submit Error:", error);
      Alert.alert("Error", "Failed to add book. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formGroup}>
          <Text style={[styles.label, isDark && styles.labelDark]}>
            Cover Image *
          </Text>

          <TouchableOpacity
            style={[
              styles.imagePicker,
              isDark && styles.imagePickerDark,
              errors.cover_url && styles.inputError,
            ]}
            onPress={pickImage}
            disabled={isUploading}
          >
            {formData.cover_url ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: formData.cover_url }}
                  style={styles.imagePreview}
                />
                <View style={styles.changeImageOverlay}>
                  <Ionicons name="camera" size={24} color="#fff" />
                  <Text style={styles.changeImageText}>Change Image</Text>
                </View>
              </View>
            ) : (
              <View style={styles.imagePickerContent}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={48}
                  color={isDark ? "#666" : "#999"}
                />
                <Text
                  style={[
                    styles.imagePickerText,
                    isDark && styles.imagePickerTextDark,
                  ]}
                >
                  Tap to upload cover image
                </Text>
                <Text
                  style={[
                    styles.imagePickerHint,
                    isDark && styles.imagePickerHintDark,
                  ]}
                >
                  Supports JPG, PNG
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {errors.cover_url && (
            <Text style={styles.errorText}>{errors.cover_url}</Text>
          )}
        </View>

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

      <View style={[styles.footer, isDark && styles.footerDark]}>
        <TouchableOpacity
          style={[styles.cancelButton, isDark && styles.cancelButtonDark]}
          onPress={() => router.back()}
          disabled={isUploading}
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
          style={[
            styles.submitButton,
            isDark && styles.submitButtonDark,
            isUploading && { opacity: 0.7 },
          ]}
          onPress={handleSubmit}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Add Book</Text>
            </>
          )}
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
  imagePicker: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    borderRadius: 12,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imagePickerDark: {
    backgroundColor: "#2a2a2a",
    borderColor: "#3a3a3a",
  },
  imagePickerContent: {
    alignItems: "center",
    padding: 20,
  },
  imagePickerText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
    fontWeight: "500",
  },
  imagePickerTextDark: {
    color: "#aaa",
  },
  imagePickerHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  imagePickerHintDark: {
    color: "#666",
  },
  imagePreviewContainer: {
    width: "100%",
    height: 250,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  changeImageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  changeImageText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
