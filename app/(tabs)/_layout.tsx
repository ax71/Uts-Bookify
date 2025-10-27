import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { useBookStore } from "../../store/bookStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const cart = useBookStore((state) => state.cart);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === "dark" ? "#FFD700" : "#FF6B35",
        tabBarInactiveTintColor: colorScheme === "dark" ? "#888" : "#999",
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#1a1a1a" : "#fff",
          borderTopColor: colorScheme === "dark" ? "#333" : "#e0e0e0",
        },
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#1a1a1a" : "#fff",
        },
        headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarBadge: cartItemsCount > 0 ? cartItemsCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
