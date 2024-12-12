import { View, Text, StyleSheet, Platform } from "react-native";
import Big from "big.js";
import { useTheme } from "@/context/useThemeContext";
import { ProgressBar } from "react-native-paper";
import type { IVersionInfo } from "..";
import { Button } from "react-native-paper";

const Tips = ({
  progress,
  versionInfo,
  install,
}: {
  progress: number;
  versionInfo: IVersionInfo | null;
  install: (info: IVersionInfo) => void;
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.layout}>
      <Text style={{ color: "#fff" }}>需要更新</Text>
      {Platform.OS === "ios" && (
        <>
          <Text
            style={{
              color: "#fff",
              lineHeight: 20,
              marginBottom: 16,
            }}
          >
            {versionInfo?.ios.modifyContent}
          </Text>
          <View style={styles.btnContainer}>
            <Button mode="contained" onPress={() => install(versionInfo!)}>
              前往App Store更新
            </Button>
          </View>
        </>
      )}
      {Platform.OS === "android" && (
        <>
          <Text
            style={{
              color: "#fff",
              lineHeight: 20,
              marginBottom: 16,
            }}
          >
            {versionInfo?.android.modifyContent}
          </Text>
          <View style={styles.progressBarContainer}>
            {/** 使用progress属性会有精度问题，使用animatedValue正常 */}
            <ProgressBar
              animatedValue={progress}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </View>
          <Text style={{ color: "#fff", marginBottom: 16 }}>
            当前进度{new Big(progress).times(100).toNumber()}%
          </Text>
          {progress === 1 && (
            <View style={styles.btnContainer}>
              <Button mode="contained" onPress={() => install(versionInfo!)}>
                更新
              </Button>
            </View>
          )}
        </>
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
    paddingLeft: 16,
    paddingRight: 16,
  },
  progressBarContainer: {
    width: "100%",
  },
  btnContainer: {
    width: "100%",
  },
});
