const { EXPO_PUBLIC_BASE_API_URL, EXPO_PUBLIC_SERVER_URL } = process.env;

/** 配置文件的变量一定要通过该函数获取，不能直接从@env引入，否者模板字符串无法识别 */
const getEnvConfig = () => {
  return {
    EXPO_PUBLIC_BASE_API_URL,
    EXPO_PUBLIC_SERVER_URL,
  };
};

export { getEnvConfig };
