import { cover } from "./image.js";

export const longStories = [
  {
    slug: "chen-clan-frieze",
    mode: "heritage",
    modeLabel: "正经模式",
    featured: false,
    actCount: 6,
    title: "陈家祠的灰塑",
    subtitle: "陈家祠 · 一个学徒的夏天",
    dialect: "粤语 · 广州荔湾",
    type: "正经 · 手艺故事",
    duration: "7 分钟",
    cover: cover("chen-clan-frieze"),
    quote: "灰塑会旧，手艺唔怕旧。",
    intro:
      "你系灰塑师傅嘅学徒。陈家祠要修补屋脊，师傅临时病咗，只剩你同半桶灰。",
    scenes: [
      {
        id: "chen-1",
        act: 1,
        title: "屋脊上的缺口",
        textYue:
          "陈家祠嘅瓦脊裂咗一道口，雨水渗入灰塑。师傅咳住话：“你上去，照我教嘅做。”你孭住灰桶，脚都软。",
        textZh:
          "陈家祠的瓦脊裂了一道口，雨水渗进灰塑。师傅咳嗽着说：“你上去，按我教的做。”你背着灰桶，腿都软了。",
        audioText:
          "陈家祠嘅瓦脊裂咗一道口，雨水渗入灰塑。师傅咳住话：你上去，照我教嘅做。你孭住灰桶，脚都软。",
        glossary: [
          { term: "灰塑", meaning: "用灰料在屋脊上塑形的岭南工艺", note: "陈家祠灰塑是国家级非遗。" },
          { term: "孭", meaning: "背、扛", note: "粤语常用词。" },
        ],
        choices: [
          { label: "照师傅讲，自己上", next: "chen-2a" },
          { label: "先去揾师叔帮忙", next: "chen-2b" },
        ],
      },
      {
        id: "chen-2a",
        act: 2,
        title: "第一刀",
        textYue:
          "你爬上屋脊，风大到企唔稳。灰匙一落，旧灰碎开，露出里面一条铜丝。师傅讲过，铜丝系骨架，唔可以抽走。",
        textZh:
          "你爬上屋脊，风大得站不稳。灰匙一落，旧灰碎开，露出里面一条铜丝。师傅说过，铜丝是骨架，不能抽走。",
        audioText:
          "你爬上屋脊，风大到企唔稳。灰匙一落，旧灰碎开，露出里面一条铜丝。师傅讲过，铜丝系骨架，唔可以抽走。",
        glossary: [
          { term: "灰匙", meaning: "抹灰用的小铲", note: "灰塑师傅的基本工具。" },
          { term: "企唔稳", meaning: "站不稳", note: "“企”是站。" },
        ],
        choices: [
          { label: "保住铜丝，慢慢补", next: "chen-3" },
          { label: "抽走烂铜丝，重做", next: "chen-3" },
        ],
      },
      {
        id: "chen-2b",
        act: 2,
        title: "师叔的条件",
        textYue:
          "师叔肯帮手，但要你签一张纸：修好之后，功劳归他。你揸住笔，手停喺半空。",
        textZh:
          "师叔肯帮忙，但要你签一张纸：修好之后，功劳归他。你握着笔，手停在半空。",
        audioText:
          "师叔肯帮手，但要你签一张纸：修好之后，功劳归他。你揸住笔，手停喺半空。",
        glossary: [
          { term: "揸住", meaning: "握着", note: "“揸”是握、拿。" },
          { term: "功劳", meaning: "功绩、贡献", note: "手艺行当里很看重署名。" },
        ],
        choices: [
          { label: "签，先修好再讲", next: "chen-3" },
          { label: "唔签，自己顶硬上", next: "chen-3" },
        ],
      },
      {
        id: "chen-3",
        act: 3,
        title: "雨来了",
        textYue:
          "做到一半，天落起雨。未干嘅灰最怕水，一冲就散。你望住屋脊，又望住楼下收唔切嘅游客。",
        textZh:
          "做到一半，天下起雨。没干的灰最怕水，一冲就散。你看着屋脊，又看着楼下来不及避雨的游客。",
        audioText:
          "做到一半，天落起雨。未干嘅灰最怕水，一冲就散。你望住屋脊，又望住楼下收唔切嘅游客。",
        glossary: [
          { term: "收唔切", meaning: "来不及收", note: "“切”表示来得及。" },
          { term: "灰", meaning: "灰塑用的灰料", note: "由石灰、纸筋、稻草等调制。" },
        ],
        choices: [
          { label: "用雨布冚住，等雨停", next: "chen-4a" },
          { label: "冒雨赶工，抢时间", next: "chen-4b" },
        ],
      },
      {
        id: "chen-4a",
        act: 4,
        title: "雨后的颜色",
        textYue:
          "雨停之后，灰面起咗一层白霜。师傅话过，呢个时候要批一层薄灰，颜色先会匀。你手一抖，批厚咗。",
        textZh:
          "雨停之后，灰面起了一层白霜。师傅说过，这时要批一层薄灰，颜色才会匀。你手一抖，批厚了。",
        audioText:
          "雨停之后，灰面起咗一层白霜。师傅话过，呢个时候要批一层薄灰，颜色先会匀。你手一抖，批厚咗。",
        glossary: [
          { term: "冚住", meaning: "盖住", note: "粤语常用词。" },
          { term: "批灰", meaning: "抹灰", note: "灰塑的基层工序。" },
        ],
        choices: [
          { label: "铲走重批", next: "chen-5" },
          { label: "由得佢，远睇唔觉", next: "chen-5" },
        ],
      },
      {
        id: "chen-4b",
        act: 4,
        title: "抢出来的裂纹",
        textYue:
          "你冒雨赶工，灰未干就上色。第二日，颜色裂成一片片，好似鱼鳞。游客抬头，指住屋脊笑。",
        textZh:
          "你冒雨赶工，灰没干就上色。第二天，颜色裂成一片片，像鱼鳞。游客抬头，指着屋脊笑。",
        audioText:
          "你冒雨赶工，灰未干就上色。第二日，颜色裂成一片片，好似鱼鳞。游客抬头，指住屋脊笑。",
        glossary: [
          { term: "由得佢", meaning: "随它去", note: "粤语口语。" },
          { term: "鱼鳞", meaning: "鱼的鳞片", note: "这里形容裂纹。" },
        ],
        choices: [
          { label: "当众认错，铲掉重做", next: "chen-5" },
          { label: "趁无人，补一层色", next: "chen-5" },
        ],
      },
      {
        id: "chen-5",
        act: 5,
        title: "师傅来看",
        textYue:
          "收工前，师傅由医院返来。佢冇闹你，只用手指喺灰面轻轻扫过，问：“你觉得，边度仲未够？”",
        textZh:
          "收工前，师傅从医院回来。他没有骂你，只用手指在灰面轻轻扫过，问：“你觉得，哪里还不够？”",
        audioText:
          "收工前，师傅由医院返来。佢冇闹你，只用手指喺灰面轻轻扫过，问：你觉得，边度仲未够？",
        glossary: [
          { term: "闹", meaning: "骂", note: "粤语“闹”是责骂。" },
          { term: "边度", meaning: "哪里", note: "粤语常用疑问词。" },
        ],
        choices: [
          { label: "话俾师傅知，铜丝保住了", next: "chen-e1" },
          { label: "话俾师傅知，颜色未够匀", next: "chen-e2" },
        ],
      },
      {
        id: "chen-e1",
        act: 6,
        title: "结局 · 屋脊上的名字",
        textYue:
          "师傅点头：“骨架在，灰先企得稳。”几年后，你独立修陈家祠另一条屋脊。落款时，你写低师傅个名，再写自己。",
        textZh:
          "师傅点头：“骨架在，灰才站得稳。”几年后，你独立修陈家祠另一条屋脊。落款时，你写下师傅的名字，再写自己。",
        audioText:
          "师傅点头：骨架在，灰先企得稳。几年后，你独立修陈家祠另一条屋脊。落款时，你写低师傅个名，再写自己。",
        glossary: [
          { term: "落款", meaning: "题写名字", note: "手艺作品常留作者名。" },
        ],
        choices: [],
        ending: true,
        endingText: "灰塑会旧，手艺唔怕旧。",
      },
      {
        id: "chen-e2",
        act: 6,
        title: "结局 · 再批一层",
        textYue:
          "师傅笑咗：“肯承认未够，先学得识。”你连夜铲走厚灰，重新批薄。天亮时，屋脊颜色匀到好似一块旧玉。",
        textZh:
          "师傅笑了：“肯承认不够，才学得会。”你连夜铲走厚灰，重新批薄。天亮时，屋脊颜色匀得像一块旧玉。",
        audioText:
          "师傅笑咗：肯承认未够，先学得识。你连夜铲走厚灰，重新批薄。天亮时，屋脊颜色匀到好似一块旧玉。",
        glossary: [
          { term: "学得识", meaning: "学得会", note: "“识”表示会、能够。" },
        ],
        choices: [],
        ending: true,
        endingText: "慢工唔一定出细货，但肯改一定好过唔改。",
      },
    ],
  },
  {
    slug: "guangxiao-bodhi",
    mode: "heritage",
    modeLabel: "正经模式",
    featured: false,
    actCount: 7,
    title: "光孝寺的菩提",
    subtitle: "光孝寺 · 一棵树的千年",
    dialect: "粤语 · 广州越秀",
    type: "正经 · 古迹故事",
    duration: "8 分钟",
    cover: cover("guangxiao-bodhi"),
    quote: "树冇走，系人嚟嚟去去。",
    intro:
      "你系光孝寺嘅小沙弥，每日扫菩提叶。今日，有个外乡人坐喺树下，一直唔肯走。",
    scenes: [
      {
        id: "guang-1",
        act: 1,
        title: "扫不完的叶",
        textYue:
          "天未光，你拎住竹扫帚扫菩提叶。叶子扫完又落，好似扫极都扫唔完。树下坐住个外乡人，衫湿透。",
        textZh:
          "天没亮，你拿着竹扫帚扫菩提叶。叶子扫完又落，好像怎么扫都扫不完。树下坐着一个外乡人，衣服湿透。",
        audioText:
          "天未光，你拎住竹扫帚扫菩提叶。叶子扫完又落，好似扫极都扫唔完。树下坐住个外乡人，衫湿透。",
        glossary: [
          { term: "沙弥", meaning: "年轻的出家僧人", note: "光孝寺是广州著名古刹。" },
          { term: "菩提叶", meaning: "菩提树的叶子", note: "菩提树在岭南寺院常见。" },
        ],
        choices: [
          { label: "上前问佢要唔要帮忙", next: "guang-2a" },
          { label: "唔打扰，继续扫地", next: "guang-2b" },
        ],
      },
      {
        id: "guang-2a",
        act: 2,
        title: "外乡人的问题",
        textYue:
          "外乡人问：“呢棵树，真系传落嚟嗰棵？”你答唔出。师父讲过，菩提树枯过、又生过，真假无人讲得清。",
        textZh:
          "外乡人问：“这棵树，真是传下来的那棵吗？”你答不上来。师父说过，菩提树枯过、又生过，真假没人说得清。",
        audioText:
          "外乡人问：呢棵树，真系传落嚟嗰棵？你答唔出。师父讲过，菩提树枯过、又生过，真假无人讲得清。",
        glossary: [
          { term: "传落嚟", meaning: "传下来", note: "“落嚟”表示下来。" },
          { term: "讲得清", meaning: "说得清", note: "粤语常用表达。" },
        ],
        choices: [
          { label: "带佢去睇碑文", next: "guang-3" },
          { label: "带佢去问师父", next: "guang-3" },
        ],
      },
      {
        id: "guang-2b",
        act: 2,
        title: "叶子落在肩上",
        textYue:
          "你继续扫，一片叶落喺外乡人肩上。佢冇拍走，只系合埋眼。你忽然觉得，佢唔系游客，系喺度等乜嘢。",
        textZh:
          "你继续扫，一片叶子落在外乡人肩上。他没拍走，只是闭上眼睛。你忽然觉得，他不是游客，是在这里等什么。",
        audioText:
          "你继续扫，一片叶落喺外乡人肩上。佢冇拍走，只系合埋眼。你忽然觉得，佢唔系游客，系喺度等乜嘢。",
        glossary: [
          { term: "合埋眼", meaning: "闭上眼睛", note: "“埋”表示合拢。" },
          { term: "乜嘢", meaning: "什么", note: "粤语常用疑问词。" },
        ],
        choices: [
          { label: "静静哋递杯热茶", next: "guang-3" },
          { label: "去揾师父过来", next: "guang-3" },
        ],
      },
      {
        id: "guang-3",
        act: 3,
        title: "风幡之争",
        textYue:
          "师父指住殿前嘅幡旗：“你睇，系风动，定系幡动？”你未答，外乡人已经接上：“系仁者心动。”",
        textZh:
          "师父指着殿前的幡旗：“你看，是风动，还是幡动？”你还没答，外乡人已经接上：“是仁者心动。”",
        audioText:
          "师父指住殿前嘅幡旗：你睇，系风动，定系幡动？你未答，外乡人已经接上：系仁者心动。",
        glossary: [
          { term: "幡旗", meaning: "寺院里的旗帜", note: "风幡之议是禅宗著名典故。" },
          { term: "仁者", meaning: "对人的尊称", note: "此处指有修行的人。" },
        ],
        choices: [
          { label: "问佢点解咁讲", next: "guang-4" },
          { label: "低头继续扫地", next: "guang-4" },
        ],
      },
      {
        id: "guang-4",
        act: 4,
        title: "树下的旧照片",
        textYue:
          "外乡人由袋里摸出一张旧相，相入面系佢阿公，企喺同一棵树下。佢话，阿公走之前，一直想返来。",
        textZh:
          "外乡人从袋里摸出一张旧照片，照片里是他外公，站在同一棵树下。他说，外公走之前，一直想回来。",
        audioText:
          "外乡人由袋里摸出一张旧相，相入面系佢阿公，企喺同一棵树下。佢话，阿公走之前，一直想返来。",
        glossary: [
          { term: "摸出", meaning: "掏出", note: "粤语口语。" },
          { term: "走之前", meaning: "去世之前", note: "委婉说法。" },
        ],
        choices: [
          { label: "陪佢喺树下坐一阵", next: "guang-5a" },
          { label: "带佢去客堂登记", next: "guang-5b" },
        ],
      },
      {
        id: "guang-5a",
        act: 5,
        title: "一阵风",
        textYue:
          "你们坐喺树下，无人讲嘢。风一吹，叶子沙沙响。外乡人忽然笑：“好似阿公喺度咳。”",
        textZh:
          "你们坐在树下，没人说话。风一吹，叶子沙沙响。外乡人忽然笑：“好像外公在这里咳嗽。”",
        audioText:
          "你们坐喺树下，无人讲嘢。风一吹，叶子沙沙响。外乡人忽然笑：好似阿公喺度咳。",
        glossary: [
          { term: "沙沙响", meaning: "沙沙作响", note: "形容树叶摩擦的声音。" },
        ],
        choices: [
          { label: "话俾佢知，树会再发新叶", next: "guang-6" },
          { label: "静静哋陪佢坐到日落", next: "guang-6" },
        ],
      },
      {
        id: "guang-5b",
        act: 5,
        title: "客堂的名册",
        textYue:
          "客堂本册子记满名字，有啲已经褪色。外乡人翻到一页，指住一个名：“呢个系佢。”你见到，名下面画咗一片叶。",
        textZh:
          "客堂的册子记满名字，有些已经褪色。外乡人翻到一页，指着一个名字：“这个是他。”你看见，名字下面画了一片叶子。",
        audioText:
          "客堂本册子记满名字，有啲已经褪色。外乡人翻到一页，指住一个名：呢个系佢。你见到，名下面画咗一片叶。",
        glossary: [
          { term: "褪色", meaning: "颜色变淡", note: "旧册子常见。" },
          { term: "画咗", meaning: "画了", note: "“咗”表示完成。" },
        ],
        choices: [
          { label: "帮他抄低呢一页", next: "guang-6" },
          { label: "由得佢自己睇", next: "guang-6" },
        ],
      },
      {
        id: "guang-6",
        act: 6,
        title: "临走前",
        textYue:
          "外乡人要赶车。佢喺树下执起一片叶，夹入相簿。你问佢明年会唔会再来，佢话：“睇树啦。”",
        textZh:
          "外乡人要赶车。他在树下捡起一片叶子，夹进相簿。你问他明年会不会再来，他说：“看树吧。”",
        audioText:
          "外乡人要赶车。佢喺树下执起一片叶，夹入相簿。你问佢明年会唔会再来，佢话：睇树啦。",
        glossary: [
          { term: "执起", meaning: "捡起", note: "粤语“执”是拾取。" },
          { term: "睇树啦", meaning: "看树吧", note: "意思是随缘。" },
        ],
        choices: [
          { label: "送佢到山门", next: "guang-e1" },
          { label: "返去继续扫叶", next: "guang-e2" },
        ],
      },
      {
        id: "guang-e1",
        act: 7,
        title: "结局 · 山门回头",
        textYue:
          "你送到山门，外乡人回头望咗一眼。那一刻你明，菩提树唔系一件文物，系一条线，牵住走远嘅人。",
        textZh:
          "你送到山门，外乡人回头看了一眼。那一刻你明白，菩提树不是一件文物，而是一条线，牵着走远的人。",
        audioText:
          "你送到山门，外乡人回头望咗一眼。那一刻你明，菩提树唔系一件文物，系一条线，牵住走远嘅人。",
        glossary: [
          { term: "山门", meaning: "寺院正门", note: "古寺多在山上，故称山门。" },
        ],
        choices: [],
        ending: true,
        endingText: "树冇走，系人嚟嚟去去。",
      },
      {
        id: "guang-e2",
        act: 7,
        title: "结局 · 新叶",
        textYue:
          "你返去扫地，发现树顶发咗新叶。师父话：“旧叶落，新叶出，寺院先有生气。”你扫得更慢，也更静。",
        textZh:
          "你回去扫地，发现树顶长出新叶。师父说：“旧叶落，新叶出，寺院才有生气。”你扫得更慢，也更静。",
        audioText:
          "你返去扫地，发现树顶发咗新叶。师父话：旧叶落，新叶出，寺院先有生气。你扫得更慢，也更静。",
        glossary: [
          { term: "发咗新叶", meaning: "长出新叶", note: "“发”指生长。" },
        ],
        choices: [],
        ending: true,
        endingText: "扫走嘅系叶，扫唔走嘅系念。",
      },
    ],
  },
  {
    slug: "litchi-bay-ghost",
    mode: "ghost",
    modeLabel: "鬼故事模式",
    featured: false,
    actCount: 7,
    title: "荔枝湾的水鬼",
    subtitle: "荔枝湾 · 撑艇人最后一班",
    dialect: "粤语 · 广州荔湾",
    type: "鬼故事 · 民间传说改编",
    duration: "8 分钟",
    cover: cover("litchi-bay-ghost"),
    quote: "水底有人叫你都唔好应。",
    intro:
      "你系荔枝湾嘅撑艇仔。收船前最后一转，河面起雾，岸边有个红衫女人向你招手。",
    scenes: [
      {
        id: "litchi-1",
        act: 1,
        title: "最后一班",
        textYue:
          "已经收更，你撑艇返涌口。雾贴住水面，两岸荔枝树黑黢黢。岸边有个红衫女人，抬手，一下，又一下。",
        textZh:
          "已经收更，你撑艇回涌口。雾贴着水面，两岸荔枝树黑黢黢。岸边有个红衣女人，抬手，一下，又一下。",
        audioText:
          "已经收更，你撑艇返涌口。雾贴住水面，两岸荔枝树黑黢黢。岸边有个红衫女人，抬手，一下，又一下。",
        glossary: [
          { term: "撑艇", meaning: "划船", note: "荔枝湾旧时水网密布，以艇代步。" },
          { term: "涌口", meaning: "河涌的出入口", note: "“涌”在粤语里读 chung。" },
        ],
        choices: [
          { label: "撑过去接佢", next: "litchi-2a" },
          { label: "当睇唔到，继续走", next: "litchi-2b" },
        ],
      },
      {
        id: "litchi-2a",
        act: 2,
        title: "船头的红影",
        textYue:
          "女人上艇，冇讲去处，只讲“向前”。你撑咗一阵，发觉船头轻得离谱，好似冇载人。",
        textZh:
          "女人上艇，没说去哪里，只说“向前”。你撑了一阵，发觉船头轻得离谱，好像没载人。",
        audioText:
          "女人上艇，冇讲去处，只讲向前。你撑咗一阵，发觉船头轻得离谱，好似冇载人。",
        glossary: [
          { term: "去处", meaning: "目的地", note: "书面词，粤语口语也说“去边”。" },
          { term: "离谱", meaning: "不合常理", note: "粤语常用词。" },
        ],
        choices: [
          { label: "低头睇水面", next: "litchi-3" },
          { label: "唔敢望，继续撑", next: "litchi-3" },
        ],
      },
      {
        id: "litchi-2b",
        act: 2,
        title: "身后的水声",
        textYue:
          "你撑走十几丈，身后传来“扑通”一声，好似有人落水。你回头，红衫女人已经企喺你艇尾，头发滴紧水。",
        textZh:
          "你撑出十几丈，身后传来“扑通”一声，好像有人落水。你回头，红衣女人已经站在你船尾，头发滴着水。",
        audioText:
          "你撑走十几丈，身后传来扑通一声，好似有人落水。你回头，红衫女人已经企喺你艇尾，头发滴紧水。",
        glossary: [
          { term: "丈", meaning: "长度单位", note: "旧时量河道常用。" },
          { term: "滴紧水", meaning: "滴着水", note: "“紧”表示正在进行。" },
        ],
        choices: [
          { label: "问佢系边个", next: "litchi-3" },
          { label: "快手撑返岸", next: "litchi-3" },
        ],
      },
      {
        id: "litchi-3",
        act: 3,
        title: "水底的灯",
        textYue:
          "河中间忽然透出一点光，好似水底有盏灯。女人开口：“我个仔，喺下面等我。”你揸桨嘅手出汗。",
        textZh:
          "河中间忽然透出一点光，好像水底有盏灯。女人开口：“我儿子，在下面等我。”你握桨的手出汗。",
        audioText:
          "河中间忽然透出一点光，好似水底有盏灯。女人开口：我个仔，喺下面等我。你揸桨嘅手出汗。",
        glossary: [
          { term: "揸桨", meaning: "握桨", note: "“揸”是握。" },
          { term: "喺下面", meaning: "在下面", note: "这里指水底。" },
        ],
        choices: [
          { label: "照佢讲，撑向光", next: "litchi-4a" },
          { label: "掉头，唔理佢", next: "litchi-4b" },
        ],
      },
      {
        id: "litchi-4a",
        act: 4,
        title: "光里的手",
        textYue:
          "你撑近，光里伸出一只细路仔嘅手。女人喊：“唔好拉！佢唔系我个仔！”你愣住，桨停喺水面试。",
        textZh:
          "你撑近，光里伸出一只小孩的手。女人喊：“别拉！他不是我儿子！”你愣住，桨停在水面试。",
        audioText:
          "你撑近，光里伸出一只细路仔嘅手。女人喊：唔好拉！佢唔系我个仔！你愣住，桨停喺水面试。",
        glossary: [
          { term: "细路仔", meaning: "小孩子", note: "粤语常用词。" },
          { term: "愣住", meaning: "发呆、停住", note: "粤语口语。" },
        ],
        choices: [
          { label: "缩手，往后退", next: "litchi-5" },
          { label: "问女人，咁系边个", next: "litchi-5" },
        ],
      },
      {
        id: "litchi-4b",
        act: 4,
        title: "桨断了",
        textYue:
          "你一掉头，桨“啪”一声断成两截。艇仔打横，随水漂向那点光。女人坐喺船头，唔再出声。",
        textZh:
          "你一掉头，桨“啪”一声断成两截。小船横过来，随水漂向那点光。女人坐在船头，不再出声。",
        audioText:
          "你一掉头，桨啪一声断成两截。艇仔打横，随水漂向那点光。女人坐喺船头，唔再出声。",
        glossary: [
          { term: "打横", meaning: "横过来", note: "形容船身横在河道。" },
        ],
        choices: [
          { label: "用手扒水", next: "litchi-5" },
          { label: "大声喊救命", next: "litchi-5" },
        ],
      },
      {
        id: "litchi-5",
        act: 5,
        title: "雾里的第二条艇",
        textYue:
          "雾里撑出另一条艇，艇上系个老伯。佢望都唔望女人，只同你讲：“呢条涌，每年今日都要载一次。”",
        textZh:
          "雾里撑出另一条艇，艇上是个老伯。他看都不看女人，只跟你说：“这条涌，每年今天都要载一次。”",
        audioText:
          "雾里撑出另一条艇，艇上系个老伯。佢望都唔望女人，只同你讲：呢条涌，每年今日都要载一次。",
        glossary: [
          { term: "老伯", meaning: "老爷爷", note: "粤语称呼。" },
          { term: "每年今日", meaning: "每年这一天", note: "暗示旧事。" },
        ],
        choices: [
          { label: "问老伯，载去边", next: "litchi-6" },
          { label: "跟住老伯条艇", next: "litchi-6" },
        ],
      },
      {
        id: "litchi-6",
        act: 6,
        title: "岸上的名字",
        textYue:
          "两条艇靠岸，女人落艇，行到一棵荔枝树下就唔见咗。树下有块旧木牌，写着几个褪色嘅名，其中一个，系你阿爷。",
        textZh:
          "两条船靠岸，女人下船，走到一棵荔枝树下就不见了。树下有块旧木牌，写着几个褪色的名字，其中一个，是你爷爷。",
        audioText:
          "两条艇靠岸，女人落艇，行到一棵荔枝树下就唔见咗。树下有块旧木牌，写着几个褪色嘅名，其中一个，系你阿爷。",
        glossary: [
          { term: "落艇", meaning: "下船", note: "“落”表示下。" },
          { term: "阿爷", meaning: "爷爷", note: "粤语称呼。" },
        ],
        choices: [
          { label: "摸一摸木牌", next: "litchi-e1" },
          { label: "撑艇返屋企，唔再提", next: "litchi-e2" },
        ],
      },
      {
        id: "litchi-e1",
        act: 7,
        title: "结局 · 一年的最后",
        textYue:
          "你摸到木牌背面刻住一行细字：“撑艇人，渡人亦渡己。”第二日，你把艇洗得干干净净，继续开船。",
        textZh:
          "你摸到木牌背面刻着一行小字：“撑船人，渡人亦渡己。”第二天，你把船洗得干干净净，继续开船。",
        audioText:
          "你摸到木牌背面刻住一行细字：撑艇人，渡人亦渡己。第二日，你把艇洗得干干净净，继续开船。",
        glossary: [
          { term: "渡", meaning: "摆渡、渡过", note: "一字双关。" },
        ],
        choices: [],
        ending: true,
        endingText: "水底有人叫你都唔好应，除非你知自己载紧乜。",
      },
      {
        id: "litchi-e2",
        act: 7,
        title: "结局 · 不再走夜船",
        textYue:
          "你从此唔开夜船。有人笑你迷信，你只系笑笑。每年今日，你都会喺岸边点一支香，唔为别的，为记得。",
        textZh:
          "你从此不开夜船。有人笑你迷信，你只是笑笑。每年今天，你都会在岸边点一支香，不为别的，只为记得。",
        audioText:
          "你从此唔开夜船。有人笑你迷信，你只系笑笑。每年今日，你都会喺岸边点一支香，唔为别的，为记得。",
        glossary: [
          { term: "点香", meaning: "上香", note: "民间纪念方式。" },
        ],
        choices: [],
        ending: true,
        endingText: "有啲水声，唔系叫你回头，系叫你记住。",
      },
    ],
  },
  {
    slug: "thirteen-factories-silver",
    mode: "wild_history",
    modeLabel: "野史模式",
    featured: false,
    actCount: 6,
    title: "十三行的银箱",
    subtitle: "十三行 · 一只银箱的野史",
    dialect: "粤语 · 广州荔湾",
    type: "野史 · 商埠传说",
    duration: "7 分钟",
    cover: cover("thirteen-factories-silver"),
    quote: "银会蚀，名声唔会。",
    intro:
      "你系十三行商馆嘅伙计。今晚要押一只银箱落船，掌柜话：唔好问箱入面系乜。",
    scenes: [
      {
        id: "silver-1",
        act: 1,
        title: "掌柜的银箱",
        textYue:
          "收市之后，掌柜叫你入账房。台面放住一只包铁皮嘅木箱，锁头新净。佢话：“今晚只许你一个人押。”",
        textZh:
          "收市之后，掌柜叫你进账房。桌上放着一只包铁皮的木箱，锁头崭新。他说：“今晚只许你一个人押。”",
        audioText:
          "收市之后，掌柜叫你入账房。台面放住一只包铁皮嘅木箱，锁头新净。佢话：今晚只许你一个人押。",
        glossary: [
          { term: "十三行", meaning: "清代广州经营对外贸易的商行", note: "旧址在今广州荔湾。" },
          { term: "新净", meaning: "崭新干净", note: "粤语常用词。" },
        ],
        choices: [
          { label: "照吩咐，唔多问", next: "silver-2a" },
          { label: "问清楚箱入面系乜", next: "silver-2b" },
        ],
      },
      {
        id: "silver-2a",
        act: 2,
        title: "码头上的眼睛",
        textYue:
          "你孭起银箱，行过商馆长廊。廊柱后面，有个人一直跟住你。你加快脚步，后面嘅脚步都加快。",
        textZh:
          "你背起银箱，走过商馆长廊。廊柱后面，有个人一直跟着你。你加快脚步，后面的脚步也加快。",
        audioText:
          "你孭起银箱，行过商馆长廊。廊柱后面，有个人一直跟住你。你加快脚步，后面嘅脚步都加快。",
        glossary: [
          { term: "商馆", meaning: "外商在广州的办事机构", note: "十三行时期集中设在珠江边。" },
          { term: "跟住", meaning: "跟着", note: "粤语常用词。" },
        ],
        choices: [
          { label: "拐入小巷甩开佢", next: "silver-3" },
          { label: "停低，转身问佢", next: "silver-3" },
        ],
      },
      {
        id: "silver-2b",
        act: 2,
        title: "不该知的事",
        textYue:
          "掌柜盯咗你一阵，压低声音：“入面唔系银，系一叠账。”你心一沉，知道呢只箱，比银重。",
        textZh:
          "掌柜盯了你一阵，压低声音：“里面不是银，是一叠账。”你心里一沉，知道这只箱子，比银子更重。",
        audioText:
          "掌柜盯咗你一阵，压低声音：入面唔系银，系一叠账。你心一沉，知道呢只箱，比银重。",
        glossary: [
          { term: "账", meaning: "账目", note: "商行最敏感的东西。" },
          { term: "心一沉", meaning: "心里一沉", note: "形容不安。" },
        ],
        choices: [
          { label: "应承，照押", next: "silver-3" },
          { label: "推辞，叫掌柜另找人", next: "silver-3" },
        ],
      },
      {
        id: "silver-3",
        act: 3,
        title: "珠江夜雾",
        textYue:
          "码头起雾，江水拍住石阶。接应嘅艇仔未到，箱角忽然渗出一滴水，唔似水，黏手。你闻一闻，有咸味。",
        textZh:
          "码头起雾，江水拍着石阶。接应的船还没到，箱角忽然渗出一滴水，不像水，黏手。你闻一闻，有咸味。",
        audioText:
          "码头起雾，江水拍住石阶。接应嘅艇仔未到，箱角忽然渗出一滴水，唔似水，黏手。你闻一闻，有咸味。",
        glossary: [
          { term: "接应", meaning: "接应的人或船", note: "旧时走私、押运常用。" },
          { term: "黏手", meaning: "粘手", note: "粤语常用词。" },
        ],
        choices: [
          { label: "打开箱睇一眼", next: "silver-4" },
          { label: "当冇事，等艇", next: "silver-4" },
        ],
      },
      {
        id: "silver-4",
        act: 4,
        title: "账里的名字",
        textYue:
          "你撬开一条缝，见到一叠账纸，最上面写住十几个名，其中一个系你阿爸。你手一震，箱盖“啪”一声合埋。",
        textZh:
          "你撬开一条缝，看见一叠账纸，最上面写着十几个名字，其中一个是你父亲。你手一震，箱盖“啪”一声合上。",
        audioText:
          "你撬开一条缝，见到一叠账纸，最上面写住十几个名，其中一个系你阿爸。你手一震，箱盖啪一声合埋。",
        glossary: [
          { term: "撬开", meaning: "撬开", note: "用工具弄开。" },
          { term: "合埋", meaning: "合上", note: "“埋”表示合拢。" },
        ],
        choices: [
          { label: "抄低啲名", next: "silver-5a" },
          { label: "原封不动，照押", next: "silver-5b" },
        ],
      },
      {
        id: "silver-5a",
        act: 5,
        title: "少了一页",
        textYue:
          "你抽出其中一页，塞入衫袋。艇仔到咗，你把箱交出去。回头一望，掌柜企喺骑楼底，好似乜都睇见。",
        textZh:
          "你抽出其中一页，塞进衣袋。船到了，你把箱子交出去。回头一看，掌柜站在骑楼底，好像什么都看见了。",
        audioText:
          "你抽出其中一页，塞入衫袋。艇仔到咗，你把箱交出去。回头一望，掌柜企喺骑楼底，好似乜都睇见。",
        glossary: [
          { term: "骑楼", meaning: "岭南沿街带廊的楼房", note: "广州老城常见。" },
          { term: "乜都睇见", meaning: "什么都看见", note: "粤语口语。" },
        ],
        choices: [
          { label: "当作唔知，返去交差", next: "silver-e1" },
          { label: "连夜离开十三行", next: "silver-e2" },
        ],
      },
      {
        id: "silver-5b",
        act: 5,
        title: "原封的箱",
        textYue:
          "你把箱原样交出去，一句话都冇多讲。掌柜拍咗拍你膊头：“后生仔，识做。”你心入面，却记住嗰个名。",
        textZh:
          "你把箱子原样交出去，一句话都没多说。掌柜拍了拍你的肩膀：“年轻人，懂事。”你心里，却记住了那个名字。",
        audioText:
          "你把箱原样交出去，一句话都冇多讲。掌柜拍咗拍你膊头：后生仔，识做。你心入面，却记住嗰个名。",
        glossary: [
          { term: "膊头", meaning: "肩膀", note: "粤语常用词。" },
          { term: "识做", meaning: "懂事、会做人", note: "粤语口语。" },
        ],
        choices: [
          { label: "留低，慢慢查", next: "silver-e1" },
          { label: "辞工，唔再沾手", next: "silver-e2" },
        ],
      },
      {
        id: "silver-e1",
        act: 6,
        title: "结局 · 留在商馆",
        textYue:
          "你留低，由伙计做到买办。多年后，你把嗰页账捐畀商会，只讲一句：“白纸黑字，唔好烧。”",
        textZh:
          "你留下来，从伙计做到买办。多年后，你把那页账捐给商会，只说一句：“白纸黑字，不要烧。”",
        audioText:
          "你留低，由伙计做到买办。多年后，你把嗰页账捐畀商会，只讲一句：白纸黑字，唔好烧。",
        glossary: [
          { term: "买办", meaning: "商行里负责对外交易的中间人", note: "十三行时期的重要角色。" },
          { term: "捐畀", meaning: "捐给", note: "“畀”表示给。" },
        ],
        choices: [],
        ending: true,
        endingText: "银会蚀，名声唔会。",
      },
      {
        id: "silver-e2",
        act: 6,
        title: "结局 · 离开的人",
        textYue:
          "你连夜搭船走，冇人知你去边。多年后，十三行一场大火，好多账烧成灰。你听到消息，只系摸一摸衫袋嗰页纸。",
        textZh:
          "你连夜坐船离开，没人知道你去哪。多年后，十三行一场大火，很多账烧成灰。你听到消息，只是摸了摸衣袋里那页纸。",
        audioText:
          "你连夜搭船走，冇人知你去边。多年后，十三行一场大火，好多账烧成灰。你听到消息，只系摸一摸衫袋嗰页纸。",
        glossary: [
          { term: "去边", meaning: "去哪里", note: "粤语口语。" },
          { term: "烧成灰", meaning: "烧成灰烬", note: "指史料被毁。" },
        ],
        choices: [],
        ending: true,
        endingText: "有啲账，烧得走；有啲名，烧唔走。",
      },
    ],
  },
];
