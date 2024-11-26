import AsyncStorage from "@react-native-async-storage/async-storage";

// 防止上次数据残留
// if (__DEV__) {
//   AsyncStorage.clear();
// }

export const appStorage = {
  setItem: (key, value) => {
    return AsyncStorage.setItem(key, value);
  },

  getItem: (key) => {
    return AsyncStorage.getItem(key);
  },
  removeItem: (key) => {
    return AsyncStorage.removeItem(key);
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
