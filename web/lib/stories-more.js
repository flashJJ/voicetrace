import { cover } from "./image.js";

export const moreStories = [
  {
    slug: "dragonboat-meal",
    audience: "kid",
    ageBand: "6-9",
    kidSafe: true,
    mode: "heritage",
    modeLabel: "正经模式",
    featured: false,
    actCount: 5,
    title: "龙舟饭",
    subtitle: "珠三角水乡 · 一条龙船的一餐",
    dialect: "粤语 · 广州番禺",
    type: "正经 · 水乡故事",
    duration: "6 分钟",
    cover: cover("dragonboat-meal"),
    quote: "龙船扒得快，饭要一齐食。",
    intro:
      "你系村里龙船队嘅后生仔。端午前一日，阿婆叫你负责龙舟饭，几十围人等你开席。",
    scenes: [
      {
        id: "dragon-1",
        act: 1,
        title: "几十围饭",
        textYue:
          "祠堂前摆开几十张圆台，阿婆递你一张单：“猪肉二百斤，菜心一担，饭要够。”你望住单，手心出汗。",
        textZh:
          "祠堂前摆开几十张圆桌，阿婆递给你一张单：“猪肉两百斤，菜心一担，饭要够。”你看着单子，手心出汗。",
        audioText:
          "祠堂前摆开几十张圆台，阿婆递你一张单：猪肉二百斤，菜心一担，饭要够。你望住单，手心出汗。",
        glossary: [
          { term: "龙舟饭", meaning: "端午龙舟活动后的村宴", note: "珠三角水乡常见。" },
          { term: "围", meaning: "桌（宴席）", note: "粤语称一桌酒席为一围。" },
        ],
        choices: [
          { label: "照阿婆张单去买", next: "dragon-2a" },
          { label: "先去问龙船头", next: "dragon-2b" },
        ],
      },
      {
        id: "dragon-2a",
        act: 2,
        title: "墟市讲价",
        textYue:
          "天未光，你踩三轮车去墟市。猪肉佬开价高两成，话端午就系呢个价。你唔识讲价，企喺档口发愣。",
        textZh:
          "天没亮，你蹬三轮车去集市。卖猪肉的开价高两成，说端午就是这个价。你不会讲价，站在摊位前发愣。",
        audioText:
          "天未光，你踩三轮车去墟市。猪肉佬开价高两成，话端午就系呢个价。你唔识讲价，企喺档口发愣。",
        glossary: [
          { term: "墟市", meaning: "集市", note: "粤语称赶集为趁墟。" },
          { term: "发愣", meaning: "发呆", note: "粤语口语。" },
        ],
        choices: [
          { label: "照价买，唔想误事", next: "dragon-3" },
          { label: "打电话问阿婆", next: "dragon-3" },
        ],
      },
      {
        id: "dragon-2b",
        act: 2,
        title: "龙船头的话",
        textYue:
          "龙船头正在上油。佢听完，笑住话：“饭唔使贵，最紧要够热。你去同猪肉佬讲，龙船队要嘅，平啲。”",
        textZh:
          "龙船头正在上油。他听完，笑着说：“饭不用贵，最重要够热。你去跟卖肉的说，龙船队要的，便宜点。”",
        audioText:
          "龙船头正在上油。佢听完，笑住话：饭唔使贵，最紧要够热。你去同猪肉佬讲，龙船队要嘅，平啲。",
        glossary: [
          { term: "龙船头", meaning: "龙舟队的领头人", note: "负责组织和指挥。" },
          { term: "平啲", meaning: "便宜一点", note: "“平”是便宜。" },
        ],
        choices: [
          { label: "照佢教嘅讲", next: "dragon-3" },
          { label: "自己再想办法", next: "dragon-3" },
        ],
      },
      {
        id: "dragon-3",
        act: 3,
        title: "落雨开席",
        textYue:
          "饭刚煮好，天落起大雨。台下的人走了一半，阿婆望住天，唔出声。你哋几个后生仔，赶紧拉雨布。",
        textZh:
          "饭刚煮好，天下起大雨。台下的人走了一半，阿婆看着天，不出声。你们几个年轻人，赶紧拉雨布。",
        audioText:
          "饭刚煮好，天落起大雨。台下的人走了一半，阿婆望住天，唔出声。你哋几个后生仔，赶紧拉雨布。",
        glossary: [
          { term: "雨布", meaning: "防雨的布", note: "村宴常用。" },
          { term: "后生仔", meaning: "年轻人", note: "粤语常用词。" },
        ],
        choices: [
          { label: "撑雨棚，继续开席", next: "dragon-4a" },
          { label: "等雨停再开席", next: "dragon-4b" },
        ],
      },
      {
        id: "dragon-4a",
        act: 4,
        title: "雨中的鼓",
        textYue:
          "雨棚撑起，龙船鼓在雨中敲响。人陆续返来，湿住身都坐低。你舀第一碗饭，手还在抖。",
        textZh:
          "雨棚撑起来，龙船鼓在雨中敲响。人陆续回来，湿着身子也坐下。你舀第一碗饭，手还在抖。",
        audioText:
          "雨棚撑起，龙船鼓在雨中敲响。人陆续返来，湿住身都坐低。你舀第一碗饭，手还在抖。",
        glossary: [
          { term: "舀饭", meaning: "盛饭", note: "粤语“舀”读 jiu2。" },
        ],
        choices: [
          { label: "先端给阿婆", next: "dragon-e1" },
          { label: "先端给龙船队", next: "dragon-e2" },
        ],
      },
      {
        id: "dragon-4b",
        act: 4,
        title: "等到天光",
        textYue:
          "雨落足两个钟，菜都凉了。有人开始走，阿婆终于开口：“开席啦，唔好等。”你赶紧热菜。",
        textZh:
          "雨下了两个钟头，菜都凉了。有人开始走，阿婆终于开口：“开席吧，别等了。”你赶紧热菜。",
        audioText:
          "雨落足两个钟，菜都凉了。有人开始走，阿婆终于开口：开席啦，唔好等。你赶紧热菜。",
        glossary: [
          { term: "热菜", meaning: "把菜加热", note: "粤语“热”可作动词。" },
        ],
        choices: [
          { label: "逐围去道歉", next: "dragon-e1" },
          { label: "默默把菜热好", next: "dragon-e2" },
        ],
      },
      {
        id: "dragon-e1",
        act: 5,
        title: "结局 · 第一碗饭",
        textYue:
          "阿婆接过碗，先夹一块猪肉畀你：“识得先敬人，呢餐饭就成功。”雨声里，几十围人齐齐起筷。",
        textZh:
          "阿婆接过碗，先夹一块猪肉给你：“懂得先敬人，这顿饭就成了。”雨声里，几十桌人齐齐动筷。",
        audioText:
          "阿婆接过碗，先夹一块猪肉畀你：识得先敬人，呢餐饭就成功。雨声里，几十围人齐齐起筷。",
        glossary: [
          { term: "起筷", meaning: "动筷子开吃", note: "宴席常用语。" },
        ],
        choices: [],
        ending: true,
        endingText: "龙船扒得快，饭要一齐食。",
      },
      {
        id: "dragon-e2",
        act: 5,
        title: "结局 · 最后一围",
        textYue:
          "龙船队食完，你发现角落还有一围未动。原来系帮手抬鼓嘅阿伯。你端饭过去，佢笑到见牙唔见眼。",
        textZh:
          "龙船队吃完，你发现角落还有一桌没动。原来是帮忙抬鼓的阿伯。你端饭过去，他笑得合不拢嘴。",
        audioText:
          "龙船队食完，你发现角落还有一围未动。原来系帮手抬鼓嘅阿伯。你端饭过去，佢笑到见牙唔见眼。",
        glossary: [
          { term: "见牙唔见眼", meaning: "笑得合不拢嘴", note: "粤语俗语。" },
        ],
        choices: [],
        ending: true,
        endingText: "一餐饭，最紧要系无人被漏低。",
      },
    ],
  },
  {
    slug: "qingming-hill",
    audience: "family",
    ageBand: "6-9",
    kidSafe: true,
    kidNote: "涉及祭祖与离别，建议家长陪同。",
    mode: "heritage",
    modeLabel: "正经模式",
    featured: false,
    actCount: 6,
    title: "清明·拜山",
    subtitle: "广州白云山 · 一家人的清明",
    dialect: "粤语 · 广州",
    type: "正经 · 家族记忆",
    duration: "7 分钟",
    cover: cover("qingming-hill"),
    quote: "山仲喺度，人就一代一代咁嚟。",
    intro:
      "清明正日，你孭住烧肉同甘蔗上山。阿爸话，今年由你带路。",
    scenes: [
      {
        id: "qingming-1",
        act: 1,
        title: "上山的路",
        textYue:
          "山路湿滑，两边系杂草。阿爸行前面，唔出声。你记得细个嗰阵，系阿爷孭你上嚟。",
        textZh:
          "山路湿滑，两边是杂草。阿爸走在前面，不出声。你记得小时候，是爷爷背你上来的。",
        audioText:
          "山路湿滑，两边系杂草。阿爸行前面，唔出声。你记得细个嗰阵，系阿爷孭你上嚟。",
        glossary: [
          { term: "拜山", meaning: "上山扫墓", note: "粤语称扫墓为拜山。" },
          { term: "孭", meaning: "背", note: "粤语常用词。" },
        ],
        choices: [
          { label: "行快两步，陪阿爸", next: "qingming-2a" },
          { label: "慢慢行，睇住阿妈", next: "qingming-2b" },
        ],
      },
      {
        id: "qingming-2a",
        act: 2,
        title: "阿爸讲旧事",
        textYue:
          "阿爸突然话：“阿爷以前做木工，成条村嘅门都系佢整。”你第一次听，唔知点接。",
        textZh:
          "阿爸突然说：“爷爷以前做木工，整条村的门都是他做的。”你第一次听，不知道该怎么接。",
        audioText:
          "阿爸突然话：阿爷以前做木工，成条村嘅门都系佢整。你第一次听，唔知点接。",
        glossary: [
          { term: "整", meaning: "做、修理", note: "粤语“整”用途很广。" },
        ],
        choices: [
          { label: "问多啲阿爷嘅事", next: "qingming-3" },
          { label: "静静听，唔打断", next: "qingming-3" },
        ],
      },
      {
        id: "qingming-2b",
        act: 2,
        title: "阿妈的红纸",
        textYue:
          "阿妈由袋里拿出红纸同毛笔，话要重新描红。你望住碑上褪色嘅字，忽然觉得陌生。",
        textZh:
          "阿妈从袋里拿出红纸和毛笔，说要重新描红。你看着碑上褪色的字，忽然觉得陌生。",
        audioText:
          "阿妈由袋里拿出红纸同毛笔，话要重新描红。你望住碑上褪色嘅字，忽然觉得陌生。",
        glossary: [
          { term: "描红", meaning: "用红漆描字", note: "扫墓时常见。" },
          { term: "碑", meaning: "墓碑", note: "刻有先人名字。" },
        ],
        choices: [
          { label: "帮阿妈扶住红纸", next: "qingming-3" },
          { label: "问碑上嘅名系边个", next: "qingming-3" },
        ],
      },
      {
        id: "qingming-3",
        act: 3,
        title: "压纸",
        textYue:
          "到了坟前，阿爸叫你压纸。你把纸钱一张张压在坟头，风一吹，纸角翻起，好似有人应。",
        textZh:
          "到了坟前，阿爸叫你压纸。你把纸钱一张张压在坟头，风一吹，纸角翻起，好像有人应。",
        audioText:
          "到了坟前，阿爸叫你压纸。你把纸钱一张张压在坟头，风一吹，纸角翻起，好似有人应。",
        glossary: [
          { term: "压纸", meaning: "在坟头压纸钱", note: "表示后人已来祭扫。" },
        ],
        choices: [
          { label: "同先人讲几句", next: "qingming-4" },
          { label: "默默压好每一张", next: "qingming-4" },
        ],
      },
      {
        id: "qingming-4",
        act: 4,
        title: "烧肉与甘蔗",
        textYue:
          "阿妈切开烧肉，留最肥一块摆在碑前。阿爸削甘蔗，第一截照旧摆低。你问点解，佢话：“甜嘅，要留畀先人。”",
        textZh:
          "阿妈切开烧肉，留最肥一块摆在碑前。阿爸削甘蔗，第一截照旧放下。你问为什么，他说：“甜的，要留给先人。”",
        audioText:
          "阿妈切开烧肉，留最肥一块摆在碑前。阿爸削甘蔗，第一截照旧摆低。你问点解，佢话：甜嘅，要留畀先人。",
        glossary: [
          { term: "摆低", meaning: "放下", note: "粤语“低”表示下。" },
        ],
        choices: [
          { label: "学阿爸削甘蔗", next: "qingming-5a" },
          { label: "把烧肉摆好", next: "qingming-5b" },
        ],
      },
      {
        id: "qingming-5a",
        act: 5,
        title: "手心的甜",
        textYue:
          "你削得歪歪斜斜，阿爸冇笑你，只系接过刀，慢慢示范。甘蔗汁滴喺手，黏黏的，甜甜的。",
        textZh:
          "你削得歪歪斜斜，阿爸没笑你，只是接过刀，慢慢示范。甘蔗汁滴在手上，黏黏的、甜甜的。",
        audioText:
          "你削得歪歪斜斜，阿爸冇笑你，只系接过刀，慢慢示范。甘蔗汁滴喺手，黏黏的，甜甜的。",
        glossary: [
          { term: "示范", meaning: "做样板给人看", note: "书面词，粤语也说“做俾你睇”。" },
        ],
        choices: [
          { label: "问明年仲会唔会嚟", next: "qingming-e1" },
          { label: "话俾阿爸知，你记住了", next: "qingming-e2" },
        ],
      },
      {
        id: "qingming-5b",
        act: 5,
        title: "石碑上的字",
        textYue:
          "你蹲低摆烧肉，见到碑脚刻住一行细字，系阿爷个名。你伸手摸一摸，石头冻，字却好似有温度。",
        textZh:
          "你蹲下摆烧肉，看见碑脚刻着一行小字，是爷爷的名字。你伸手摸了摸，石头冷，字却好像有温度。",
        audioText:
          "你蹲低摆烧肉，见到碑脚刻住一行细字，系阿爷个名。你伸手摸一摸，石头冻，字却好似有温度。",
        glossary: [
          { term: "冻", meaning: "冷", note: "粤语“冻”表示冷。" },
        ],
        choices: [
          { label: "同阿爷讲声多谢", next: "qingming-e1" },
          { label: "问阿爸要唔要补漆", next: "qingming-e2" },
        ],
      },
      {
        id: "qingming-e1",
        act: 6,
        title: "结局 · 下山",
        textYue:
          "落山时，阿爸行得慢。你扶住佢，好似当年阿爷扶住你。山风一吹，纸灰飞起，又慢慢落下。",
        textZh:
          "下山时，阿爸走得慢。你扶着他，好像当年爷爷扶着你。山风一吹，纸灰飞起，又慢慢落下。",
        audioText:
          "落山时，阿爸行得慢。你扶住佢，好似当年阿爷扶住你。山风一吹，纸灰飞起，又慢慢落下。",
        glossary: [
          { term: "纸灰", meaning: "烧纸后的灰", note: "扫墓常见。" },
        ],
        choices: [],
        ending: true,
        endingText: "山仲喺度，人就一代一代咁嚟。",
      },
      {
        id: "qingming-e2",
        act: 6,
        title: "结局 · 明年带路",
        textYue:
          "阿爸点头：“明年你带路。”你应承，心里记住每个转角。原来拜山唔止系扫墓，系把路记落嚟。",
        textZh:
          "阿爸点头：“明年你带路。”你答应，心里记住每个转角。原来扫墓不只是扫墓，是把路记下来。",
        audioText:
          "阿爸点头：明年你带路。你应承，心里记住每个转角。原来拜山唔止系扫墓，系把路记落嚟。",
        glossary: [
          { term: "记落嚟", meaning: "记下来", note: "“落嚟”表示下来。" },
        ],
        choices: [],
        ending: true,
        endingText: "有人记得条路，先有人返得嚟。",
      },
    ],
  },
  {
    slug: "herbal-tea-night",
    audience: "adult",
    ageBand: "10+",
    kidSafe: false,
    mode: "ghost",
    modeLabel: "鬼故事模式",
    featured: false,
    actCount: 6,
    title: "凉茶铺的夜班",
    subtitle: "西关 · 一间老铺的最后一位客人",
    dialect: "粤语 · 广州荔湾",
    type: "鬼故事 · 都市传说",
    duration: "7 分钟",
    cover: cover("herbal-tea-night"),
    quote: "苦茶可以清心，唔可以清债。",
    intro:
      "你接咗阿爷间凉茶铺。第一晚夜班，凌晨三点，有人敲门。",
    scenes: [
      {
        id: "tea-1",
        act: 1,
        title: "凌晨三点",
        textYue:
          "西关老铺，招牌灯泡坏咗一半。你趴喺柜台打瞌睡，忽然“笃、笃、笃”，有人敲木门，节奏好慢。",
        textZh:
          "西关老铺，招牌灯泡坏了一半。你趴在柜台打瞌睡，忽然“笃、笃、笃”，有人敲木门，节奏很慢。",
        audioText:
          "西关老铺，招牌灯泡坏咗一半。你趴喺柜台打瞌睡，忽然笃、笃、笃，有人敲木门，节奏好慢。",
        glossary: [
          { term: "凉茶铺", meaning: "卖凉茶的店铺", note: "岭南街头常见。" },
          { term: "打瞌睡", meaning: "打盹", note: "粤语口语。" },
        ],
        choices: [
          { label: "开门做生意", next: "tea-2a" },
          { label: "话已经收铺", next: "tea-2b" },
        ],
      },
      {
        id: "tea-2a",
        act: 2,
        title: "穿白衫的客人",
        textYue:
          "门外企住个女人，白衫白鞋，头发湿到滴水。佢话：“一碗廿四味，唔该。”声音好轻。",
        textZh:
          "门外站着一个女人，白衣白鞋，头发湿得滴水。她说：“一碗廿四味，谢谢。”声音很轻。",
        audioText:
          "门外企住个女人，白衫白鞋，头发湿到滴水。佢话：一碗廿四味，唔该。声音好轻。",
        glossary: [
          { term: "廿四味", meaning: "一种苦味凉茶", note: "粤语“廿”读 jaa6。" },
          { term: "唔该", meaning: "谢谢、劳驾", note: "粤语常用礼貌语。" },
        ],
        choices: [
          { label: "照碗，端过去", next: "tea-3" },
          { label: "问她系咪住附近", next: "tea-3" },
        ],
      },
      {
        id: "tea-2b",
        act: 2,
        title: "门缝里的水",
        textYue:
          "你话收铺，门外静咗一阵。跟住，门缝下面渗入一滩水，慢慢漫到柜台脚。你闻到淡淡嘅河水味。",
        textZh:
          "你说收铺了，门外静了一会儿。接着，门缝下面渗进一滩水，慢慢漫到柜台脚。你闻到淡淡的河水味。",
        audioText:
          "你话收铺，门外静咗一阵。跟住，门缝下面渗入一滩水，慢慢漫到柜台脚。你闻到淡淡嘅河水味。",
        glossary: [
          { term: "渗入", meaning: "渗进来", note: "书面词。" },
          { term: "一滩水", meaning: "一摊水", note: "粤语常用“一滩”。" },
        ],
        choices: [
          { label: "开门睇清楚", next: "tea-3" },
          { label: "拎地拖抹水", next: "tea-3" },
        ],
      },
      {
        id: "tea-3",
        act: 3,
        title: "墙上的老照片",
        textYue:
          "你转身取碗，见到墙上旧照片：阿爷后生时企喺铺头，旁边有个白衫女人，样貌同眼前一模一样。",
        textZh:
          "你转身取碗，看见墙上老照片：爷爷年轻时站在店里，旁边有个白衣女人，样子和眼前一模一样。",
        audioText:
          "你转身取碗，见到墙上旧照片：阿爷后生时企喺铺头，旁边有个白衫女人，样貌同眼前一模一样。",
        glossary: [
          { term: "后生", meaning: "年轻", note: "粤语常用词。" },
        ],
        choices: [
          { label: "攞照片问佢", next: "tea-4a" },
          { label: "当冇睇到，照端茶", next: "tea-4b" },
        ],
      },
      {
        id: "tea-4a",
        act: 4,
        title: "照片里的手",
        textYue:
          "你把照片放低。女人伸手摸相框，指尖停喺阿爷脸上，轻轻讲：“佢欠我一碗茶，欠咗六十年。”",
        textZh:
          "你把照片放下。女人伸手摸相框，指尖停在爷爷脸上，轻轻说：“他欠我一碗茶，欠了六十年。”",
        audioText:
          "你把照片放低。女人伸手摸相框，指尖停喺阿爷脸上，轻轻讲：佢欠我一碗茶，欠咗六十年。",
        glossary: [
          { term: "欠", meaning: "欠下", note: "粤语“欠”也指亏欠。" },
        ],
        choices: [
          { label: "问佢当年发生咗乜", next: "tea-5" },
          { label: "即刻斟一碗畀佢", next: "tea-5" },
        ],
      },
      {
        id: "tea-4b",
        act: 4,
        title: "碗底的影子",
        textYue:
          "茶端上桌，女人冇饮，只系望住碗。你见到碗底映出另一个画面：河水、木桥、有人伸手求救。",
        textZh:
          "茶端上桌，女人没喝，只是看着碗。你看见碗底映出另一个画面：河水、木桥、有人伸手求救。",
        audioText:
          "茶端上桌，女人冇饮，只系望住碗。你见到碗底映出另一个画面：河水、木桥、有人伸手求救。",
        glossary: [
          { term: "映出", meaning: "倒映出", note: "粤语“映”指映照。" },
        ],
        choices: [
          { label: "问画面系咩事", next: "tea-5" },
          { label: "移开只碗", next: "tea-5" },
        ],
      },
      {
        id: "tea-5",
        act: 5,
        title: "阿爷的本子",
        textYue:
          "你翻开柜台底嘅旧账本，最后一页写住：“某年某月，桥头落水，救唔切。”后面画住一碗茶。",
        textZh:
          "你翻开柜台下的旧账本，最后一页写着：“某年某月，桥头落水，救不及。”后面画着一碗茶。",
        audioText:
          "你翻开柜台底嘅旧账本，最后一页写住：某年某月，桥头落水，救唔切。后面画住一碗茶。",
        glossary: [
          { term: "救唔切", meaning: "来不及救", note: "“切”表示来得及。" },
          { term: "账本", meaning: "记账的本子", note: "老铺常用。" },
        ],
        choices: [
          { label: "照账本，补返呢碗茶", next: "tea-e1" },
          { label: "合上账本，唔想再查", next: "tea-e2" },
        ],
      },
      {
        id: "tea-e1",
        act: 6,
        title: "结局 · 补一碗茶",
        textYue:
          "你重新煲水，斟满一碗，摆喺门口。第二日，碗空咗，墙上照片里嘅女人，好似笑咗一下。",
        textZh:
          "你重新烧水，斟满一碗，放在门口。第二天，碗空了，墙上照片里的女人，好像笑了一下。",
        audioText:
          "你重新煲水，斟满一碗，摆喺门口。第二日，碗空咗，墙上照片里嘅女人，好似笑咗一下。",
        glossary: [
          { term: "煲水", meaning: "烧水", note: "粤语“煲”指煮。" },
        ],
        choices: [],
        ending: true,
        endingText: "苦茶可以清心，唔可以清债。",
      },
      {
        id: "tea-e2",
        act: 6,
        title: "结局 · 不再夜班",
        textYue:
          "你合上账本，第二日就请人拆咗旧招牌。铺头转租之后，街坊话，半夜仍有人见到门口摆住一碗茶。",
        textZh:
          "你合上账本，第二天就请人拆了旧招牌。店铺转租之后，街坊说，半夜仍有人看见门口摆着一碗茶。",
        audioText:
          "你合上账本，第二日就请人拆咗旧招牌。铺头转租之后，街坊话，半夜仍有人见到门口摆住一碗茶。",
        glossary: [
          { term: "转租", meaning: "转给别人租", note: "商铺常见。" },
        ],
        choices: [],
        ending: true,
        endingText: "有啲债，唔系你欠，但会有人等你还。",
      },
    ],
  },
  {
    slug: "whampoa-foreigner",
    audience: "adult",
    ageBand: "10+",
    kidSafe: false,
    mode: "wild_history",
    modeLabel: "野史模式",
    featured: false,
    actCount: 7,
    title: "黄埔古港的番鬼",
    subtitle: "黄埔古港 · 一只怀表嘅野史",
    dialect: "粤语 · 广州海珠",
    type: "野史 · 口岸传说",
    duration: "8 分钟",
    cover: cover("whampoa-foreigner"),
    quote: "海上嚟嘅，唔一定系贼；岸上等嘅，唔一定系好人。",
    intro:
      "你系黄埔古港嘅艇家。深夜，一个番鬼商人叫你载佢落船，畀你一只怀表做定金。",
    scenes: [
      {
        id: "whampoa-1",
        act: 1,
        title: "深夜的客人",
        textYue:
          "古港已经收市，码头只剩几盏灯。一个高鼻金发嘅番鬼企喺栈桥，手里揸住一只银怀表，望住江面。",
        textZh:
          "古港已经收市，码头只剩几盏灯。一个高鼻金发的洋人站在栈桥，手里握着一只银怀表，望着江面。",
        audioText:
          "古港已经收市，码头只剩几盏灯。一个高鼻金发嘅番鬼企喺栈桥，手里揸住一只银怀表，望住江面。",
        glossary: [
          { term: "番鬼", meaning: "旧时对洋人的俗称", note: "带时代色彩，今天不宜当面使用。" },
          { term: "黄埔古港", meaning: "广州海珠的古代外贸港口", note: "清代粤海关重要口岸。" },
        ],
        choices: [
          { label: "接呢单生意", next: "whampoa-2a" },
          { label: "问清楚去边", next: "whampoa-2b" },
        ],
      },
      {
        id: "whampoa-2a",
        act: 2,
        title: "怀表定金",
        textYue:
          "番鬼将怀表抛畀你，表盖弹开，入面唔系钟面，而系一张细相：一个中国女人同一间铺头。",
        textZh:
          "洋人把怀表抛给你，表盖弹开，里面不是表面，而是一张小照片：一个中国女人和一间店铺。",
        audioText:
          "番鬼将怀表抛畀你，表盖弹开，入面唔系钟面，而系一张细相：一个中国女人同一间铺头。",
        glossary: [
          { term: "表盖", meaning: "怀表的盖子", note: "旧式怀表常见。" },
        ],
        choices: [
          { label: "合上表盖，唔多事", next: "whampoa-3" },
          { label: "问相入面系边个", next: "whampoa-3" },
        ],
      },
      {
        id: "whampoa-2b",
        act: 2,
        title: "去边",
        textYue:
          "番鬼用半咸淡广东话讲：“去大船，天亮之前。”你望住江面，大船停得好远，雾又大。",
        textZh:
          "洋人用半咸不淡的广东话说：“去大船，天亮之前。”你看着江面，大船停得很远，雾又大。",
        audioText:
          "番鬼用半咸淡广东话讲：去大船，天亮之前。你望住江面，大船停得好远，雾又大。",
        glossary: [
          { term: "半咸淡", meaning: "不纯正、夹杂口音", note: "形容广东话讲得不地道。" },
        ],
        choices: [
          { label: "开船，趁雾未散", next: "whampoa-3" },
          { label: "叫多一个帮手", next: "whampoa-3" },
        ],
      },
      {
        id: "whampoa-3",
        act: 3,
        title: "江心的检查船",
        textYue:
          "艇到江心，前面忽然亮起灯，系官府的检查船。番鬼即刻缩低，将怀表塞入你衫袋。",
        textZh:
          "船到江心，前面忽然亮起灯，是官府的检查船。洋人立刻缩低身子，把怀表塞进你衣袋。",
        audioText:
          "艇到江心，前面忽然亮起灯，系官府嘅检查船。番鬼即刻缩低，将怀表塞入你衫袋。",
        glossary: [
          { term: "检查船", meaning: "巡逻检查的官船", note: "旧时关口稽查。" },
        ],
        choices: [
          { label: "照直撑过去", next: "whampoa-4a" },
          { label: "掉头入横涌", next: "whampoa-4b" },
        ],
      },
      {
        id: "whampoa-4a",
        act: 4,
        title: "官差的问话",
        textYue:
          "官差问：“艇上几个人？”你答两个。佢提灯照入艇舱，番鬼用草席冚住自己，只露出鞋尖。",
        textZh:
          "官差问：“船上几个人？”你答两个。他提灯照进船舱，洋人用草席盖住自己，只露出鞋尖。",
        audioText:
          "官差问：艇上几个人？你答两个。佢提灯照入艇舱，番鬼用草席冚住自己，只露出鞋尖。",
        glossary: [
          { term: "艇舱", meaning: "小船里的舱位", note: "小艇中间可藏物。" },
          { term: "草席", meaning: "草编的席子", note: "船上常用。" },
        ],
        choices: [
          { label: "帮佢遮住鞋尖", next: "whampoa-5" },
          { label: "唔敢出声", next: "whampoa-5" },
        ],
      },
      {
        id: "whampoa-4b",
        act: 4,
        title: "横涌的死路",
        textYue:
          "横涌越撑越窄，前面系一道水闸。你心知中计，回头一望，检查船已经跟咗入嚟。",
        textZh:
          "横涌越撑越窄，前面是一道水闸。你知道中计了，回头一看，检查船已经跟了进来。",
        audioText:
          "横涌越撑越窄，前面系一道水闸。你心知中计，回头一望，检查船已经跟咗入嚟。",
        glossary: [
          { term: "横涌", meaning: "支流、小河道", note: "珠三角水网常见。" },
          { term: "水闸", meaning: "控制水流的闸门", note: "河涌常见。" },
        ],
        choices: [
          { label: "弃艇上岸", next: "whampoa-5" },
          { label: "硬闯水闸", next: "whampoa-5" },
        ],
      },
      {
        id: "whampoa-5",
        act: 5,
        title: "番鬼的故事",
        textYue:
          "脱身之后，番鬼讲出真相：相入面嘅女人系佢妻子，铺头被合伙人吞咗。佢今次返来，只系想取回一张契。",
        textZh:
          "脱身之后，洋人说出真相：照片里的女人是他妻子，店铺被合伙人吞了。他这次回来，只是想取回一张契约。",
        audioText:
          "脱身之后，番鬼讲出真相：相入面嘅女人系佢妻子，铺头被合伙人吞咗。佢今次返来，只系想取回一张契。",
        glossary: [
          { term: "契", meaning: "契约、房契", note: "旧时产业凭证。" },
          { term: "吞咗", meaning: "吞掉了", note: "指侵吞财产。" },
        ],
        choices: [
          { label: "信佢，帮到底", next: "whampoa-6" },
          { label: "收钱办事，唔问真假", next: "whampoa-6" },
        ],
      },
      {
        id: "whampoa-6",
        act: 6,
        title: "十三行的灯",
        textYue:
          "天光前，你哋摸到十三行后巷。铺头招牌换咗，但门口石阶仲系旧样。番鬼企喺暗处，手震到开唔到锁。",
        textZh:
          "天亮前，你们摸到十三行后巷。店铺招牌换了，但门口石阶还是旧样。洋人站在暗处，手抖得开不了锁。",
        audioText:
          "天光前，你哋摸到十三行后巷。铺头招牌换咗，但门口石阶仲系旧样。番鬼企喺暗处，手震到开唔到锁。",
        glossary: [
          { term: "后巷", meaning: "后面的小巷", note: "老城商铺常见。" },
        ],
        choices: [
          { label: "帮他开锁", next: "whampoa-e1" },
          { label: "叫佢天光再来", next: "whampoa-e2" },
        ],
      },
      {
        id: "whampoa-e1",
        act: 7,
        title: "结局 · 一张旧契",
        textYue:
          "门开之后，番鬼只取走一张发黄嘅契，其余银钱一分冇动。天光时，佢上船离开，怀表留咗畀你。",
        textZh:
          "门开之后，洋人只取走一张发黄的契约，其余银钱一分没动。天亮时，他上船离开，怀表留给了你。",
        audioText:
          "门开之后，番鬼只取走一张发黄嘅契，其余银钱一分冇动。天光时，佢上船离开，怀表留咗畀你。",
        glossary: [
          { term: "发黄", meaning: "变黄", note: "形容旧纸。" },
        ],
        choices: [],
        ending: true,
        endingText: "海上嚟嘅，唔一定系贼；岸上等嘅，唔一定系好人。",
      },
      {
        id: "whampoa-e2",
        act: 7,
        title: "结局 · 天亮之后",
        textYue:
          "你叫佢天光再来。第二日，铺头已经搬空，番鬼亦冇再出现。多年后，你仍留着那只怀表，表盖里嘅相，笑得好安静。",
        textZh:
          "你叫他天亮再来。第二天，店铺已经搬空，洋人也没有再出现。多年后，你仍留着那只怀表，表盖里的照片，笑得很安静。",
        audioText:
          "你叫佢天光再来。第二日，铺头已经搬空，番鬼亦冇再出现。多年后，你仍留着那只怀表，表盖里嘅相，笑得好安静。",
        glossary: [
          { term: "搬空", meaning: "搬得空空的", note: "粤语常用词。" },
        ],
        choices: [],
        ending: true,
        endingText: "有啲人走咗，先至有人记得佢嚟过。",
      },
    ],
  },
];
