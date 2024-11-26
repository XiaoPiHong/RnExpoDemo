import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useSelector } from "react-redux";
import { TRootState } from "@/store/store";

const PageLayout = () => {
  const insets = useSafeAreaInsets();
  const user = useSelector((state: TRootState) => state.user);
  console.log(user);
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
