import { View, Text, StyleSheet, Platform } from "react-native";
import Big from "big.js";
import { useTheme } from "@/context/useThemeContext";
import { ProgressBar } from "react-native-paper";
import type { IVersionInfo } from "..";
import { Button, IconButton } from "react-native-paper";

const Tips = ({
  progress,
  versionInfo,
  methods: { install, setVisible },
}: {
  progress: number;
  versionInfo: IVersionInfo | null;
  methods: {
    install: (info: IVersionInfo) => void;
    setVisible: (visible: boolean) => void;
  };
}) => {
  const { theme } = useTheme();

  const getClose = () => {
    switch (Platform.OS) {
      case "ios":
        return versionInfo?.ios.updateStatus === 0;
      case "android":
        return versionInfo?.android.updateStatus === 0;
      default:
        return false;
    }
  };

  const onClickCloseBtn = () => {
    setVisible(false);
  };

  return (
    <View style={styles.layout}>
      {getClose() && (
        <IconButton
          style={styles.closeBtn}
          icon="close"
          size={20}
          onPress={onClickCloseBtn}
        />
      )}
      <Text style={styles.updateTitle}>更新提示</Text>
      {Platform.OS === "ios" && (
        <>
          <Text
            style={{
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
          <View style={styles.versionContainer}>
            <Text style={styles.versionTitle}>
              是否更新到{versionInfo?.android.versionName}版本？
            </Text>
            <Text style={styles.versionSize}>
              新版本大小：{versionInfo?.android.size! / 1024}M
            </Text>
          </View>
          <Text
            style={{
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
          <Text>当前进度{new Big(progress).times(100).toNumber()}%</Text>
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
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  closeBtn: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  versionContainer: {
    width: "100%",
    marginTop: 16,
    gap: 4,
  },
  versionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  versionSize: {
    color: "#41454c",
  },
  progressBarContainer: {
    width: "100%",
  },
  btnContainer: {
    marginTop: 16,
    width: "100%",
  },
});
