import { dummyUser } from "@/assets/assets";
import Header from "@/components/Header";
import { COLORS, PROFILE_MENU } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user } = { user: dummyUser };
  const router = useRouter();

  const handleLogout = async () => {
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Profile" showCart showMenu />
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          !user
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : { paddingTop: 16 }
        }
      >
        {!user ? (
          //Guest User Screen
          <View className="items-center w-full">
            <View className="w-28 h-28 rounded-full bg-gray-200 items-center justify-center mb-6">
              <Ionicons name="person" size={40} color={COLORS.secondary} />
            </View>
            <Text className="text-3xl text-primary font-bold mb-2">
              Guest User
            </Text>
            <Text className="text-secondary text-lg mb-5 text-center w-3/4 px-4">
              Log in to view your profile, wishlist, and orders.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/sign-in")}
              className="bg-primary w-3/5 py-3 rounded-full items-center shadow-lg"
            >
              <Text className="text-white font-bold text-lg">
                Login / Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/*User Profile Screen*/}
            <View className="items-center mb-8">
              <View className="mb-3">
                <Image
                  source={{ uri: user.imageUrl }}
                  className="size-32 border-2 border-white shadow-sm rounded-full"
                />
              </View>
              <Text className="text-primary text-2xl font-bold">
                {user.firstName + " " + user.lastName}
              </Text>
              <Text className="text-secondary text-sm">
                {user.emailAddresses[0].emailAddress}
              </Text>

              {/* Admin Panel Button if user is admin */}
              {user.publicMetadata?.role === "admin" && (
                <TouchableOpacity
                  onPress={() => router.push("/admin")}
                  className="mt-4 bg-primary px-6 py-2 rounded-full"
                >
                  <Text className="text-white font-bold text-lg">
                    Admin Panel
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {/*Menu */}
            <View className="bg-white rounded-xl border-gray-100/75 p-2 mb-4">
              {PROFILE_MENU.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  className={`flex-row items-center p-4 ${index !== PROFILE_MENU.length - 1 ? "border-b border-gray-100" : ""}`}
                  onPress={() => router.push(item.route as any)}
                >
                  <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-4">
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>

                  <Text className="text-primary font-medium flex-1">
                    {item.title}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.secondary}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/*Logout Button */}
            <TouchableOpacity
              onPress={() => router.push(handleLogout)}
              className="flex-row items-center justify-center p-4"
            >
              <Text className="text-red-500 font-bold text-lg ml-2 bg-red-200 px-40 py-3 rounded-full   ">
                Logout
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
