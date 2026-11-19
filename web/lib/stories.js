import { cover, heroImage, whyImage } from "./image.js";
import { ghostStories } from "./stories-ghost.js";
import { wildHistoryStories } from "./stories-wild-history.js";

export { heroImage, whyImage };

const heritageStories = [
  {
    slug: 'moonlight',
    mode: 'heritage',
    modeLabel: '正经模式',
    featured: true,
    title: '月光光',
    subtitle: '一首唱了一百年的粤语童谣',
    dialect: '粤语 · 广州西关',
    type: '公有领域改编',
    duration: '3 分钟',
    cover: cover('moonlight'),
    quote: '月光光，照地堂。',
    intro:
      '阿婆说，她细个嗰阵，成条巷都系呢首歌。今晚月光正好，你坐低，听佢慢慢唱。',
    scenes: [
      {
        id: 'moonlight-1',
        act: 1,
        title: '骑楼下的月光',
        textYue:
          '月光光，照地堂。年卅晚，摘槟榔。阿婆坐喺骑楼底，手摇葵扇，一句一句噉唱。',
        textZh:
          '月光洒在天井里。年三十晚上，人们摘槟榔。阿婆坐在骑楼下，摇着葵扇，一句一句地唱。',
        audioText:
          '月光光，照地堂。年卅晚，摘槟榔。阿婆坐喺骑楼底，手摇葵扇，一句一句噉唱。',
        glossary: [
          {
            term: '地堂',
            meaning: '天井、屋前的空地',
            note: '西关大屋常见的天井，夏天用来乘凉。',
          },
          {
            term: '年卅晚',
            meaning: '除夕夜',
            note: '粤语里“卅”读作“saap”，指三十。',
          },
        ],
        choices: [
          { label: '跟住阿婆唱', next: 'moonlight-2a' },
          { label: '问阿婆：点解要摘槟榔？', next: 'moonlight-2b' },
        ],
      },
      {
        id: 'moonlight-2a',
        act: 2,
        title: '一句一句，唱返转头',
        textYue:
          '阿婆笑住拍你只手：“唔使怕丑，跟住我唱。”你一句，佢一句，月光将两个人嘅影子拉得好长。',
        textZh:
          '阿婆笑着拍拍你的手：“不用害羞，跟着我唱。”你一句，她一句，月光把两个人的影子拉得很长。',
        audioText:
          '阿婆笑住拍你只手：唔使怕丑，跟住我唱。你一句，佢一句，月光将两个人嘅影子拉得好长。',
        glossary: [
          {
            term: '唔使怕丑',
            meaning: '不用害羞',
            note: '“怕丑”在粤语里是害羞、难为情。',
          },
        ],
        choices: [
          { label: '问阿婆：月光光之后呢？', next: 'moonlight-3a' },
          { label: '静静哋，把呢把声录低', next: 'moonlight-3b' },
        ],
      },
      {
        id: 'moonlight-2b',
        act: 2,
        title: '槟榔、嫁女与旧时月光',
        textYue:
          '阿婆话，旧时嫁女，槟榔系好意头。月光光照住嘅，唔止系地堂，仲有一代代人嘅心事。',
        textZh:
          '阿婆说，旧时嫁女儿，槟榔代表好兆头。月光照着的，不只是天井，还有一代代人的心事。',
        audioText:
          '阿婆话，旧时嫁女，槟榔系好意头。月光光照住嘅，唔止系地堂，仲有一代代人嘅心事。',
        glossary: [
          {
            term: '好意头',
            meaning: '好兆头、吉利',
            note: '粤语常用“意头”表达吉利与否。',
          },
        ],
        choices: [
          { label: '跟阿婆学埋呢首歌', next: 'moonlight-3a' },
          { label: '问阿婆：你细个嗰阵，又系点样？', next: 'moonlight-3b' },
        ],
      },
      {
        id: 'moonlight-3a',
        act: 3,
        title: '唱到月亮行过骑楼顶',
        textYue:
          '你同阿婆一句接一句，唱到月亮行过骑楼顶。最后一句落音，阿婆笑住话：“识唱就好，第日唱畀你啲细路听。”',
        textZh:
          '你和阿婆一句接一句，唱到月亮走过骑楼顶。最后一句落下，阿婆笑着说：“会唱就好，以后唱给你的孩子听。”',
        audioText:
          '你同阿婆一句接一句，唱到月亮行过骑楼顶。最后一句落音，阿婆笑住话：识唱就好，第日唱畀你啲细路听。',
        glossary: [
          {
            term: '第日',
            meaning: '以后、将来',
            note: '粤语常用“第日”表示往后的日子。',
          },
          {
            term: '细路',
            meaning: '小孩',
            note: '粤语里“细路”或“细路仔”都指小孩子。',
          },
        ],
        choices: [],
        ending: true,
        endingText: '童谣唔怕旧，最怕冇人再唱。',
      },
      {
        id: 'moonlight-3b',
        act: 3,
        title: '一把声，三代人',
        textYue:
          '你把录音键按停，问阿婆：“你细个嗰阵，又系点样？”阿婆望住月光，话佢阿妈都系喺骑楼底，一句一句教佢唱。原来呢首歌，已经唱过三代人。',
        textZh:
          '你停下录音，问阿婆：“你小时候，又是怎样的？”阿婆望着月光，说她妈妈也是在骑楼下，一句一句教她唱。原来这首歌，已经唱过三代人。',
        audioText:
          '你把录音键按停，问阿婆：你细个嗰阵，又系点样？阿婆望住月光，话佢阿妈都系喺骑楼底，一句一句教佢唱。原来呢首歌，已经唱过三代人。',
        glossary: [
          {
            term: '细个',
            meaning: '小时候',
            note: '粤语“细个”常用来问或讲童年。',
          },
        ],
        choices: [],
        ending: true,
        endingText: '一把声音，串起三代人的月光。',
      },
    ],
  },
  {
    slug: 'mouse-wedding',
    mode: 'heritage',
    modeLabel: '正经模式',
    featured: true,
    title: '老鼠娶亲',
    subtitle: '一个关于“谁最厉害”的粤语民间故事',
    dialect: '粤语 · 珠三角',
    type: '公有领域改编',
    duration: '4 分钟',
    cover: cover('mouse-wedding'),
    quote: '老鼠嫁女，最紧要有胆。',
    intro:
      '老鼠妈妈要嫁女，想搵个全世界最厉害嘅女婿。太阳、云、风、墙……到底边个最厉害？',
    scenes: [
      {
        id: 'mouse-1',
        act: 1,
        title: '老鼠妈妈要嫁女',
        textYue:
          '老鼠妈妈话：“我个女咁靓，一定要嫁畀全世界最厉害嘅人。”佢抬头一望，见到太阳，就话：“太阳最厉害！”',
        textZh:
          '老鼠妈妈说：“我女儿这么漂亮，一定要嫁给全世界最厉害的人。”她抬头一看，看见太阳，就说：“太阳最厉害！”',
        audioText:
          '老鼠妈妈话：我个女咁靓，一定要嫁畀全世界最厉害嘅人。佢抬头一望，见到太阳，就话：太阳最厉害。',
        glossary: [
          {
            term: '嫁畀',
            meaning: '嫁给',
            note: '“畀”在粤语里表示“给、让”。',
          },
        ],
        choices: [
          { label: '问太阳：你怕乜嘢？', next: 'mouse-2a' },
          { label: '跟住老鼠队伍去睇热闹', next: 'mouse-2b' },
        ],
      },
      {
        id: 'mouse-2a',
        act: 2,
        title: '太阳、云、风、墙',
        textYue:
          '太阳话：“我惊云，云一遮，我就冇光。”云话：“我惊风，风一吹，我就散。”风话：“我惊墙，墙一挡，我就过唔到。”墙话：“我惊老鼠，老鼠一钻，我就穿。”',
        textZh:
          '太阳说：“我怕云，云一遮，我就没有光。”云说：“我怕风，风一吹，我就散了。”风说：“我怕墙，墙一挡，我就过不去。”墙说：“我怕老鼠，老鼠一钻，我就穿了。”',
        audioText:
          '太阳话：我惊云，云一遮，我就冇光。云话：我惊风，风一吹，我就散。风话：我惊墙，墙一挡，我就过唔到。墙话：我惊老鼠，老鼠一钻，我就穿。',
        glossary: [
          {
            term: '惊',
            meaning: '怕',
            note: '粤语“惊”比“怕”更常用。',
          },
          {
            term: '穿',
            meaning: '破、穿透',
            note: '这里指墙被老鼠钻出洞。',
          },
        ],
        choices: [
          { label: '原来最厉害嘅系老鼠！', next: 'mouse-3a' },
          { label: '唔系，墙先至最硬！', next: 'mouse-3b' },
        ],
      },
      {
        id: 'mouse-2b',
        act: 2,
        title: '骑楼底嘅迎亲队伍',
        textYue:
          '老鼠队伍抬住花轿，吹住滴滴答，行过骑楼。忽然，一只大花猫蹲喺巷口，眼定定咁望住佢哋。',
        textZh:
          '老鼠队伍抬着花轿，吹吹打打，走过骑楼。忽然，一只大花猫蹲在巷口，眼睛直直地盯着他们。',
        audioText:
          '老鼠队伍抬住花轿，吹住滴滴答，行过骑楼。忽然，一只大花猫蹲喺巷口，眼定定咁望住佢哋。',
        glossary: [
          {
            term: '眼定定',
            meaning: '目不转睛地盯着',
            note: '形容猫盯住猎物的样子。',
          },
        ],
        choices: [
          { label: '大叫一声：走啊！', next: 'mouse-3a' },
          { label: '静静鸡绕路走', next: 'mouse-3b' },
        ],
      },
      {
        id: 'mouse-3a',
        act: 3,
        title: '最厉害嘅，系胆量',
        textYue:
          '老鼠妈妈醒起：太阳怕云，云怕风，风怕墙，墙怕老鼠。原来最厉害嘅，唔系边个最大，而系你够唔够胆，识唔识转个弯。',
        textZh:
          '老鼠妈妈想起来：太阳怕云，云怕风，风怕墙，墙怕老鼠。原来最厉害的，不是谁最大，而是你够不够勇敢，懂不懂转个弯。',
        audioText:
          '老鼠妈妈醒起：太阳怕云，云怕风，风怕墙，墙怕老鼠。原来最厉害嘅，唔系边个最大，而系你够唔够胆，识唔识转个弯。',
        glossary: [
          {
            term: '醒起',
            meaning: '想起来、意识到',
            note: '粤语常用“醒起”表示突然想起。',
          },
        ],
        choices: [],
        ending: true,
        endingText: '老鼠嫁女，嫁的不是最厉害的人，是最有胆量的自己。',
      },
      {
        id: 'mouse-3b',
        act: 3,
        title: '墙也有墙的怕',
        textYue:
          '墙话：“我睇落好硬，其实我最惊老鼠。”老鼠妈妈笑咗：“原来每个人都有怕嘅嘢。最紧要系，知道自己怕乜，仲敢行落去。”',
        textZh:
          '墙说：“我看起来很强硬，其实我最怕老鼠。”老鼠妈妈笑了：“原来每个人都有害怕的东西。最重要的是，知道自己怕什么，还敢继续往前走。”',
        audioText:
          '墙话：我睇落好硬，其实我最惊老鼠。老鼠妈妈笑咗：原来每个人都有怕嘅嘢。最紧要系，知道自己怕乜，仲敢行落去。',
        glossary: [
          {
            term: '睇落',
            meaning: '看起来',
            note: '粤语“睇”是看，“睇落”是看上去。',
          },
        ],
        choices: [],
        ending: true,
        endingText: '最硬的墙，也有它害怕的小老鼠。',
      },
    ],
  },
  {
    slug: 'grandma-congee',
    mode: 'heritage',
    modeLabel: '正经模式',
    featured: true,
    title: '阿婆的艇仔粥',
    subtitle: '一个关于清晨、码头与慢火的故事',
    dialect: '粤语 · 广州河南',
    type: '示例故事（待替换为真实家庭故事）',
    duration: '4 分钟',
    cover: cover('grandma-congee'),
    quote: '粥要慢火，故事要慢慢讲。',
    intro:
      '天未光，阿婆就拎住保温壶，带你去码头买艇仔粥。她说，一碗粥里，藏住半条江的故事。',
    scenes: [
      {
        id: 'congee-1',
        act: 1,
        title: '天未光，码头已经醒咗',
        textYue:
          '清晨五点半，珠江边仲有雾。阿婆拖住你只手，行过湿湿哋嘅石板路：“快啲，去迟咗就冇油条。”',
        textZh:
          '清晨五点半，珠江边还有雾。阿婆拉着你的手，走过湿湿的石板路：“快点，去晚了就没有油条了。”',
        audioText:
          '清晨五点半，珠江边仲有雾。阿婆拖住你只手，行过湿湿哋嘅石板路：快啲，去迟咗就冇油条。',
        glossary: [
          {
            term: '湿湿哋',
            meaning: '有点湿',
            note: '粤语“哋”表示程度、状态。',
          },
          {
            term: '冇',
            meaning: '没有',
            note: '粤语常用“冇”表示没有。',
          },
        ],
        choices: [
          { label: '加花生同油条', next: 'congee-2a' },
          { label: '问阿婆：点解要咁早？', next: 'congee-2b' },
        ],
      },
      {
        id: 'congee-2a',
        act: 2,
        title: '一碗粥的配料',
        textYue:
          '阿婆话：“艇仔粥要有鱼片、花生、油条、葱花，仲要有耐心。粥底滚咗，料要逐样落，唔可以急。”',
        textZh:
          '阿婆说：“艇仔粥要有鱼片、花生、油条、葱花，还要有耐心。粥底滚了，料要一样一样地下，不能急。”',
        audioText:
          '阿婆话：艇仔粥要有鱼片、花生、油条、葱花，仲要有耐心。粥底滚咗，料要逐样落，唔可以急。',
        glossary: [
          {
            term: '逐样',
            meaning: '一样一样地',
            note: '粤语“逐”表示依次、逐个。',
          },
        ],
        choices: [
          { label: '问阿婆：粥里有乜故事？', next: 'congee-3a' },
          { label: '帮阿婆拎住保温壶', next: 'congee-3b' },
        ],
      },
      {
        id: 'congee-2b',
        act: 2,
        title: '水上人家的清晨',
        textYue:
          '阿婆话，旧时艇仔粥系水上人家煮嘅。天未光就开船，一碗热粥，系一日嘅开始。“你太公以前都系喺江上做嘢。”',
        textZh:
          '阿婆说，旧时艇仔粥是水上人家煮的。天没亮就开船，一碗热粥，是一天的开始。“你太公以前也是在江上做事的。”',
        audioText:
          '阿婆话，旧时艇仔粥系水上人家煮嘅。天未光就开船，一碗热粥，系一日嘅开始。你太公以前都系喺江上做嘢。',
        glossary: [
          {
            term: '水上人家',
            meaning: '过去生活在船上的居民',
            note: '珠江上的疍家，以船为家。',
          },
        ],
        choices: [
          { label: '问阿婆：太公系点样嘅人？', next: 'congee-3a' },
          { label: '静静哋听江水声', next: 'congee-3b' },
        ],
      },
      {
        id: 'congee-3a',
        act: 3,
        title: '太公的船',
        textYue:
          '阿婆话，太公以前喺江上撑船，天未光就煲一大锅粥，畀船工食饱先开船。佢话，粥唔止系食嘅，系等人、等潮水、等一日开始。',
        textZh:
          '阿婆说，太公以前在江上撑船，天没亮就煮一大锅粥，让船工吃饱再开船。她说，粥不只是吃的，是等人、等潮水、等一天开始。',
        audioText:
          '阿婆话，太公以前喺江上撑船，天未光就煲一大锅粥，畀船工食饱先开船。佢话，粥唔止系食嘅，系等人、等潮水、等一日开始。',
        glossary: [
          {
            term: '撑船',
            meaning: '用竹篙撑船前行',
            note: '旧时珠江上很多船家以撑船为生。',
          },
          {
            term: '煲',
            meaning: '煮、熬',
            note: '粤语“煲粥”“煲汤”都用这个字。',
          },
        ],
        choices: [],
        ending: true,
        endingText: '一碗粥，等的不是火候，是人。',
      },
      {
        id: 'congee-3b',
        act: 3,
        title: '回家的路',
        textYue:
          '你帮阿婆拎住保温壶，两个人沿住江边慢慢行。阿婆话：“第日你煮畀边个食？”你冇答，只系将壶抱实啲。',
        textZh:
          '你帮阿婆拎着保温壶，两个人沿着江边慢慢走。阿婆说：“以后你煮给谁吃？”你没有回答，只是把壶抱得更紧。',
        audioText:
          '你帮阿婆拎住保温壶，两个人沿住江边慢慢行。阿婆话：第日你煮畀边个食？你冇答，只系将壶抱实啲。',
        glossary: [
          {
            term: '第日',
            meaning: '以后、将来',
            note: '粤语常用“第日”表示往后的日子。',
          },
          {
            term: '抱实',
            meaning: '抱紧',
            note: '粤语“实”表示牢固、紧。',
          },
        ],
        choices: [],
        ending: true,
        endingText: '慢火煮的粥，才留得住人。',
      },
    ],
  },
  {
    slug: 'five-goats',
    mode: 'heritage',
    modeLabel: '正经模式',
    featured: false,
    title: '五羊传说',
    subtitle: '五只羊，一座城',
    dialect: '粤语 · 广州越秀',
    type: '公有领域传说改编',
    duration: '4 分钟',
    cover: cover('five-goats'),
    quote: '五羊衔穗，从此冇饥荒。',
    intro:
      '阿爷拖住你行上越秀山，指着山脚五只石羊，话呢个故仔要由好耐好耐以前讲起。',
    scenes: [
      {
        id: 'five-goats-1',
        act: 1,
        title: '山脚的五只羊',
        textYue:
          '阿爷拖住你行上越秀山。山脚有五只石羊，只只都抬高头，口里衔住一束谷穗。阿爷话，呢个故仔，要由好耐好耐以前讲起。',
        textZh:
          '爷爷牵着你走上越秀山。山脚有五只石羊，每一只都抬着头，口里衔着一束谷穗。爷爷说，这个故事要从很久很久以前讲起。',
        audioText:
          '阿爷拖住你行上越秀山。山脚有五只石羊，只只都抬高头，口里衔住一束谷穗。',
        glossary: [
          {
            term: '行',
            meaning: '走',
            note: '粤语“行”对应普通话的“走”。',
          },
          {
            term: '衔',
            meaning: '用嘴含着',
            note: '石羊口里衔着谷穗，是五羊石像的标志。',
          },
        ],
        choices: [
          { label: '问阿爷：点解系五只羊？', next: 'five-goats-2a' },
          { label: '跟住阿爷上山', next: 'five-goats-2b' },
        ],
      },
      {
        id: 'five-goats-2a',
        act: 2,
        title: '仙人骑羊',
        textYue:
          '阿爷话，相传西周嘅时候，有五位仙人，骑住五只羊，从天上落嚟。仙人手里拎住谷穗，行到海边嘅小村，见当地人就快饿死。',
        textZh:
          '爷爷说，相传西周的时候，有五位仙人骑着五只羊从天上下来。仙人手里拿着谷穗，走到海边的小村，看见当地人快要饿死。',
        audioText:
          '阿爷话，相传西周嘅时候，有五位仙人，骑住五只羊，从天上落嚟。仙人手里拎住谷穗。',
        glossary: [
          {
            term: '落嚟',
            meaning: '下来',
            note: '“嚟”是粤语的“来”。',
          },
          {
            term: '拎住',
            meaning: '拿着',
            note: '“拎”读作 ling1。',
          },
        ],
        choices: [
          { label: '问仙人送咗啲咩', next: 'five-goats-3a' },
          { label: '问啲羊去咗边', next: 'five-goats-3b' },
        ],
      },
      {
        id: 'five-goats-2b',
        act: 2,
        title: '山上的石像',
        textYue:
          '你哋一路行，一路数石羊。阿爷话，呢五只羊唔系普通石头，系仙人留低嘅。你摸住羊角，石面俾人摸到滑溜溜。',
        textZh:
          '你们一边走一边数石羊。爷爷说，这五只羊不是普通石头，是仙人留下的。你摸着羊角，石面被人摸得滑溜溜。',
        audioText:
          '你哋一路行，一路数石羊。阿爷话，呢五只羊唔系普通石头，系仙人留低嘅。',
        glossary: [
          {
            term: '留低',
            meaning: '留下',
            note: '“低”在粤语里表示动作完成、留下。',
          },
          {
            term: '滑溜溜',
            meaning: '很光滑',
            note: '形容石头被摸得发亮。',
          },
        ],
        choices: [
          { label: '问石羊点解会变石头', next: 'five-goats-3b' },
          { label: '望住山下的广州城', next: 'five-goats-3a' },
        ],
      },
      {
        id: 'five-goats-3a',
        act: 3,
        title: '穗落成城',
        textYue:
          '仙人把谷穗送俾村民，祝佢哋从此冇饥荒。仙人走咗之后，五只羊化成石头，留喺山上。广州从此又叫羊城、穗城。',
        textZh:
          '仙人把谷穗送给村民，祝愿他们从此不再挨饿。仙人离开后，五只羊化成石头，留在山上。广州从此又叫羊城、穗城。',
        audioText:
          '仙人把谷穗送俾村民，祝佢哋从此冇饥荒。五只羊化成石头，留喺山上。',
        glossary: [
          {
            term: '化成',
            meaning: '变成',
            note: '民间传说里常见“化为石”的说法。',
          },
          {
            term: '穗',
            meaning: '谷穗',
            note: '广州别称“穗城”由此而来。',
          },
        ],
        choices: [],
        ending: true,
        endingText: '五只羊留低嘅，唔止系石头，系一座城嘅名字。',
      },
      {
        id: 'five-goats-3b',
        act: 3,
        title: '石羊睇住嘅城',
        textYue:
          '阿爷话，石羊睇住广州睇咗几千年。以前系海，而家系楼。你落山嗰阵回头望，石羊仍然抬高头，好似仲喺度等仙人返嚟。',
        textZh:
          '爷爷说，石羊看着广州看了几千年。以前是海，现在是高楼。你下山时回头望，石羊仍然抬着头，好像在等仙人回来。',
        audioText:
          '阿爷话，石羊睇住广州睇咗几千年。以前系海，而家系楼。',
        glossary: [
          {
            term: '嗰阵',
            meaning: '那时候',
            note: '“嗰”是粤语的“那”。',
          },
          {
            term: '仲喺度',
            meaning: '还在',
            note: '“仲”表示仍然。',
          },
        ],
        choices: [],
        ending: true,
        endingText: '城市一直变，石羊一直喺度。',
      },
    ],
  },
  {
    slug: 'chicken-lullaby',
    mode: 'heritage',
    modeLabel: '正经模式',
    featured: false,
    title: '鸡公仔',
    subtitle: '一首唱到天光嘅广府童谣',
    dialect: '粤语 · 广州西关',
    type: '公有领域童谣改编',
    duration: '3 分钟',
    cover: cover('chicken-lullaby'),
    quote: '鸡公仔，尾弯弯。',
    intro:
      '天未光，阿婆已经坐喺床尾，轻轻唱：“鸡公仔，尾弯弯，做人新抱几艰难……”',
    scenes: [
      {
        id: 'chicken-1',
        act: 1,
        title: '天未光嘅歌声',
        textYue:
          '天蒙蒙光，阿婆坐喺床尾，轻轻唱：“鸡公仔，尾弯弯，做人新抱几艰难。”你未瞓醒，只觉得个调好熟。',
        textZh:
          '天刚蒙蒙亮，阿婆坐在床尾，轻轻唱：“鸡公仔，尾弯弯，做人新抱几艰难。”你还没睡醒，只觉得这个调子很熟。',
        audioText:
          '天蒙蒙光，阿婆坐喺床尾，轻轻唱：鸡公仔，尾弯弯，做人新抱几艰难。',
        glossary: [
          {
            term: '新抱',
            meaning: '媳妇',
            note: '粤语称儿媳妇为“新抱”。',
          },
          {
            term: '几艰难',
            meaning: '多么艰难',
            note: '“几”在这里表示程度，相当于“多”。',
          },
        ],
        choices: [
          { label: '跟住阿婆唱', next: 'chicken-2a' },
          { label: '问阿婆咩系新抱', next: 'chicken-2b' },
        ],
      },
      {
        id: 'chicken-2a',
        act: 2,
        title: '早早起身都话晏',
        textYue:
          '你跟住唱：“早早起身都话晏，眼泪唔干入下间。”阿婆笑咗一下，话你唱得准，但系唔知呢句讲嘅系边个。',
        textZh:
          '你跟着唱：“早早起身都话晏，眼泪未干进下间。”阿婆笑了一下，说你唱得准，但不知道这句讲的是谁。',
        audioText:
          '你跟住唱：早早起身都话晏，眼泪唔干入下间。阿婆笑咗一下。',
        glossary: [
          {
            term: '晏',
            meaning: '晚、迟',
            note: '粤语“晏”指时间晚，也指中午。',
          },
          {
            term: '下间',
            meaning: '厨房',
            note: '旧时大屋的厨房多在下间。',
          },
        ],
        choices: [
          { label: '问系咪阿婆自己', next: 'chicken-3a' },
          { label: '继续唱落去', next: 'chicken-3b' },
        ],
      },
      {
        id: 'chicken-2b',
        act: 2,
        title: '做人新抱',
        textYue:
          '阿婆话，旧时新抱入门，天未光就要起身煮饭。煮得晏又话晏，煮得早又话早，眼泪只可以吞落肚。',
        textZh:
          '阿婆说，旧时媳妇进门，天没亮就要起来做饭。煮晚了说晚，煮早了说早，眼泪只能往肚里咽。',
        audioText:
          '阿婆话，旧时新抱入门，天未光就要起身煮饭。眼泪只可以吞落肚。',
        glossary: [
          {
            term: '入门',
            meaning: '嫁进门',
            note: '旧时婚礼后新妇入夫家门。',
          },
          {
            term: '吞落肚',
            meaning: '咽进肚子里',
            note: '比喻把委屈藏起来。',
          },
        ],
        choices: [
          { label: '问阿婆有冇受过', next: 'chicken-3a' },
          { label: '问点解唔讲出声', next: 'chicken-3b' },
        ],
      },
      {
        id: 'chicken-3a',
        act: 3,
        title: '一只冬瓜',
        textYue:
          '阿婆话，佢做新抱嗰阵，试过为咗一只冬瓜，俾人闹到天光。讲完，佢又笑：“而家好喇，你阿妈唔使咁。”',
        textZh:
          '阿婆说，她做媳妇的时候，为了一个冬瓜，被人骂到天亮。说完，她又笑：“现在好了，你妈妈不用这样。”',
        audioText:
          '阿婆话，佢做新抱嗰阵，试过为咗一只冬瓜，俾人闹到天光。',
        glossary: [
          {
            term: '闹',
            meaning: '骂',
            note: '粤语“闹”常用于责骂。',
          },
          {
            term: '而家',
            meaning: '现在',
            note: '粤语日常常用词。',
          },
        ],
        choices: [],
        ending: true,
        endingText: '童谣唱嘅系旧时，日子已经唔同。',
      },
      {
        id: 'chicken-3b',
        act: 3,
        title: '唱到天光',
        textYue:
          '你同阿婆一句一句唱，唱到窗外嘅天由灰变白。最后一句唱完，阿婆话：“呢首歌，你记住，第日唱返俾人听。”',
        textZh:
          '你和阿婆一句一句唱，唱到窗外的天由灰变白。最后一句唱完，阿婆说：“这首歌你记住，以后唱给别人听。”',
        audioText:
          '你同阿婆一句一句唱，唱到窗外嘅天由灰变白。阿婆话：呢首歌，你记住，第日唱返俾人听。',
        glossary: [
          {
            term: '第日',
            meaning: '以后、改天',
            note: '粤语“第日”不指第二天，而指将来。',
          },
          {
            term: '唱返',
            meaning: '唱回去、再唱',
            note: '“返”表示动作回到原处或继续。',
          },
        ],
        choices: [],
        ending: true,
        endingText: '天光喇，歌留低咗。',
      },
    ],
  },
];

export const storyModes = [
  {
    key: 'heritage',
    label: '正经模式',
    title: '留住把声',
    description: '温暖、克制，适合一家人一起听。',
  },
  {
    key: 'ghost',
    label: '鬼故事模式',
    title: '半夜唔好乱咁望',
    description: '夜色、悬疑、民俗解释；不血腥，但会让人背后一凉。',
  },
  {
    key: 'wild_history',
    label: '野史模式',
    title: '听讲当年……',
    description: '说书人口吻，八卦、俏皮；真假难考，但民间的气是真的。',
  },
];

export const stories = [...heritageStories, ...ghostStories, ...wildHistoryStories];
export const featuredStories = stories.filter((story) => story.featured);

export function getStory(slug) {
  return stories.find((story) => story.slug === slug);
}

export function getStoryScenes(story) {
  return story.scenes.reduce((acc, scene) => {
    acc[scene.id] = scene;
    return acc;
  }, {});
}
