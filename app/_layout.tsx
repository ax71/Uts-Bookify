import Airbridge from "airbridge-react-native-sdk";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { useBookStore } from "../store/bookStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const initializeBooks = useBookStore((state) => state.initializeBooks);
  const loadTransactions = useBookStore((state) => state.loadTransactions);

  const [appReady, setAppReady] = useState(false);
  const pendingRoute = useRef<string | null>(null);

  useEffect(() => {
    try {
      (Airbridge as any).init("mybookify", "a63366d4c47b4a99b5a9c2fab6baa429");
      (Airbridge as any).getInitialDeeplink?.((deeplink: string) => {
        console.log("Initial Deeplink:", deeplink);

        const route = parseDeeplinkToRoute(deeplink);
        if (route) {
          pendingRoute.current = route;
        }
      });

      (Airbridge as any).setDeeplinkListener((deeplink: string) => {
        console.log("Realtime Deeplink:", deeplink);

        const route = parseDeeplinkToRoute(deeplink);
        if (route) {
          router.push(route as any);
        }
      });
    } catch (err) {
      console.warn("Airbridge init error:", err);
    }
  }, []);

  useEffect(() => {
    const prepare = async () => {
      try {
        await Promise.all([initializeBooks(), loadTransactions()]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (appReady && pendingRoute.current) {
      router.replace(pendingRoute.current as any);
      pendingRoute.current = null;
    }
  }, [appReady]);

  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="book/[id]"
          options={{ headerShown: true, title: "Book Details" }}
        />
        <Stack.Screen
          name="book/edit/[id]"
          options={{ headerShown: true, title: "Edit Book" }}
        />
        <Stack.Screen
          name="transactions"
          options={{ headerShown: true, title: "Transactions" }}
        />
      </Stack>
    </PaperProvider>
  );
}

function parseDeeplinkToRoute(deeplink?: string): string | null {
  if (!deeplink) return null;

  try {
    const { path } = Linking.parse(deeplink);

    console.log("📍 Parsed path:", path);

    if (!path) return null;

    // VALID ROUTES
    if (path.startsWith("book/")) return `/${path}`;
    if (path === "transactions") return "/transactions";

    console.warn("Path tidak dikenal:", path);
    return null;
  } catch (err) {
    console.warn("Parse deeplink gagal:", err);
    return null;
  }
}
