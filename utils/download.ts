import * as FileSystem from "expo-file-system";
import useToast from "@/hooks/useToast";
import Big from "big.js";

const { toast } = useToast();

const deleteFile = async (fileName) => {
  try {
    const fileUri = FileSystem.documentDirectory + fileName;
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

const downloadFile = async (url, fileName, setProgress) => {
  try {
    // 定义文件保存路径
    const fileUri = FileSystem.documentDirectory + fileName;

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
      toast.success("Download Complete,The file is already fully downloaded.");
      setProgress(1);
      return; // 文件已完全下载，无需重新下载
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
    toast.success(
      `Download Complete,The file has been downloaded to: ${result?.uri}`
    );
  } catch (error) {
    console.error("Error during download:", error);
    toast.error(
      "Download Error,An error occurred during download. Please try again."
    );
  }
};

export { downloadFile, deleteFile };
