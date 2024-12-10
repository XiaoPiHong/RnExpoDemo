import { View, Text, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import * as Application from "expo-application";
import * as downloadlUtil from "@/utils/download";
import { ProgressBar } from "react-native-paper";
import { useTheme } from "@/context/useThemeContext";
import Big from "big.js";

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
          "https://job-artifacts.eascdn.net/production/b142dd04-99f0-4f6e-a072-05e654d071a0/8b998202-5941-493f-be36-6d96a30b8571/application-a1e36d5d-99db-4513-9f3f-cc70bc9144fe.apk?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=www-production%40exponentjs.iam.gserviceaccount.com%2F20241210%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241210T034402Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=73beca950af2f51246ee695eabeef392857a6175a6005466e27adacc576d03f5c1a3097b960f487a91de4ed85cb4d1312ca1b1148a7f8d0ac41d5d34d33fcab07cb2ab53462f7c175f0880e82fb8b8b50b8e8d14c46784f7ea93c9eb4d0bcddfc08e9e791cd6128dc96c7774fd4399b99f9949f6e933e393b7fe24c8f92a0f3699f6d1374f8fdbc3648daf2a02c1821d274bfbe1640fe21044b8a09d63b75741a178a6fd589f996abe9e44471ca793ac6e12f9e2e64c4ce08c018eecc693d34ef207e4a22c187451c1dbc4a361dd9423317aeffd7eb69aa8d4a285775b66ceb811cb01ec2d0859ec9d3e51f6415864f4b4c7836eabda7d9d26b74296a95b60ae",
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
        downloadlUtil
          .deleteFile(`${newVersionInfo.android.apkUrl.split("/").pop()}`)
          .then(() => {
            downloadlUtil.downloadFile(
              newVersionInfo.android.apkUrl,
              `${newVersionInfo.android.apkUrl.split("/").pop()}`,
              setProgress
            );
            setVisible(true);
          });
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
