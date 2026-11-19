const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const voiceSamples = [
  {
    id: "kowloon",
    title: "《九龍》",
    note: "九龙地名传说 · 香港市区粤语 · 女声",
    reader: "Ivy",
    duration: "1 分 08 秒",
    src: `${basePath}/audio/hbl-00019.mp3`,
    credit: "Viveik、KEIfr 文，Ivy 朗读",
    sourceUrl: "https://hambaanglaang.hk/kowloon/",
  },
  {
    id: "beach",
    title: "《星期日嘅沙灘》",
    note: "一家人的海边周末 · 香港市区粤语 · 女声",
    reader: "噹",
    duration: "1 分 10 秒",
    src: `${basePath}/audio/hbl-00008.mp3`,
    credit: "葉俊延、Wong Tk 文，噹朗读",
    sourceUrl: "https://hambaanglaang.hk/visit-to-the-beach-on-sunday/",
  },
  {
    id: "father-son",
    title: "《同阿仔玩嘅一日》",
    note: "父子日常 · 香港市区粤语 · 男声",
    reader: "山奴",
    duration: "1 分 13 秒",
    src: `${basePath}/audio/hbl-00012.mp3`,
    credit: "余該隱、Edgar Wong 文，山奴朗读",
    sourceUrl: "https://hambaanglaang.hk/a-day-with-my-son/",
  },
];
