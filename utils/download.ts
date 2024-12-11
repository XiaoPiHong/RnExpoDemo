import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import Big from "big.js";

const deleteFile = async (fileName, directory) => {
  try {
    const fileUri = FileSystem.cacheDirectory + `${directory}/${fileName}`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
      console.log("File deleted successfully.");
    } else {
      console.log("File does not exist.");
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

const downloadFile = async (url, fileName, directory, setProgress) => {
  try {
    // 定义文件保存路径和目录路径
    const directoryUri = FileSystem.cacheDirectory + `${directory}/`;
    const fileUri = directoryUri + fileName;

    // 检查目录是否存在
    const directoryInfo = await FileSystem.getInfoAsync(directoryUri);

    // 如果目录不存在，创建目录
    if (!directoryInfo.exists) {
      console.log("Directory does not exist, creating directory...");
      await FileSystem.makeDirectoryAsync(directoryUri, {
        intermediates: true,
      });
    }

    // 检查文件是否已存在
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    let downloadedSize = 0;

    if (fileInfo.exists) {
      console.log("File already exists, checking download progress...");
      downloadedSize = fileInfo.size;
    }

    // 获取远程文件的总大小
    const response = await fetch(url, { method: "HEAD" });
    const totalSize = parseInt(response.headers.get("Content-Length")!, 10);
    if (downloadedSize === totalSize) {
      console.log("File already fully downloaded.");
      setProgress(1);
      // 文件已完全下载，无需重新下载
      return fileInfo.uri;
    }

    console.log(`Starting/resuming download from ${downloadedSize} bytes...`);
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {
        headers:
          downloadedSize > 0 ? { Range: `bytes=${downloadedSize}-` } : {},
      },
      (downloadProgress) => {
        const { totalBytesWritten } = downloadProgress;

        try {
          // 验证 totalSize 是否合法
          if (!totalSize || totalSize <= 0) {
            console.warn("Invalid or undefined totalSize:", totalSize);
            setProgress(0); // 重置进度
            return;
          }

          // 使用 Big.js 计算进度
          const totalWritten = new Big(totalBytesWritten).plus(downloadedSize); // 精确累加
          const total = new Big(totalSize); // 转换为 Big 对象
          let progress = totalWritten.div(total); // 使用 Big.js 的 div 方法计算

          // 确保进度在 [0, 1] 范围内
          progress = progress.lt(0)
            ? new Big(0)
            : progress.gt(1)
            ? new Big(1)
            : progress;

          progress = progress.toString();
          progress = progress.substring(0, 4); // 下取整

          console.log(progress, parseFloat(progress));

          // 转换为普通数字并更新进度
          setProgress(parseFloat(progress));
        } catch (error) {
          // 捕获计算错误并处理
          console.error("Error during progress calculation:", error);
          setProgress(0); // 出现异常时重置进度
        }
      }
    );

    const result = await downloadResumable.downloadAsync();
    console.log("Download completed:", result?.uri);
    return result?.uri;
  } catch (error) {
    console.error("Error during download:", error);
    setProgress(0); // 发生错误时，重置进度
  }
};
const clearDirectoryRecursively = async (directory, fileToSkip) => {
  try {
    const dirUri = FileSystem.cacheDirectory + directory;

    // 获取文件夹中的所有文件和子文件夹
    const items = await FileSystem.readDirectoryAsync(dirUri);

    let isEmpty = true; // 标记文件夹是否为空

    for (let item of items) {
      const itemUri = dirUri + "/" + item;

      // 判断是否是需要跳过的文件
      if (item === fileToSkip) {
        console.log(`Skipping: ${itemUri}`);
        isEmpty = false;
        continue; // 跳过删除该文件
      }

      await FileSystem.deleteAsync(itemUri, { idempotent: true });
      console.log(`Deleted: ${itemUri}`);
    }

    // 只有在文件夹为空时，才删除文件夹
    if (isEmpty) {
      await FileSystem.deleteAsync(dirUri, { idempotent: true });
      console.log(`Deleted empty directory: ${dirUri}`);
    }
  } catch (error) {
    console.error("Error clearing directory:", error);
  }
};

const installAPK = async (fileUri) => {
  try {
    // 检查 APK 文件是否存在
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      console.log("APK file does not exist.");
      return;
    }
    // 获取file://URI 并将其转换为内容 URI（content://），以便 Expo 之外的其他应用程序可以访问它
    const cUri = await FileSystem.getContentUriAsync(fileInfo.uri);

    const result = await IntentLauncher.startActivityAsync(
      "android.intent.action.VIEW",
      {
        data: cUri,
        flags: 1,
      }
    );

    console.log("Intent to install APK sent!");
    return result;
  } catch (error) {
    console.error("Error launching intent:", error);
  }
};

export { downloadFile, deleteFile, installAPK, clearDirectoryRecursively };
