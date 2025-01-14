import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/** AsyncStorage在Web端初始化时候获取不到window，此处兼容一下 */
export const appStorage = {
  setItem: async (key, value) => {
    if (Platform.OS === "web") {
      if (typeof localStorage === "undefined") {
        return null;
      }
      return localStorage.setItem(key, value);
    }
    return AsyncStorage.setItem(key, value);
  },

  getItem: async (key) => {
    if (Platform.OS === "web") {
      if (typeof localStorage === "undefined") {
        return null;
      }
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  },
  removeItem: async (key) => {
    if (Platform.OS === "web") {
      if (typeof localStorage === "undefined") {
        return null;
      }
      return localStorage.removeItem(key);
    }
    return AsyncStorage.removeItem(key);
  },
  clear: async () => {
    if (Platform.OS === "web") {
      if (typeof localStorage === "undefined") {
        return null;
      }
      return localStorage.clear();
    }
    return AsyncStorage.clear();
  },
};

// 防止上次数据残留
if (__DEV__) {
  // appStorage.clear();
}

/**
 * 过滤器类型 Enum
 */
enum FilterTypeEnum {
  JSON = "JSON",
}

/**
 * 过滤器类型到 filter 的映射
 */
const filterTypeToFilterMap = new Map<
  FilterTypeEnum,
  { get: (value) => any; set: (value) => string }
>([
  [
    FilterTypeEnum.JSON,
    {
      get: (value) => JSON.parse(value),
      set: (value) => JSON.stringify(value),
    },
  ],
]);

/**
 * 创建存储空间
 * @param storage 存储 API
 */
function createStore(storage: typeof appStorage) {
  return function (key: string, filterType?: FilterTypeEnum) {
    return {
      async get() {
        let value = await storage.getItem(key);

        if (typeof filterType !== "undefined") {
          const filter = filterTypeToFilterMap.get(filterType);

          if (filter) {
            value = filter.get(value);
          }
        }

        return value;
      },
      set(value) {
        if (typeof filterType !== "undefined") {
          const filter = filterTypeToFilterMap.get(filterType);

          if (filter) {
            value = filter.set(value);
          }
        }

        return storage.setItem(key, value);
      },
      remove: () => storage.removeItem(key),
    };
  };
}

/**
 * 创建本地存储空间
 * @param key 存储空间标识
 * @param filterType 过滤器类型
 */
const createLocalStorage = createStore(appStorage);

/**
 * 本地存储空间对象
 */
export const local = {
  i18n: createLocalStorage("i18n"), // 当前语言
  // user: createLocalStorage("user", FilterTypeEnum.JSON),
  // accessToken: createLocalStorage("accessToken"),
};
