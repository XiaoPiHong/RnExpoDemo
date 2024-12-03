/**
 * 每个环境变量都必须使用 JavaScript 的点表示法静态引用为 process.env 的属性，才能内联。例如，表达式 process.env.EXPO_PUBLIC_KEY 有效并且将被内联
 * 不支持表达式的替代版本。例如，process.env['EXPO_PUBLIC_KEY'] 或 const {EXPO_PUBLIC_X} = process.env 无效，不会被内联
 * */
const getEnvConfig = () => {
  return {
    EXPO_PUBLIC_BASE_API_URL: process.env.EXPO_PUBLIC_BASE_API_URL,
    EXPO_PUBLIC_SERVER_URL: process.env.EXPO_PUBLIC_SERVER_URL,
  };
};

export { getEnvConfig };
