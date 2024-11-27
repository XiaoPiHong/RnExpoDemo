import * as Crypto from "expo-crypto";

export async function generateRandomString(length: number): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(length); // Generate random bytes
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // Alphanumeric characters
  let result = "";

  for (let i = 0; i < length; i++) {
    const index = bytes[i] % characters.length; // Map byte value to character index
    result += characters[index];
  }

  return result;
}
