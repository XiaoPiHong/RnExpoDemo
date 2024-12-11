import { View, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import * as Application from "expo-application";
import * as downloadlUtil from "@/utils/download";
import * as Linking from "expo-linking";
import VersionInfo from "./components/VersionInfo";

export interface IVersionInfo {
  ios: {
    versionCode: string;
    versionName: string;
    appStoreUrl: string;
    modifyContent: string;
    size: number;
  };
  android: {
    versionCode: string;
    versionName: string;
    apkUrl: string;
    modifyContent: string;
    size: number;
  };
}

/** ios全包更新需要引导用户到App Store；android全包更新可直接下载安装包 */
const UpdateCheck = () => {
  const [versionInfo, setVersionInfo] = useState<IVersionInfo | null>(null);
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

  const install = async (info: IVersionInfo) => {
    if (Platform.OS === "ios") {
      Linking.openURL(info.ios.appStoreUrl);
    }
    if (Platform.OS === "android") {
      const apkName = getFileNameFromUrl(info.android.apkUrl);

      const uri = await downloadlUtil.downloadFile(
        info.android.apkUrl,
        apkName,
        "apk",
        setProgress
      );
      downloadlUtil.installAPK(uri);
    }
  };

  useEffect(() => {
    if (!__DEV__) {
      const newVersionInfo = {
        ios: {
          versionCode: "2.11.0",
          versionName: "2.11.0",
          appStoreUrl: "https://apps.apple.com/app/id123456789",
          modifyContent:
            "\r\n1、优化api接口。\r\n2、添加使用demo演示。\r\n3、新增自定义更新服务API接口。\r\n4、优化更新提示界面。",
          size: 4096,
        },
        android: {
          versionCode: "114",
          versionName: "2.11.0",
          apkUrl:
            "https://xuexiangjys.oss-cn-shanghai.aliyuncs.com/apk/xupdate_demo_1.0.2.apk",
          modifyContent:
            "\r\n1、优化api接口。\r\n2、添加使用demo演示。\r\n3、新增自定义更新服务API接口。\r\n4、优化更新提示界面。",
          size: 4096,
        },
      };

      setVersionInfo(newVersionInfo);

      /** 是否最新版本 */
      const isLastVersion =
        versionName === newVersionInfo.android.versionName &&
        versionCode === newVersionInfo.android.versionCode;

      if (Platform.OS === "ios") {
        if (!isLastVersion) {
          setVisible(true);
          install(newVersionInfo);
        }
      }
      if (Platform.OS === "android") {
        const apkName = getFileNameFromUrl(newVersionInfo.android.apkUrl);
        /** 已经是最新版本需清空apk目录（防止已经安装过的版本未删除），否者保留最新版本的文件来更新 */
        downloadlUtil
          .clearDirectoryRecursively("apk", isLastVersion ? void 0 : apkName)
          .then(async () => {
            if (!isLastVersion) {
              setVisible(true);
              install(newVersionInfo);
            }
          });
      }
    }
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
      <VersionInfo
        progress={progress}
        versionInfo={versionInfo}
        install={install}
      />
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
});
