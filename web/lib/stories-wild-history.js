import { cover } from "./image";

export const wildHistoryStories = [
  {
    slug: "lun-wenxu-congee",
    mode: "wild_history",
    modeLabel: "野史模式",
    featured: false,
    title: "状元及第粥",
    subtitle: "伦文叙 · 一碗粥的野史",
    dialect: "粤语 · 佛山南海",
    type: "野史 · 民间人物故事",
    duration: "4 分钟",
    cover: cover("lun-wenxu-congee"),
    quote: "一碗粥，都可以有出头天。",
    intro:
      "你系粥铺老板。每日天未光，都有一个瘦瘦哋嘅后生仔，喺门口闻粥香。",
    scenes: [
      {
        id: "lun-1",
        act: 1,
        title: "门口的后生仔",
        textYue:
          "后生仔叫伦文叙，屋企穷，买唔起粥。你见他眼定定望住锅里的猪肝粉肠。",
        textZh:
          "年轻人叫伦文叙，家里穷，买不起粥。你看见他眼睛直直地盯着锅里的猪肝粉肠。",
        audioText:
          "后生仔叫伦文叙，屋企穷，买唔起粥。你见他眼定定望住锅里的猪肝粉肠。",
        glossary: [
          { term: "眼定定", meaning: "目不转睛", note: "粤语常用词。" },
          { term: "猪肝粉肠", meaning: "猪肝和猪肠", note: "及第粥的常见配料。" },
        ],
        choices: [
          { label: "免费舀一碗", next: "lun-2a" },
          { label: "叫他帮忙洗碗换粥", next: "lun-2b" },
        ],
      },
      {
        id: "lun-2a",
        act: 2,
        title: "一碗粥",
        textYue:
          "伦文叙食完粥，帮你写了个招牌“状元及第粥”。你笑佢：“你估你实中状元咩？”",
        textZh:
          "伦文叙吃完粥，帮你写了个招牌“状元及第粥”。你笑他：“你以为你一定能中状元吗？”",
        audioText:
          "伦文叙食完粥，帮你写了个招牌状元及第粥。你笑佢：你估你实中状元咩？",
        glossary: [
          { term: "及第", meaning: "科举考中", note: "状元及第是科举最高荣誉。" },
          { term: "估", meaning: "以为、猜", note: "粤语常用词。" },
        ],
        choices: [
          { label: "留低招牌", next: "lun-3a" },
          { label: "叫他好好读书", next: "lun-3b" },
        ],
      },
      {
        id: "lun-2b",
        act: 2,
        title: "洗碗换粥",
        textYue:
          "伦文叙一边洗碗，一边背书。你听他背得滚瓜烂熟，心谂：呢个后生仔唔简单。",
        textZh:
          "伦文叙一边洗碗，一边背书。你听他背得滚瓜烂熟，心想：这个年轻人不简单。",
        audioText:
          "伦文叙一边洗碗，一边背书。你听他背得滚瓜烂熟，心谂：呢个后生仔唔简单。",
        glossary: [
          { term: "滚瓜烂熟", meaning: "背得非常熟练", note: "形容读书熟。" },
          { term: "心谂", meaning: "心想", note: "“谂”是想、思考。" },
        ],
        choices: [
          { label: "每日留一碗粥", next: "lun-3a" },
          { label: "介绍他去私塾", next: "lun-3b" },
        ],
      },
      {
        id: "lun-3a",
        act: 3,
        title: "放榜",
        textYue:
          "几年后，伦文叙高中状元。佢返来粥铺，亲笔写低“状元及第粥”五个字。",
        textZh:
          "几年后，伦文叙高中状元。他回到粥铺，亲笔写下“状元及第粥”五个字。",
        audioText:
          "几年后，伦文叙高中状元。佢返来粥铺，亲笔写低状元及第粥五个字。",
        glossary: [
          { term: "放榜", meaning: "公布考试录取名单", note: "科举时代公布名次。" },
        ],
        choices: [],
        ending: true,
        endingText: "一碗粥，都可以有出头天。",
      },
      {
        id: "lun-3b",
        act: 3,
        title: "没有招牌",
        textYue:
          "伦文叙高中之后，返来谢你。你话招牌早就烂咗，佢笑住重新写一张。",
        textZh:
          "伦文叙高中之后，回来谢你。你说招牌早就烂了，他笑着重新写了一张。",
        audioText:
          "伦文叙高中之后，返来谢你。你话招牌早就烂咗，佢笑住重新写一张。",
        glossary: [
          { term: "烂咗", meaning: "坏了、烂了", note: "粤语完成体“咗”。" },
        ],
        choices: [],
        ending: true,
        endingText: "好粥唔怕巷子深，好人唔怕出身低。",
      },
    ],
  },
  {
    slug: "chen-mengji-trick",
    mode: "wild_history",
    modeLabel: "野史模式",
    featured: false,
    title: "陈梦吉的扭计",
    subtitle: "陈梦吉 · 新会扭计师爷的野史",
    dialect: "粤语 · 江门新会",
    type: "野史 · 机智人物故事",
    duration: "4 分钟",
    cover: cover("chen-mengji-trick"),
    quote: "扭计唔系害人，系帮人出头。",
    intro:
      "你系新会一条村的农户。地主加租，你交唔起，听讲城里有个陈梦吉，专门帮人扭计。",
    scenes: [
      {
        id: "chen-1",
        act: 1,
        title: "茶馆找到陈梦吉",
        textYue:
          "陈梦吉坐喺茶馆，摇住把扇，听你讲完，笑住话：“呢条计，要你配合。”",
        textZh:
          "陈梦吉坐在茶馆里，摇着扇子，听你讲完，笑着说：“这条计，要你配合。”",
        audioText:
          "陈梦吉坐喺茶馆，摇住把扇，听你讲完，笑住话：呢条计，要你配合。",
        glossary: [
          { term: "扭计", meaning: "想办法、出计谋", note: "粤语里常指扭转形势的计策。" },
          { term: "摇住把扇", meaning: "摇着扇子", note: "旧时师爷的典型形象。" },
        ],
        choices: [
          { label: "照佢讲", next: "chen-2a" },
          { label: "问清楚会唔会犯法", next: "chen-2b" },
        ],
      },
      {
        id: "chen-2a",
        act: 2,
        title: "装鬼",
        textYue:
          "陈梦吉叫你半夜着白衫，喺地主祖坟前游荡。地主第二日吓到面青。",
        textZh:
          "陈梦吉叫你半夜穿白衣服，在地主祖坟前游荡。地主第二天吓得脸色发青。",
        audioText:
          "陈梦吉叫你半夜着白衫，喺地主祖坟前游荡。地主第二日吓到面青。",
        glossary: [
          { term: "面青", meaning: "脸色发青", note: "形容害怕。" },
          { term: "祖坟", meaning: "家族祖先的坟墓", note: "旧时很受重视。" },
        ],
        choices: [
          { label: "继续装", next: "chen-3a" },
          { label: "心软收手", next: "chen-3b" },
        ],
      },
      {
        id: "chen-2b",
        act: 2,
        title: "假官差",
        textYue:
          "陈梦吉叫你扮官差，话地主多收租，要查账。地主心虚，立刻减租。",
        textZh:
          "陈梦吉叫你扮官差，说地主多收租，要查账。地主心虚，立刻减租。",
        audioText:
          "陈梦吉叫你扮官差，话地主多收租，要查账。地主心虚，立刻减租。",
        glossary: [
          { term: "官差", meaning: "官府的差役", note: "旧时负责催粮、办案。" },
          { term: "心虚", meaning: "心里有鬼", note: "形容做了亏心事。" },
        ],
        choices: [
          { label: "拿住假令牌", next: "chen-3a" },
          { label: "怕被识穿", next: "chen-3b" },
        ],
      },
      {
        id: "chen-3a",
        act: 3,
        title: "地主认输",
        textYue:
          "地主减了租，还赔了米。陈梦吉话：“野史唔一定真，但民间的气，系真嘅。”",
        textZh:
          "地主减了租，还赔了米。陈梦吉说：“野史不一定真，但民间的气，是真的。”",
        audioText:
          "地主减了租，还赔了米。陈梦吉话：野史唔一定真，但民间的气，系真嘅。",
        glossary: [
          { term: "赔米", meaning: "赔偿大米", note: "旧时以粮食作赔偿。" },
        ],
        choices: [],
        ending: true,
        endingText: "野史唔一定真，但民间的气，是真的。",
      },
      {
        id: "chen-3b",
        act: 3,
        title: "见好就收",
        textYue:
          "你收手，陈梦吉都冇怪你。地主后来自己减了租，话系“积阴德”。",
        textZh:
          "你收手，陈梦吉也没有怪你。地主后来自己减了租，说是“积阴德”。",
        audioText:
          "你收手，陈梦吉都冇怪你。地主后来自己减了租，话系积阴德。",
        glossary: [
          { term: "积阴德", meaning: "暗中做好事积德", note: "旧时劝人行善的说法。" },
        ],
        choices: [],
        ending: true,
        endingText: "有时唔使扭计，时间都会帮你。",
      },
    ],
  },
  {
    slug: "zhuji-xiang-south",
    mode: "wild_history",
    modeLabel: "野史模式",
    featured: false,
    title: "珠玑巷的夜",
    subtitle: "珠玑巷 · 一场南迁的野史",
    dialect: "粤语 · 韶关南雄",
    type: "野史 · 广府根脉故事",
    duration: "5 分钟",
    cover: cover("zhuji-xiang-south"),
    quote: "走，唔系因为怕；系因为要活落去。",
    intro:
      "南宋末年，珠玑巷传出消息：官兵要来血洗。你系巷里一个后生仔，今晚要决定走唔走。",
    scenes: [
      {
        id: "zhuji-1",
        act: 1,
        title: "巷口的火把",
        textYue:
          "半夜，巷口有人举火把。贡生罗贵召集众人，话要连夜伐竹结筏，沿浈江南下。",
        textZh:
          "半夜，巷口有人举着火把。贡生罗贵召集众人，说要在连夜砍竹结筏，沿着浈江南下。",
        audioText:
          "半夜，巷口有人举火把。贡生罗贵召集众人，话要连夜伐竹结筏，沿浈江南下。",
        glossary: [
          { term: "贡生", meaning: "科举时代府、州、县学的生员", note: "罗贵是珠玑巷南迁传说中的领头人。" },
          { term: "结筏", meaning: "把竹子扎成筏子", note: "水路迁移的工具。" },
        ],
        choices: [
          { label: "跟罗贵走", next: "zhuji-2a" },
          { label: "留低睇情况", next: "zhuji-2b" },
        ],
      },
      {
        id: "zhuji-2a",
        act: 2,
        title: "竹筏下水",
        textYue:
          "你同33姓97户人家一起，把竹筏推落江。胡妃都喺队伍里，无人知前路系点。",
        textZh:
          "你和33姓97户人家一起，把竹筏推下江。胡妃也在队伍里，没有人知道前路怎样。",
        audioText:
          "你同33姓97户人家一起，把竹筏推落江。胡妃都喺队伍里，无人知前路系点。",
        glossary: [
          { term: "胡妃", meaning: "传说中与珠玑巷南迁有关的人物", note: "不同版本说法不一。" },
          { term: "前路", meaning: "前面的路、未来", note: "这里指迁移的前途。" },
        ],
        choices: [
          { label: "帮人搬行李", next: "zhuji-3a" },
          { label: "回头望最后一眼", next: "zhuji-3b" },
        ],
      },
      {
        id: "zhuji-2b",
        act: 2,
        title: "空巷",
        textYue:
          "你留低，第二日巷里静到得人惊。邻居一夜之间走晒，只剩低几只鸡。",
        textZh:
          "你留下来，第二天巷里静得让人害怕。邻居一夜之间全走了，只剩下几只鸡。",
        audioText:
          "你留低，第二日巷里静到得人惊。邻居一夜之间走晒，只剩低几只鸡。",
        glossary: [
          { term: "得人惊", meaning: "让人害怕", note: "粤语常用表达。" },
          { term: "走晒", meaning: "全走了", note: "“晒”表示全部。" },
        ],
        choices: [
          { label: "追上去", next: "zhuji-2a" },
          { label: "躲入祠堂", next: "zhuji-3b" },
        ],
      },
      {
        id: "zhuji-3a",
        act: 3,
        title: "珠江三角洲",
        textYue:
          "竹筏顺流而下，你们来到珠江三角洲。后人把珠玑巷叫作“七百年前桑梓乡”。",
        textZh:
          "竹筏顺流而下，你们来到珠江三角洲。后人把珠玑巷叫作“七百年前桑梓乡”。",
        audioText:
          "竹筏顺流而下，你们来到珠江三角洲。后人把珠玑巷叫作七百年前桑梓乡。",
        glossary: [
          { term: "桑梓", meaning: "故乡", note: "古人常在宅旁种桑树、梓树，后用来代指故乡。" },
        ],
        choices: [],
        ending: true,
        endingText: "走，唔系因为怕；系因为要活落去。",
      },
      {
        id: "zhuji-3b",
        act: 3,
        title: "留下的名字",
        textYue:
          "你留低，把巷里的事记在一本册子上。多年后，南迁的人回来寻根，册子成了证据。",
        textZh:
          "你留下来，把巷里的事记在一本册子上。多年后，南迁的人回来寻根，册子成了证据。",
        audioText:
          "你留低，把巷里的事记在一本册子上。多年后，南迁的人回来寻根，册子成了证据。",
        glossary: [
          { term: "寻根", meaning: "寻找家族来源", note: "珠玑巷是许多广府家族的根。" },
        ],
        choices: [],
        ending: true,
        endingText: "有人走，有人留；都是为了让故事有人记得。",
      },
    ],
  },
];
