import { useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!signIn) return;

    setLoading(true); // Ensure you have loading state active

    try {
      const { error } = await signIn.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        console.error("Clerk Sign-In Error:", JSON.stringify(error, null, 2));
        return;
      }

      console.log("Current Sign-In Status:", signIn.status);

      if (signIn.status === "complete") {
        console.log("Login Complete! Attempting Navigation...");

        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/");
            console.log("Finalized URL:", url);
            // Force a replace to the root index
            router.replace("/");
          },
        });
      } else if (signIn.status === "needs_client_trust") {
        console.log("MFA Required - Sending Code...");
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code",
        );
        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
        }
      } else {
        console.log("Unexpected Status:", signIn.status);
      }
    } catch (err) {
      console.error("Catch Block Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!signIn) return;
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.push(url as Href);
        },
      });
    }
  };

  // MFA Verification View
  if (signIn?.status === "needs_client_trust") {
    return (
      <SafeAreaView className="flex-1 bg-white p-6 justify-center">
        <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Verify your account
        </Text>
        <TextInput
          className="w-full border border-gray-300 rounded-xl p-4 mb-4 bg-gray-50"
          value={code}
          placeholder="Verification code"
          onChangeText={setCode}
          keyboardType="numeric"
        />
        {errors?.fields.code && (
          <Text className="text-red-500 mb-2">
            {errors.fields.code.message}
          </Text>
        )}

        <TouchableOpacity
          className="bg-[#0a7ea4] p-4 rounded-xl items-center mb-4"
          onPress={handleVerify}
          disabled={fetchStatus === "fetching"}
        >
          <Text className="text-white font-bold">Verify</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signIn.mfa.sendEmailCode()}>
          <Text className="text-[#0a7ea4] text-center font-semibold">
            Resend Code
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold text-gray-900 mb-8">Sign in</Text>

      <Text className="text-gray-700 font-semibold mb-2">Email address</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-xl p-4 mb-4 bg-gray-50"
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
      />
      {errors?.fields.identifier && (
        <Text className="text-red-500 mb-2">
          {errors.fields.identifier.message}
        </Text>
      )}

      <Text className="text-gray-700 font-semibold mb-2">Password</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-xl p-4 mb-8 bg-gray-50"
        value={password}
        placeholder="Enter password"
        secureTextEntry
        onChangeText={setPassword}
      />
      {errors?.fields.password && (
        <Text className="text-red-500 mb-2">
          {errors.fields.password.message}
        </Text>
      )}

      <TouchableOpacity
        className={`p-4 rounded-xl items-center ${!emailAddress || !password || fetchStatus === "fetching" ? "bg-gray-300" : "bg-[#0a7ea4]"}`}
        onPress={handleSubmit}
        disabled={!emailAddress || !password || fetchStatus === "fetching"}
      >
        {fetchStatus === "fetching" ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg">Continue</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-gray-300 p-4 rounded-xl items-center mt-4"
        onPress={() => router.replace("/")}
      >
        <Text className="text-gray-700 font-bold text-lg">
          Continue as Guest
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-600">Donot have an account? </Text>
        <Link href="/sign-up">
          <Text className="text-[#0a7ea4] font-bold">Sign up</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
