import { cover, heroImage, whyImage } from "./image";
import { ghostStories } from "./stories-ghost";
import { wildHistoryStories } from "./stories-wild-history";

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
