import Airbridge from "airbridge-react-native-sdk";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { useBookStore } from "../store/bookStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const initializeBooks = useBookStore((state) => state.initializeBooks);
  const loadTransactions = useBookStore((state) => state.loadTransactions);

  useEffect(() => {
    (Airbridge as any).init("mybookify", "a63366d4c47b4a99b5a9c2fab6baa429");
  }, []);

  useEffect(() => {
    const prepare = async () => {
      try {
        await Promise.all([initializeBooks(), loadTransactions()]);
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    prepare();
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
