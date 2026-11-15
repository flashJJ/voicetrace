import { image } from "./image";

export const ghostStories = [
  {
    slug: "eagle-orchid",
    mode: "ghost",
    modeLabel: "鬼故事模式",
    featured: false,
    title: "井边的鹰爪兰",
    subtitle: "海幢寺 · 一个关于冤屈与花的故事",
    dialect: "粤语 · 广州海珠",
    type: "鬼故事 · 民间传说改编",
    duration: "4 分钟",
    cover: image(
      "eerie old Cantonese temple at night, a single oil lamp, an ancient well with an eagle-claw orchid, mist, cinematic, muted teal and amber, 4:3"
    ),
    quote: "有些冤屈，会开成一株花。",
    intro:
      "海幢寺有句话：未有海幢寺，先有鹰爪兰。今晚，你一个人留在寺里抄经。",
    scenes: [
      {
        id: "eagle-1",
        act: 1,
        title: "井边的哭声",
        textYue:
          "夜半，寺里只剩你一个人。你听见后院井边有女子低声哭。月光照住井口，井水黑到见唔到底。",
        textZh:
          "半夜，寺里只剩你一个人。你听见后院井边有女子低声哭泣。月光照着井口，井水深得看不见底。",
        audioText:
          "夜半，寺里只剩你一个人。你听见后院井边有女子低声哭。月光照住井口，井水黑到见唔到底。",
        glossary: [
          { term: "海幢寺", meaning: "广州海珠区千年古刹", note: "“未有海幢寺，先有鹰爪兰”是广州俗语。" },
          { term: "井口", meaning: "水井的开口", note: "旧时寺庙、民居都靠井取水。" },
        ],
        choices: [
          { label: "行近井边", next: "eagle-2a" },
          { label: "去揾守夜僧人", next: "eagle-2b" },
        ],
      },
      {
        id: "eagle-2a",
        act: 2,
        title: "兰香",
        textYue:
          "你行到井边，见到一个着青布衫的女子。她话自己叫兰香，被人冤枉偷玉扣，投井而死。她只想有人信她。",
        textZh:
          "你走到井边，看见一个穿青布衫的女子。她说自己叫兰香，被人冤枉偷玉扣，投井而死。她只想有人相信她。",
        audioText:
          "你行到井边，见到一个着青布衫的女子。她话自己叫兰香，被人冤枉偷玉扣，投井而死。她只想有人信她。",
        glossary: [
          { term: "青布衫", meaning: "青色布衣", note: "旧时婢女的常见穿着。" },
          { term: "玉扣", meaning: "玉制的扣子/饰物", note: "故事里的关键物件。" },
        ],
        choices: [
          { label: "答应帮她查清楚", next: "eagle-3a" },
          { label: "劝她放下，别再困在井边", next: "eagle-3b" },
        ],
      },
      {
        id: "eagle-2b",
        act: 2,
        title: "守夜僧人的故事",
        textYue:
          "守夜僧人叹气，话几十年前有个婢女兰香，被主人冤枉偷玉扣，投井自尽。后来井上长出一株鹰爪兰。",
        textZh:
          "守夜僧人叹气，说几十年前有个婢女兰香，被主人冤枉偷玉扣，投井自尽。后来井上长出一株鹰爪兰。",
        audioText:
          "守夜僧人叹气，话几十年前有个婢女兰香，被主人冤枉偷玉扣，投井自尽。后来井上长出一株鹰爪兰。",
        glossary: [
          { term: "守夜", meaning: "夜间看守", note: "寺庙里有人轮值守夜。" },
          { term: "鹰爪兰", meaning: "寺内名植", note: "传说由兰香化生。" },
        ],
        choices: [
          { label: "去井边看看", next: "eagle-2a" },
          { label: "第二日再算", next: "eagle-3b" },
        ],
      },
      {
        id: "eagle-3a",
        act: 3,
        title: "鹰爪兰开",
        textYue:
          "第二日，井边真系开了一株鹰爪兰。你把兰香的故事讲给寺里的人听，他们为她立了一块小碑。",
        textZh:
          "第二天，井边真的开了一株鹰爪兰。你把兰香的故事讲给寺里的人听，他们为她立了一块小碑。",
        audioText:
          "第二日，井边真系开了一株鹰爪兰。你把兰香的故事讲给寺里的人听，他们为她立了一块小碑。",
        glossary: [
          { term: "立碑", meaning: "立石碑纪念", note: "旧时用来记人、记事。" },
        ],
        choices: [],
        ending: true,
        endingText: "有些冤屈，会开成一株花。",
      },
      {
        id: "eagle-3b",
        act: 3,
        title: "井水无声",
        textYue:
          "你劝兰香放下。哭声停了，井水恢复平静。第二日，井边只多了一株鹰爪兰，花瓣上有露水，好似眼泪。",
        textZh:
          "你劝兰香放下。哭声停了，井水恢复平静。第二天，井边只多了一株鹰爪兰，花瓣上有露水，好像眼泪。",
        audioText:
          "你劝兰香放下。哭声停了，井水恢复平静。第二日，井边只多了一株鹰爪兰，花瓣上有露水，好似眼泪。",
        glossary: [
          { term: "露水", meaning: "早晨凝结的水珠", note: "粤语里也常说“雾水”。" },
        ],
        choices: [],
        ending: true,
        endingText: "有些故事，不一定有真相，但值得被记住。",
      },
    ],
  },
  {
    slug: "golden-flower-lake",
    mode: "ghost",
    modeLabel: "鬼故事模式",
    featured: false,
    title: "仙湖里的金花",
    subtitle: "金花娘娘 · 半夜接生的故事",
    dialect: "粤语 · 广州黄埔",
    type: "鬼故事 · 民间传说改编",
    duration: "4 分钟",
    cover: image(
      "moonlit lake with a small shrine, floating lotus lamps, a woman in white in the distance, eerie but beautiful, cinematic, 4:3"
    ),
    quote: "湖面有灯，唔好随便应。",
    intro:
      "你是一个接生婆。今晚，有人拍门，请你去看一位难产的夫人。",
    scenes: [
      {
        id: "jinhua-1",
        act: 1,
        title: "半夜拍门",
        textYue:
          "半夜，有人拍门，话巡抚夫人难产，请你去接生。你提灯出门，街上一个人都冇。",
        textZh:
          "半夜，有人拍门，说巡抚夫人难产，请你去接生。你提灯出门，街上一个人都没有。",
        audioText:
          "半夜，有人拍门，话巡抚夫人难产，请你去接生。你提灯出门，街上一个人都冇。",
        glossary: [
          { term: "接生", meaning: "帮产妇分娩", note: "旧时乡村多有接生婆。" },
          { term: "巡抚", meaning: "地方高级官员", note: "明清时期的官职。" },
        ],
        choices: [
          { label: "跟佢走", next: "jinhua-2a" },
          { label: "问清楚系边家", next: "jinhua-2b" },
        ],
      },
      {
        id: "jinhua-2a",
        act: 2,
        title: "湖边的白影",
        textYue:
          "走到湖边，你见到一个着白衣的女子，企在水面，手上提住一盏沉香灯。她话：“跟我来，母子平安。”",
        textZh:
          "走到湖边，你看见一个穿白衣的女子，站在水面上，手上提着一盏沉香灯。她说：“跟我来，母子平安。”",
        audioText:
          "走到湖边，你见到一个着白衣的女子，企在水面，手上提住一盏沉香灯。她话：跟我来，母子平安。",
        glossary: [
          { term: "沉香", meaning: "名贵香木", note: "传说金花娘娘的像用沉香木雕成。" },
          { term: "企", meaning: "站", note: "粤语常用词。" },
        ],
        choices: [
          { label: "跟住白影", next: "jinhua-3a" },
          { label: "停低念经", next: "jinhua-3b" },
        ],
      },
      {
        id: "jinhua-2b",
        act: 2,
        title: "金花的名字",
        textYue:
          "来人说，夫人梦见一位老者，叫佢请“金花姑娘”。城里叫金花嘅女子有十几个，只有你识得接生。",
        textZh:
          "来人说，夫人梦见一位老者，叫她请“金花姑娘”。城里叫金花的女子有十几个，只有你懂得接生。",
        audioText:
          "来人说，夫人梦见一位老者，叫佢请金花姑娘。城里叫金花嘅女子有十几个，只有你识得接生。",
        glossary: [
          { term: "老者", meaning: "老人", note: "书面语。" },
          { term: "识得", meaning: "会、懂得", note: "粤语常用词。" },
        ],
        choices: [
          { label: "上轿", next: "jinhua-2a" },
          { label: "带埋香烛", next: "jinhua-3a" },
        ],
      },
      {
        id: "jinhua-3a",
        act: 3,
        title: "沉香像",
        textYue:
          "你入到府里，夫人顺利生下一个男婴。床边多了一尊沉香小像，面相好似湖边个女子。人们叫她金花保子惠福夫人。",
        textZh:
          "你进到府里，夫人顺利生下一个男婴。床边多了一尊沉香小像，面容很像湖边的女子。人们叫她金花保子惠福夫人。",
        audioText:
          "你入到府里，夫人顺利生下一个男婴。床边多了一尊沉香小像，面相好似湖边个女子。人们叫她金花保子惠福夫人。",
        glossary: [
          { term: "保子惠福夫人", meaning: "金花娘娘的封号", note: "民间把她视为生育保护神。" },
        ],
        choices: [],
        ending: true,
        endingText: "有些神，是人在最难的时候，自己请出来的。",
      },
      {
        id: "jinhua-3b",
        act: 3,
        title: "湖灯灭了",
        textYue:
          "你停低念经，白影慢慢散。第二日，夫人生了一个女儿，母女平安。湖边多了一盏没人点嘅灯。",
        textZh:
          "你停下来念经，白影慢慢散去。第二天，夫人生了一个女儿，母女平安。湖边多了一盏没人点的灯。",
        audioText:
          "你停低念经，白影慢慢散。第二日，夫人生了一个女儿，母女平安。湖边多了一盏没人点嘅灯。",
        glossary: [
          { term: "念经", meaning: "诵读经文", note: "旧时人们遇到怪事会念经定神。" },
        ],
        choices: [],
        ending: true,
        endingText: "信与不信，母子都平安。",
      },
    ],
  },
  {
    slug: "dragon-spring",
    mode: "ghost",
    modeLabel: "鬼故事模式",
    featured: false,
    title: "龙宫煮泉",
    subtitle: "从化温泉 · 后山那煲银锅",
    dialect: "粤语 · 广州从化",
    type: "鬼故事 · 民间传说改编",
    duration: "4 分钟",
    cover: image(
      "misty hot spring in a forest at night, a glowing silver pot, dragon shadow in the water, cinematic, 4:3"
    ),
    quote: "泉水热，唔一定系地气。",
    intro:
      "阿公病咗，村里人话，后山个温泉可以医病。你半夜上山，见到一煲银锅。",
    scenes: [
      {
        id: "dragon-1",
        act: 1,
        title: "后山的白气",
        textYue:
          "半夜，后山白气好重。你拨开草丛，见到一煲银锅，锅里的水滚下滚下，旁边坐住一个采药老人。",
        textZh:
          "半夜，后山白气很重。你拨开草丛，看见一口银锅，锅里的水滚了又滚，旁边坐着一个采药老人。",
        audioText:
          "半夜，后山白气好重。你拨开草丛，见到一煲银锅，锅里的水滚下滚下，旁边坐住一个采药老人。",
        glossary: [
          { term: "白气", meaning: "白色的水汽", note: "温泉附近常见。" },
          { term: "采药", meaning: "上山采集草药", note: "旧时乡村常见职业。" },
        ],
        choices: [
          { label: "问老人借泉水", next: "dragon-2a" },
          { label: "偷偷装一壶", next: "dragon-2b" },
        ],
      },
      {
        id: "dragon-2a",
        act: 2,
        title: "徐伯",
        textYue:
          "老人话自己姓徐，系个采药人。当年瘟疫，仙女送佢一个银锅，煮泉济世。后来恶霸来抢，青龙把佢留喺龙宫。",
        textZh:
          "老人说自己姓徐，是个采药人。当年瘟疫流行，仙女送他一口银锅，煮泉水救济百姓。后来恶霸来抢，青龙把他留在龙宫。",
        audioText:
          "老人话自己姓徐，系个采药人。当年瘟疫，仙女送佢一个银锅，煮泉济世。后来恶霸来抢，青龙把佢留喺龙宫。",
        glossary: [
          { term: "瘟疫", meaning: "传染病", note: "旧时对大规模传染病的称呼。" },
          { term: "济世", meaning: "救济世人", note: "常用来形容医者。" },
        ],
        choices: [
          { label: "帮徐伯守住银锅", next: "dragon-3a" },
          { label: "问点样救阿公", next: "dragon-3b" },
        ],
      },
      {
        id: "dragon-2b",
        act: 2,
        title: "银锅不见了",
        textYue:
          "你伸手去装水，银锅忽然沉入地下。白气散开，一个青龙影子在水里望住你。",
        textZh:
          "你伸手去装水，银锅忽然沉入地下。白气散开，一个青龙影子在水里看着你。",
        audioText:
          "你伸手去装水，银锅忽然沉入地下。白气散开，一个青龙影子在水里望住你。",
        glossary: [
          { term: "沉", meaning: "往下落", note: "粤语读 cam4。" },
          { term: "望住", meaning: "看着", note: "粤语常用词。" },
        ],
        choices: [
          { label: "道歉", next: "dragon-2a" },
          { label: "跑", next: "dragon-3b" },
        ],
      },
      {
        id: "dragon-3a",
        act: 3,
        title: "温泉涌出",
        textYue:
          "你帮徐伯守住银锅。第二日，山脚涌出股股温泉。村里人用泉水医病，阿公都好返。",
        textZh:
          "你帮徐伯守住银锅。第二天，山脚涌出股股温泉。村里人用泉水治病，阿公也好了。",
        audioText:
          "你帮徐伯守住银锅。第二日，山脚涌出股股温泉。村里人用泉水医病，阿公都好返。",
        glossary: [
          { term: "股股", meaning: "一股一股地", note: "形容水流不断。" },
        ],
        choices: [],
        ending: true,
        endingText: "有些热，是有人在地下替你煮的。",
      },
      {
        id: "dragon-3b",
        act: 3,
        title: "一壶泉水",
        textYue:
          "徐伯舀了一壶泉水给你：“医病要慢慢来。”你带返屋企，阿公饮咗，咳少咗。",
        textZh:
          "徐伯舀了一壶泉水给你：“治病要慢慢来。”你带回家，阿公喝了，咳嗽少了。",
        audioText:
          "徐伯舀了一壶泉水给你：医病要慢慢来。你带返屋企，阿公饮咗，咳少咗。",
        glossary: [
          { term: "舀", meaning: "用勺子盛", note: "粤语读 jiu2。" },
        ],
        choices: [],
        ending: true,
        endingText: "泉水不会说话，但它记得每一个来取水的人。",
      },
    ],
  },
];
