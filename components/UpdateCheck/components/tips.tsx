import { View, Text, StyleSheet, Platform } from "react-native";
import Big from "big.js";
import { useTheme } from "@/context/useThemeContext";
import { ProgressBar } from "react-native-paper";

const Tips = ({ progress }: { progress: number }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.layout}>
      <Text style={{ color: "#fff" }}>需要更新</Text>
      {Platform.OS === "android" && (
        <Text style={{ color: "#fff" }}>
          当前进度{new Big(progress).times(100).toNumber()}%
        </Text>
      )}
      {Platform.OS === "android" && (
        <View style={styles.progressBarContainer}>
          {/** 使用progress属性会有精度问题，使用animatedValue正常 */}
          <ProgressBar
            animatedValue={progress}
            theme={{ colors: { primary: theme.colors.primary } }}
          />
        </View>
      )}
    </View>
  );
};
export default Tips;

const styles = StyleSheet.create({
  layout: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarContainer: {
    width: "100%",
    padding: 16,
  },
});
