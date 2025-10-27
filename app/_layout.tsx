import { Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { useBookStore } from "../store/bookStore";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initializeBooks = useBookStore((state) => state.initializeBooks);
  const loadTransactions = useBookStore((state) => state.loadTransactions);

  useEffect(() => {
    // Initialize data when app starts
    initializeBooks();
    loadTransactions();
  }, []);

  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="book/[id]"
          options={{
            headerShown: true,
            title: "Book Details",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="book/add"
          options={{
            headerShown: true,
            title: "Add New Book",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="book/edit/[id]"
          options={{
            headerShown: true,
            title: "Edit Book",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="transactions"
          options={{
            headerShown: true,
            title: "Transaction History",
            presentation: "card",
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
