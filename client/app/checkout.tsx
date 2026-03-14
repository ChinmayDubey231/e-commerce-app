import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { Address } from "@/constants/types";
import { dummyAddress } from "@/assets/assets";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";

export default function Checkout() {
  const { cartTotal } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash");

  const shipping = 2.0;
  const tax = 0;
  const total = cartTotal + shipping + tax;

  const fetchAddress = async () => {
    const addrList = dummyAddress;
    if (addrList.length > 0) {
      //Find default or first
      const def = addrList.find((a: any) => a.isDefault) || addrList[0];
      setSelectedAddress(def as Address);
    }
    setPageLoading(false);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please select a shipping address",
      });
      return;
    }

    if (paymentMethod === "stripe") {
      return Toast.show({
        type: "error",
        text1: "Not available",
        text2: "Stripe payment is not available yet",
      });
    }
    //Cash on delivery
    router.push("/orders");
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  if (pageLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Checkout" showBack />

      <ScrollView className="flex-1 px-4 mt-4">
        {/*Address Section */}
        <Text className="text-primary font-bold text-xl mb-4">
          Shipping Address
        </Text>

        {selectedAddress ? (
          <View className="bg-white p-4 rounded-xl mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-primary font-bold text-base">
                {selectedAddress.type}
              </Text>
              <TouchableOpacity onPress={() => router.push("/addresses")}>
                <Text className="text-accent text-l">Change</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-secondary leading-6">
              {selectedAddress.street},{selectedAddress.city}
              {"\n"}
              {selectedAddress.state},{selectedAddress.zipCode}
              {"\n"}
              {selectedAddress.country}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/address")}
            className="bg-white p-6 rounded-xl mb-6 items-center justify-center border-dashed border-2 border-gray-100 flex-row space-x-2"
          >
            <Text className="text-primary font-bold text-lg">Add Address</Text>
            <Ionicons name="add-sharp" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {/*Payment Section */}
        <Text className="text-primary font-bold text-xl mb-4">
          Payment Method
        </Text>

        {/* Cash on Delivery */}
        <TouchableOpacity
          onPress={() => setPaymentMethod("cash")}
          className={`bg-white p-4 rounded-xl mb-6 flex-row items-center shadow-sm ${
            paymentMethod === "cash"
              ? " border border-primary"
              : "border-transparent"
          }`}
        >
          <Ionicons
            name="cash-outline"
            size={24}
            color={COLORS.primary}
            className="mr-3"
          />

          <View className="flex-1 ml-3">
            <Text className="text-primary font-bold text-base">
              Cash on Delivery
            </Text>
            <Text className="text-secondary text-xs mt-1">
              You will pay when you receive your order.
            </Text>
          </View>
          {paymentMethod === "cash" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>

        {/* Stripe Payment */}
        <TouchableOpacity
          onPress={() => setPaymentMethod("stripe")}
          className={`bg-white p-4 rounded-xl mb-6 flex-row items-center shadow-sm ${
            paymentMethod === "stripe"
              ? " border border-primary"
              : "border-transparent"
          }`}
        >
          <Ionicons
            name="card-outline"
            size={24}
            color={COLORS.primary}
            className="mr-3"
          />

          <View className="flex-1 ml-3">
            <Text className="text-primary font-bold text-base">
              Pay with card
            </Text>
            <Text className="text-secondary text-xs mt-1">
              Credit card or debit card
            </Text>
          </View>
          {paymentMethod === "stripe" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Order Summary */}
      <View className="p-4 bg-white shadow-sm border-t border-gray-100">
        <Text className="text-primary font-bold text-xl mb-4">
          Order Summary
        </Text>

        {/* Subtotal */}
        <View className="flex-row justify-between mb-4">
          <Text className="text-secondary">Subtototal</Text>
          <Text className=" font-bold">${cartTotal.toFixed(2)}</Text>
        </View>

        {/* Tax */}
        <View className="flex-row justify-between mb-4">
          <Text className="text-secondary">Tax</Text>
          <Text className=" font-bold">${tax.toFixed(2)}</Text>
        </View>

        {/* Shipping */}
        <View className="flex-row justify-between mb-4">
          <Text className="text-secondary">Shipping</Text>
          <Text className=" font-bold">${shipping.toFixed(2)}</Text>
        </View>

        {/* Total */}
        <View className="flex-row justify-between mb-6 border-t-2 border-gray-100 pt-4">
          <Text className="text-primary text-xl font-bold">Total</Text>
          <Text className=" text-primary text-xl font-bold">
            ${total.toFixed(2)}
          </Text>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={loading}
          className={`p-4 rounded-xl items-center ${loading ? "bg-gray-400" : "bg-primary"}`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
