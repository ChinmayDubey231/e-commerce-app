import api from "@/constants/api";
import { Product } from "@/constants/types";
import { useAuth } from "@clerk/expo";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Toast from "react-native-toast-message";

export type CartItem = {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  price: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string) => Promise<void>;
  removeFromCart: (itemId: string, size: string) => Promise<void>;
  updateQuantity: (
    itemId: string,
    quantity: number,
    size: string,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  itemCount: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const fetchWithAuth = async (
    requestFn: (token: string | null) => Promise<any>,
  ) => {
    let token = await getToken();

    try {
      return await requestFn(token);
    } catch (error: any) {
      // If we get a 401 Unauthorized, the token died.
      if (error.response?.status === 401) {
        console.log("🔄 Token expired! Attempting forced refresh...");

        try {
          // Force a fresh token
          token = await getToken({ skipCache: true });
          // Retry the request
          return await requestFn(token);
        } catch (retryError: any) {
          // 🚨 IF THE RETRY FAILS, WE NEED TO KNOW WHY
          console.error(
            "❌ RETRY FAILED:",
            retryError.message,
            retryError.response?.data,
          );
          throw retryError;
        }
      }
      // If it's a normal error (like 404 or offline), let it fail normally
      throw error;
    }
  };

  const fetchCart = async () => {
    try {
      setIsLoading(true);

      const { data } = await fetchWithAuth((token) =>
        api.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      if (data.success && data.data) {
        const serverCart = data.data;
        const mappedItems: CartItem[] = serverCart.items.map((item: any) => ({
          id: item.product._id,
          productId: item.product._id,
          product: item.product,
          quantity: item.quantity,
          size: item?.size || "M",
          price: item.price,
        }));
        setCartItems(mappedItems);
        setCartTotal(serverCart.totalAmount);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product, size: string) => {
    if (!isSignedIn) {
      return Toast.show({
        type: "error",
        text1: "You must be signed in to add to cart",
        text2: "Please sign in to add to cart",
      });
    }
    try {
      setIsLoading(true);

      const { data } = await fetchWithAuth((token) =>
        api.post(
          "/cart",
          { productId: product._id, quantity: 1, size },
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      );

      if (data.success) {
        await fetchCart();
        Toast.show({
          type: "success",
          text1: "Added to Cart",
        });
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);

      const isOffline =
        error.message === "Network Error" ||
        error.message.includes("network request failed");

      Toast.show({
        type: "error",
        text1: isOffline ? "No Internet Connection" : "Failed to Add to Cart",
        text2: isOffline
          ? "Please check your network and try again."
          : error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string, size: string) => {
    if (!isSignedIn) {
      return Toast.show({
        type: "error",
        text1: "You must be signed in to remove from cart",
        text2: "Please sign in to remove from cart",
      });
    }
    try {
      setIsLoading(true);

      const { data } = await fetchWithAuth((token) =>
        api.delete(`/cart/item/${productId}?size=${size}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      if (data.success) {
        await fetchCart();
      }
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Remove Item",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (
    productId: string,
    quantity: number,
    size: string = "M",
  ) => {
    if (!isSignedIn) {
      return Toast.show({
        type: "error",
        text1: "You must be signed in to update quantity",
      });
    }
    if (quantity < 1) return;

    try {
      setIsLoading(true);

      const { data } = await fetchWithAuth((token) =>
        api.put(
          `/cart/item/${productId}`,
          { quantity, size },
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      );

      if (data.success) {
        await fetchCart();
      }
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Update Quantity",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isSignedIn) {
      return Toast.show({
        type: "error",
        text1: "You must be signed in to clear cart",
      });
    }
    try {
      setIsLoading(true);

      const { data } = await fetchWithAuth((token) =>
        api.delete("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      if (data.success) {
        setCartItems([]);
        setCartTotal(0);
        Toast.show({
          type: "success",
          text1: "Cart Cleared",
        });
      }
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Clear Cart",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (isSignedIn) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotal(0);
    }
  }, [isSignedIn]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider.");
  }
  return context;
}
