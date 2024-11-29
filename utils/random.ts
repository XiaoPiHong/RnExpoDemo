import * as Crypto from "expo-crypto";
import { Platform } from "react-native";

/** Crypto的在web端需要https，此处用不同的库兼容http的情况 */
export async function generateRandomString(length: number): Promise<string> {
  const bytes =
    Platform.OS === "web"
      ? new Uint8Array(length)
      : await Crypto.getRandomBytesAsync(length); // Generate random bytes
  if (Platform.OS === "web") {
    window.crypto.getRandomValues(bytes);
  }

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // Alphanumeric characters
  let result = "";

  for (let i = 0; i < length; i++) {
    const index = bytes[i] % characters.length; // Map byte value to character index
    result += characters[index];
  }

  return result;
}
