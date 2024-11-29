import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const PageLayout = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.layout,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
        {/* <Stack.Screen name="help" />
        <Stack.Screen name="about" /> */}
      </Stack>
    </View>
  );
};

export default PageLayout;

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});
