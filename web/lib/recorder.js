export const MAX_RECORD_MS = 90000;
export const MIN_RECORD_MS = 1200;

export function recorderSupport() {
  if (typeof window === "undefined") return "unknown";
  if (!navigator.mediaDevices?.getUserMedia) return "unsupported";
  if (!window.MediaRecorder) return "unsupported";
  return "ok";
}

export function pickMimeType() {
  if (typeof window === "undefined" || !window.MediaRecorder) return "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4;codecs=mp4a.40.2",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  if (!window.MediaRecorder.isTypeSupported) return "";
  return candidates.find((type) => window.MediaRecorder.isTypeSupported(type)) || "";
}

export function describeRecorderError(error) {
  const name = error?.name || "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "麦克风权限被拒绝。请在浏览器地址栏的权限设置里允许麦克风，然后重试。";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "没有找到可用的麦克风，请检查设备连接。";
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return "麦克风被其他程序占用了，关掉会议或录音软件后再试。";
  }
  if (name === "OverconstrainedError") {
    return "当前麦克风不支持所需参数，换一个输入设备试试。";
  }
  return "录音没有启动成功，请重试或更换浏览器。";
}
