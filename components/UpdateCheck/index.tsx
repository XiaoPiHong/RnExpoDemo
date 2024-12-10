import { View, Text, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import * as Application from "expo-application";
import * as downloadlUtil from "@/utils/download";
import { ProgressBar } from "react-native-paper";
import { useTheme } from "@/context/useThemeContext";
import Big from "big.js";
import * as IntentLauncher from "expo-intent-launcher";
import RNFS from "react-native-fs";

/** ios全包更新需要引导用户到App Store；android全包更新可直接下载安装包 */
const UpdateCheck = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  // [0,1]
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  /** 开发使用的版本记录 */
  const versionCode = Application.nativeBuildVersion; // Android: "114", iOS: "2.11.0"
  /** 用户可看到的版本号 */
  const versionName = Application.nativeApplicationVersion; //"2.11.0"

  const getFileNameFromUrl = (url) => {
    // 提取路径部分，去掉查询参数
    const path = url.split("?")[0];
    // 获取路径的最后部分作为文件名
    const fileName = path.substring(path.lastIndexOf("/") + 1);
    return fileName;
  };

  useEffect(() => {
    // if (!__DEV__) {
    const newVersionInfo = {
      ios: {
        versionCode: "2.11.0",
        versionName: "2.11.0",
        appStoreUrl: "https://apps.apple.com/app/id123456789",
        size: 4096,
      },
      android: {
        versionCode: "114",
        versionName: "2.11.0",
        apkUrl:
          "https://xuexiangjys.oss-cn-shanghai.aliyuncs.com/apk/xupdate_demo_1.0.2.apk",
        size: 4096,
      },
    };

    if (Platform.OS === "ios") {
      if (
        versionName !== newVersionInfo.ios.versionName ||
        versionCode !== newVersionInfo.ios.versionCode
      ) {
        setVisible(true);
      }
    }
    if (Platform.OS === "android") {
      if (
        versionCode !== newVersionInfo.android.versionName ||
        versionName !== newVersionInfo.android.versionCode
      ) {
        // downloadlUtil
        //   .deleteFile(getFileNameFromUrl(newVersionInfo.android.apkUrl))
        //   .then(async () => {
        setVisible(true);
        downloadlUtil
          .downloadFile(
            newVersionInfo.android.apkUrl,
            getFileNameFromUrl(newVersionInfo.android.apkUrl),
            setProgress
          )
          .then(async (result) => {
            const externalPath =
              RNFS.ExternalDirectoryPath + `/${getFileNameFromUrl(result!)}`;
            await RNFS.moveFile(result!, externalPath);
            await IntentLauncher.startActivityAsync(
              "android.intent.action.VIEW",
              {
                data: `file://${externalPath}`,
                type: "application/vnd.android.package-archive",
              }
            );
          });

        // });
      }
    }
    // }
  }, []);
  return (
    <View
      style={[
        styles.layout,
        {
          top: insets.top,
          left: insets.left,
          right: insets.right,
          bottom: insets.bottom,
          display: visible ? "flex" : "none",
        },
      ]}
    >
      <Text style={{ color: "#fff" }}>需要更新</Text>
      <Text style={{ color: "#fff" }}>
        当前进度{new Big(progress).times(100).toNumber()}%
      </Text>
      <View style={styles.progressBarContainer}>
        {/** 使用progress属性会有精度问题，使用animatedValue正常 */}
        <ProgressBar
          animatedValue={progress}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
      </View>
    </View>
  );
};
export default UpdateCheck;

const styles = StyleSheet.create({
  layout: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  progressBarContainer: {
    width: "100%",
    padding: 16,
  },
});
