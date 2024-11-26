import * as SecureStore from "expo-secure-store"; // @expo/secure-store 值最大存储2048字节

export const appStorage = {
  setItem: (key, value) => {
    return SecureStore.setItemAsync(key, value);
  },

  getItem: (key) => {
    return SecureStore.getItemAsync(key);
  },
  removeItem: (key) => {
    return SecureStore.deleteItemAsync(key);
  },
};

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
