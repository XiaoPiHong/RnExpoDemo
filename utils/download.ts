import * as FileSystem from "expo-file-system";
import useToast from "@/hooks/useToast";

const { toast } = useToast();

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

        // 确保 totalSize 合法，避免除零错误
        if (totalSize > 0) {
          // 计算进度值
          const progress = (totalBytesWritten + downloadedSize) / totalSize;

          // 限制范围并保留两位小数
          const clampedProgress = Math.min(Math.max(progress, 0), 1); // 确保在 [0, 1]
          const roundedProgress = Math.round(clampedProgress * 100) / 100; // 保留两位小数

          console.log(`Progress: ${roundedProgress}`);
          setProgress(roundedProgress);
        } else {
          console.error("Invalid totalSize value:", totalSize);
          setProgress(0);
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

export { downloadFile };
