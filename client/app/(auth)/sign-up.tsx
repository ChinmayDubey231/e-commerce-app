import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpPage() {
  const { signUp, fetchStatus } = useSignUp();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    if (!signUp) return;

    try {
      // 1. Force a fresh sign-up attempt to prevent 'client_state_invalid'
      await signUp.create({ emailAddress: emailAddress.trim() });

      // 2. Official Doc Method: .password()
      const { error } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
        firstName,
        lastName,
      });

      if (error) {
        console.error("Sign-Up Error:", JSON.stringify(error, null, 2));
        return;
      }

      await signUp.verifications.sendEmailCode();
    } catch (err) {
      console.error("Caught Sign-Up Error:", err);
    }
  };

  const handleVerify = async () => {
    if (!signUp) return;

    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as Href);
        },
      });
    }
  };

  if (isSignedIn) {
    router.replace("/");
    return null;
  }

  // --- VERIFICATION VIEW ---
  if (
    signUp?.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address")
  ) {
    return (
      <SafeAreaView className="flex-1 bg-white p-6 justify-center">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Verify Email
        </Text>
        <Text className="text-gray-500 mb-6">
          Enter the code sent to your inbox
        </Text>

        <TextInput
          className="w-full border border-gray-300 rounded-xl p-4 mb-4 text-center tracking-widest bg-gray-50"
          value={code}
          placeholder="000000"
          onChangeText={setCode}
          keyboardType="numeric"
        />

        <TouchableOpacity
          className="bg-[#0a7ea4] p-4 rounded-xl items-center mb-4"
          onPress={handleVerify}
          disabled={fetchStatus === "fetching"}
        >
          {fetchStatus === "fetching" ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Verify Account</Text>
          )}
        </TouchableOpacity>

        {/* RETURN BUTTON: Allows user to go back to the signup form */}
        <TouchableOpacity
          onPress={async () => {
            await signUp.reset();
          }}
          className="items-center py-2"
        >
          <Text className="text-gray-500 font-medium">Back to Sign Up</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isSignedIn) {
    router.replace("/");
    return null;
  }

  // --- MAIN SIGN UP VIEW ---
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        <Text className="text-3xl font-bold text-gray-900 mb-8">
          Create Account
        </Text>

        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="text-gray-700 font-semibold mb-2">First Name</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 bg-gray-50"
              value={firstName}
              placeholder="John"
              onChangeText={setFirstName}
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-700 font-semibold mb-2">Last Name</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 bg-gray-50"
              value={lastName}
              placeholder="Doe"
              onChangeText={setLastName}
            />
          </View>
        </View>

        <Text className="text-gray-700 font-semibold mb-2">Email address</Text>
        <TextInput
          className="w-full border border-gray-300 rounded-xl p-4 mb-4 bg-gray-50"
          autoCapitalize="none"
          value={emailAddress}
          placeholder="user@example.com"
          onChangeText={setEmailAddress}
          keyboardType="email-address"
        />

        <Text className="text-gray-700 font-semibold mb-2">Password</Text>
        <TextInput
          className="w-full border border-gray-300 rounded-xl p-4 mb-8 bg-gray-50"
          value={password}
          placeholder="Create a password"
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity
          className={`p-4 rounded-xl items-center mb-4 ${
            !emailAddress || !password || fetchStatus === "fetching"
              ? "bg-gray-300"
              : "bg-[#0a7ea4]"
          }`}
          onPress={handleSubmit}
          disabled={!emailAddress || !password || fetchStatus === "fetching"}
        >
          <Text className="text-white font-bold text-lg">Continue</Text>
        </TouchableOpacity>

        {/* GUEST BUTTON: Bypasses Auth */}
        <TouchableOpacity
          className="border border-gray-300 p-4 rounded-xl items-center mb-6"
          onPress={() => router.replace("/")}
        >
          <Text className="text-gray-700 font-bold">Continue as Guest</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-600">Already have an account? </Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity>
              <Text className="text-[#0a7ea4] font-bold">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </ScrollView>
    </SafeAreaView>
  );
}
