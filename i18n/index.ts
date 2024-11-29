import i18next, { ModuleType } from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import * as storageUtils from "@/utils/storage";
import enUs from "@/locales/en-US.json";
import zhCn from "@/locales/zh-CN.json";

const resources = {
  en: { translation: enUs },
  zh: { translation: zhCn },
};

const languageDetector = {
  type: "languageDetector" as ModuleType,
  async: true,
  detect: function (callback) {
    // 获取上次选择的语言
    storageUtils.local.i18n.get().then((lng) => {
      console.log("i18n初始化时", lng);
      if (lng) {
        // 如果是跟随本地，则获取系统语言
        if (lng === "locale") {
          callback(getSystemLanguage());
        } else {
          // 如果不是跟随本地，则获取上次选择的语言
          callback(lng);
        }
      } else {
        storageUtils.local.i18n.set("locale");
        callback(getSystemLanguage());
      }
    });
  },
};

// 初始化i18next配置
i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "zh", // 切换语言失败时的使用的语言
    debug: __DEV__, // 开发环境开启调试
    // 资源文件
    resources,
    react: {
      useSuspense: false,
    },
  });

/**
 * 获取当前系统语言
 * @returns {string}
 */
export const getSystemLanguage = (): string | null => {
  const locales = Localization.getLocales();
  console.log(locales);
  return locales[0]?.languageCode || null;
};
export default i18next;
