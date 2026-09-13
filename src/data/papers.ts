import type {
  ListeningPaper,
  MatchingPaper,
  ReadingPaper,
  TranslationPaper,
  WritingPaper,
} from '../types'

export const LISTENING: ListeningPaper[] = [
  {
    id: 'L1',
    title: '校园实习与职业选择',
    year: '样题 · 对话',
    type: 'conversation',
    durationMin: 18,
    intro:
      '一段学生与职业顾问的对话。先盲听一遍，再逐句精听、听写，最后做题。可用系统语音朗读英文文本。',
    script: [
      {
        speaker: 'Advisor',
        text: 'Thanks for coming in, Maya. I looked over your résumé, and I think you already have a stronger profile than you realize. The question is how to present that experience so that it speaks to employers outside campus.',
      },
      {
        speaker: 'Maya',
        text: 'That is exactly what worries me. I have spent two years coordinating the campus sustainability project, but I am not sure companies will take that seriously. It feels more like volunteer work than a real job.',
      },
      {
        speaker: 'Advisor',
        text: 'I would push back on that. You managed a budget, negotiated with the dining halls, and persuaded three departments to change their purchasing policy. Those are transferable skills: project management, stakeholder communication, and, frankly, persistence.',
      },
      {
        speaker: 'Maya',
        text: 'I had not thought of it that way. Still, most internships I am looking at ask for experience in consulting or data analysis. I do not want to abandon the environmental work, but I also do not want to lock myself into a narrow path.',
      },
      {
        speaker: 'Advisor',
        text: 'Then treat this summer as a bridge, not a final destination. There is a research internship at the city planning office that combines environmental impact assessment with basic data work. It is competitive, but your campus project is a genuine advantage.',
      },
      {
        speaker: 'Maya',
        text: 'Would they expect me to know statistical software already? I have only used spreadsheets for our waste audit.',
      },
      {
        speaker: 'Advisor',
        text: 'They train interns on the software. What they cannot teach quickly is judgment: knowing which numbers matter and how to explain them to people who are not specialists. Your waste audit already shows that instinct.',
      },
      {
        speaker: 'Maya',
        text: 'All right. I will apply there, and I will rewrite the résumé tonight so that the outcomes are more explicit. Could you look at a draft tomorrow?',
      },
      {
        speaker: 'Advisor',
        text: 'Send it by noon and I will mark it up before Thursday. One last thing: do not diminish the campus work just to sound more corporate. The best résumés keep a clear thread. Yours is already there if you name it.',
      },
    ],
    dictation: [
      {
        id: 'L1-d1',
        full: 'Those are transferable skills: project management, stakeholder communication, and persistence.',
      },
      {
        id: 'L1-d2',
        full: 'Then treat this summer as a bridge, not a final destination.',
      },
      {
        id: 'L1-d3',
        full: 'What they cannot teach quickly is judgment: knowing which numbers matter.',
      },
    ],
    questions: [
      {
        id: 'L1-q1',
        stem: 'Why does Maya hesitate to highlight her campus project?',
        options: [
          { key: 'A', text: 'She thinks employers will see it as unpaid volunteer work.' },
          { key: 'B', text: 'She has not finished the project yet.' },
          { key: 'C', text: 'The advisor told her to hide non-profit experience.' },
          { key: 'D', text: 'The project failed to change any campus policy.' },
        ],
        answer: 'A',
        explanation: 'Maya 说公司可能不会认真看待这段经历，觉得它更像志愿工作而非正式工作。',
      },
      {
        id: 'L1-q2',
        stem: 'What does the advisor emphasize about Maya’s campus work?',
        options: [
          { key: 'A', text: 'It proves she can write academic papers.' },
          { key: 'B', text: 'It already includes budget, negotiation and persuasion.' },
          { key: 'C', text: 'It is only valuable for environmental NGOs.' },
          { key: 'D', text: 'It should be deleted from the résumé.' },
        ],
        answer: 'B',
        explanation: '顾问明确提到她管理过预算、与食堂谈判、说服院系改变采购政策。',
      },
      {
        id: 'L1-q3',
        stem: 'What kind of internship does the advisor recommend?',
        options: [
          { key: 'A', text: 'A consulting firm that ignores environmental issues.' },
          { key: 'B', text: 'A purely statistical lab with no public contact.' },
          { key: 'C', text: 'A city planning internship mixing impact assessment and data.' },
          { key: 'D', text: 'Another year on the campus sustainability project only.' },
        ],
        answer: 'C',
        explanation: '顾问推荐市政规划办公室的研究实习，把环境影响评估和基础数据工作结合起来。',
      },
      {
        id: 'L1-q4',
        stem: 'According to the advisor, what can the office not teach quickly?',
        options: [
          { key: 'A', text: 'How to use their statistical software.' },
          { key: 'B', text: 'How to write a formal cover letter.' },
          { key: 'C', text: 'Judgment about which numbers matter and how to explain them.' },
          { key: 'D', text: 'Campus dining-hall regulations.' },
        ],
        answer: 'C',
        explanation: '顾问说软件可以培训，但判断力——知道哪些数字重要、如何向非专业人士解释——无法速成。',
      },
    ],
  },
  {
    id: 'L2',
    title: '习惯形成的科学',
    year: '样题 · 讲座',
    type: 'lecture',
    durationMin: 22,
    intro:
      '一段关于习惯回路的学术讲座。注意信号词（however, in other words, the point is）和例子与结论的对应。',
    script: [
      {
        speaker: 'Professor',
        text: 'Good morning. Last week we talked about motivation as if it were fuel. Today I want to complicate that picture. Motivation gets a behavior started; habit is what keeps it alive when motivation inevitably fluctuates.',
      },
      {
        speaker: 'Professor',
        text: 'Most researchers describe a habit loop with three parts: a cue, a routine, and a reward. The cue is a trigger in the environment. It might be a time of day, a place, or even a feeling, such as restlessness after dinner. The routine is the action itself. The reward is the brain’s reason for remembering the loop.',
      },
      {
        speaker: 'Professor',
        text: 'Here is the part students often miss. The reward does not have to be dramatic. For a runner, it may simply be the feeling of having kept a promise. For someone reviewing vocabulary, it may be the small relief of closing a finished list. If the reward is invisible, the loop is fragile.',
      },
      {
        speaker: 'Professor',
        text: 'This has a practical implication. When people fail to sustain a study plan, they usually blame willpower. The more useful question is: what cue did they rely on, and was the reward immediate enough? A plan that says “study more” has neither.',
      },
      {
        speaker: 'Professor',
        text: 'There is also a common myth that it takes twenty-one days to form a habit. Empirical studies suggest a much wider range—sometimes more than two months—depending on the complexity of the routine. Simple actions stabilize faster than intricate ones.',
      },
      {
        speaker: 'Professor',
        text: 'So if you are designing a language-learning habit, start smaller than your ambition. Pair it with a stable cue, such as making tea. And make the reward explicit: tick a box, speak one sentence aloud, or stand up from the desk. The point is not to be heroic. The point is to make repetition inevitable.',
      },
    ],
    dictation: [
      {
        id: 'L2-d1',
        full: 'Motivation gets a behavior started; habit is what keeps it alive when motivation inevitably fluctuates.',
      },
      {
        id: 'L2-d2',
        full: 'When people fail to sustain a study plan, they usually blame willpower.',
      },
      {
        id: 'L2-d3',
        full: 'The point is not to be heroic. The point is to make repetition inevitable.',
      },
    ],
    questions: [
      {
        id: 'L2-q1',
        stem: 'What is the professor’s main distinction between motivation and habit?',
        options: [
          { key: 'A', text: 'Motivation is useless, while habit is everything.' },
          { key: 'B', text: 'Motivation starts a behavior; habit maintains it when motivation varies.' },
          { key: 'C', text: 'Habit only works for athletes, not for students.' },
          { key: 'D', text: 'Motivation lasts longer than any habit loop.' },
        ],
        answer: 'B',
        explanation: '开头明确：动机让行为开始，习惯在动机波动时让行为继续。',
      },
      {
        id: 'L2-q2',
        stem: 'Which of the following is NOT part of the habit loop described?',
        options: [
          { key: 'A', text: 'A cue in the environment' },
          { key: 'B', text: 'A routine or action' },
          { key: 'C', text: 'A genetic talent score' },
          { key: 'D', text: 'A reward the brain remembers' },
        ],
        answer: 'C',
        explanation: '讲座只提到 cue, routine, reward，没有基因天赋分数。',
      },
      {
        id: 'L2-q3',
        stem: 'Why does the professor say a reward can be small?',
        options: [
          { key: 'A', text: 'Because only money can reinforce a habit.' },
          { key: 'B', text: 'Because the brain needs an immediate reason to remember the loop.' },
          { key: 'C', text: 'Because students should avoid any feeling of progress.' },
          { key: 'D', text: 'Because rewards must be delayed for at least a month.' },
        ],
        answer: 'B',
        explanation: '教授强调奖励不必夸张，但需要让大脑记住这个回路；若奖励不可见，回路就脆弱。',
      },
      {
        id: 'L2-q4',
        stem: 'What does research say about the “twenty-one days” claim?',
        options: [
          { key: 'A', text: 'It is accurate for every kind of habit.' },
          { key: 'B', text: 'It only applies to language learning.' },
          { key: 'C', text: 'The real range is much wider and can exceed two months.' },
          { key: 'D', text: 'Habits never stabilize at all.' },
        ],
        answer: 'C',
        explanation: '实证研究显示时间范围更宽，复杂行为有时超过两个月。',
      },
      {
        id: 'L2-q5',
        stem: 'What practical advice does the professor give language learners?',
        options: [
          { key: 'A', text: 'Start smaller, attach a stable cue, and make the reward explicit.' },
          { key: 'B', text: 'Study only when you feel highly motivated.' },
          { key: 'C', text: 'Avoid any repetition because it is boring.' },
          { key: 'D', text: 'Wait twenty-one days before beginning.' },
        ],
        answer: 'A',
        explanation: '结尾建议：比野心更小地开始，绑定稳定线索，并把奖励做明确。',
      },
    ],
  },
]

export const READING: ReadingPaper[] = [
  {
    id: 'R1',
    title: '无聊的价值',
    year: '样题 · 仔细阅读',
    minutes: 15,
    passageTitle: 'In Defense of Boredom',
    passage: `It is now almost a moral failure to admit that one is bored. Phones promise an endless supply of novelty, and any empty minute can be filled with a scroll. Yet a growing number of psychologists argue that boredom is not a defect to be eliminated. It is a signal, and sometimes a useful one.

Boredom, in this view, is the mind’s way of saying that the current activity no longer pays. That sounds negative until one notices what happens next. When people are deprived of easy stimulation, they begin to wander. They make odd connections. They remember errands, unfinished sentences, and half-formed ideas that had been crowded out. In laboratory studies, participants left in a plain room for a short time often report a burst of daydreaming that later feeds creative tasks.

None of this means that boredom is pleasant, or that every idle moment is profound. Chronic boredom, especially when mixed with a sense of meaninglessness, can be distressing. The claim is narrower: a life engineered to avoid even brief emptiness may also avoid the conditions in which attention resets. Constant novelty keeps the mind occupied, but it can erode the patience required for a difficult book or a long argument.

There is a practical implication for students. Many of them treat every pause between classes as a leak to be sealed. The result is not more learning but a thinner kind of attention, always half ready for the next alert. A more deliberate approach would be to protect a few unfilled minutes—on a bus, after a meal—and to notice what the mind does when it is not being fed. The point is not to romanticize tedium. It is to recover a modest skill that modern life has made to look unnecessary: the ability to stay with one’s own thoughts long enough for them to become interesting.`,
    questions: [
      {
        id: 'R1-q1',
        stem: 'What is the author’s main idea?',
        options: [
          { key: 'A', text: 'Boredom should be completely eliminated by better phones.' },
          { key: 'B', text: 'Boredom can be a useful signal that helps the mind wander and reset.' },
          { key: 'C', text: 'Only artists benefit from being bored.' },
          { key: 'D', text: 'Students should never rest between classes.' },
        ],
        answer: 'B',
        explanation: '全文主旨：无聊不是缺陷，而是一种信号，有时能让注意重置并产生有用的走神。',
      },
      {
        id: 'R1-q2',
        stem: 'According to paragraph 2, what may happen when easy stimulation is removed?',
        options: [
          { key: 'A', text: 'People immediately fall asleep.' },
          { key: 'B', text: 'People stop having any ideas.' },
          { key: 'C', text: 'People wander mentally and later perform better on creative tasks.' },
          { key: 'D', text: 'People become unable to remember errands.' },
        ],
        answer: 'C',
        explanation: '第二段写到：缺少刺激时人们会走神、产生奇怪联结，实验室中这种走神随后有助于创造性任务。',
      },
      {
        id: 'R1-q3',
        stem: 'The word “erode” in paragraph 3 is closest in meaning to ______.',
        options: [
          { key: 'A', text: 'strengthen' },
          { key: 'B', text: 'gradually wear away' },
          { key: 'C', text: 'suddenly create' },
          { key: 'D', text: 'publicly praise' },
        ],
        answer: 'B',
        explanation: 'erode 意为侵蚀、逐渐削弱，与 gradually wear away 最接近。',
      },
      {
        id: 'R1-q4',
        stem: 'What does the author suggest students do?',
        options: [
          { key: 'A', text: 'Fill every pause with short videos.' },
          { key: 'B', text: 'Protect a few unfilled minutes and notice their own thoughts.' },
          { key: 'C', text: 'Give up difficult books entirely.' },
          { key: 'D', text: 'Treat boredom as a moral failure.' },
        ],
        answer: 'B',
        explanation: '末段建议保留少量空白时间，观察大脑在不被投喂时做什么。',
      },
      {
        id: 'R1-q5',
        stem: 'Which statement would the author most likely agree with?',
        options: [
          { key: 'A', text: 'All boredom is healthy and pleasant.' },
          { key: 'B', text: 'A life without any emptiness may weaken deep attention.' },
          { key: 'C', text: 'Notifications improve the patience needed for long arguments.' },
          { key: 'D', text: 'Daydreaming has no relation to creativity.' },
        ],
        answer: 'B',
        explanation: '第三段指出：被设计成避开一切短暂空虚的生活，也可能避开注意力重置的条件。',
      },
    ],
  },
  {
    id: 'R2',
    title: '城市河流修复',
    year: '样题 · 仔细阅读',
    minutes: 15,
    passageTitle: 'Bringing Rivers Back to the City',
    passage: `For much of the twentieth century, urban rivers were treated as problems to be hidden. They were straightened, buried in concrete, or reduced to drainage channels that carried waste away from sight. The logic seemed obvious: a tidy city was a dry city, and water belonged at the margins. In recent decades that consensus has begun to crack.

City governments now face heat waves, sudden floods, and a public that wants something more than efficient traffic. Restored rivers offer a surprisingly practical response. Vegetation along a reopened waterway cools nearby streets. Floodplains that were once sealed under parking lots can absorb rainfall that would otherwise overwhelm drains. And a visible river, even a modest one, gives residents a reason to walk rather than drive for short errands.

Skeptics argue that restoration is an aesthetic luxury. Land in a dense city is scarce, they say, and a river park cannot house families or generate tax revenue as a tower can. The objection is not imaginary. Yet it treats land as if it had only one function at a time. A restored corridor can be a commute path in the morning, a playground in the afternoon, and a flood buffer on a stormy night. The economic question is not whether water has value, but how many kinds of value we are willing to count.

There is also a quieter social effect. When a buried stream is brought back, neighborhoods that had turned their backs on a concrete ditch begin to face one another across the water. Cafés appear. Evening walks become ordinary. None of this automatically repairs inequality, and poorly planned projects can raise rents and displace long-term residents. The lesson is not that rivers are magic. It is that infrastructure is never only technical. A city that conceals its water teaches people to treat nature as someone else’s problem. A city that makes room for a living river suggests a different civic habit: shared space, shared risk, and a slightly longer view of what a street is for.`,
    questions: [
      {
        id: 'R2-q1',
        stem: 'How were urban rivers mainly treated in the twentieth century?',
        options: [
          { key: 'A', text: 'They were carefully restored as public parks.' },
          { key: 'B', text: 'They were hidden, straightened, or turned into drains.' },
          { key: 'C', text: 'They were used mainly for passenger boats.' },
          { key: 'D', text: 'They were protected as sacred sites.' },
        ],
        answer: 'B',
        explanation: '首段：河流被拉直、埋入混凝土或变成排污渠道。',
      },
      {
        id: 'R2-q2',
        stem: 'Which is mentioned as a practical benefit of restored rivers?',
        options: [
          { key: 'A', text: 'They completely stop all heat waves.' },
          { key: 'B', text: 'They replace the need for any drainage system.' },
          { key: 'C', text: 'They can cool streets and absorb rainfall.' },
          { key: 'D', text: 'They guarantee lower rents in every neighborhood.' },
        ],
        answer: 'C',
        explanation: '第二段提到植被降温、洪泛区吸收雨水。',
      },
      {
        id: 'R2-q3',
        stem: 'What is the author’s response to the “aesthetic luxury” criticism?',
        options: [
          { key: 'A', text: 'The criticism is entirely false and should be ignored.' },
          { key: 'B', text: 'Land can serve several functions, so value should be counted more broadly.' },
          { key: 'C', text: 'Towers should never be built in any city.' },
          { key: 'D', text: 'Rivers have no economic value at all.' },
        ],
        answer: 'B',
        explanation: '第三段承认土地稀缺，但指出修复廊道可同时承担通勤、游乐和防洪等多重功能。',
      },
      {
        id: 'R2-q4',
        stem: 'What risk of poorly planned restoration does the author admit?',
        options: [
          { key: 'A', text: 'It may raise rents and displace long-term residents.' },
          { key: 'B', text: 'It will make evening walks impossible.' },
          { key: 'C', text: 'It always destroys cafés.' },
          { key: 'D', text: 'It hides water even more deeply.' },
        ],
        answer: 'A',
        explanation: '末段明确承认规划不当可能推高租金并挤走原住民。',
      },
      {
        id: 'R2-q5',
        stem: 'What civic lesson does the author draw in the end?',
        options: [
          { key: 'A', text: 'Infrastructure is purely a technical matter.' },
          { key: 'B', text: 'Nature should remain someone else’s problem.' },
          { key: 'C', text: 'Making room for a living river encourages shared space and a longer view.' },
          { key: 'D', text: 'Cities should conceal water to stay tidy.' },
        ],
        answer: 'C',
        explanation: '结尾：为活的河流腾出空间，意味着共享空间、共担风险，以及对街道用途的更长远看法。',
      },
    ],
  },
]

export const MATCHING: MatchingPaper[] = [
  {
    id: 'M1',
    title: '博物馆如何自我更新',
    year: '样题 · 段落匹配',
    theme: 'How Museums Are Reinventing Themselves',
    paragraphs: [
      {
        key: 'A',
        text: 'A generation ago, many museums still behaved like treasure rooms. Visitors were expected to move quietly, read brief labels, and accept the authority of the curator. Attendance was a civic duty more than a conversation. That model has not vanished, but it is no longer taken for granted.',
      },
      {
        key: 'B',
        text: 'One pressure is economic. Public funding has flattened in many cities, while the cost of climate control, security, and insurance has not. Museums that once relied on a stable subsidy now compete for tickets, members, and donors who expect a return in experience, not only in prestige.',
      },
      {
        key: 'C',
        text: 'Digital tools have changed the terms of that competition. A high-resolution scan of a painting can travel farther than the painting itself. Some directors feared that online access would empty the galleries. In practice, people who have studied an object on a screen often become more, not less, eager to stand in front of the original.',
      },
      {
        key: 'D',
        text: 'What online archives cannot replace is the social occasion. Families treat a weekend exhibition as a shared outing. Teenagers pose beside installations. The museum becomes a backdrop for being together, which used to be dismissed as a distraction and is now treated as part of the institution’s purpose.',
      },
      {
        key: 'E',
        text: 'This shift has forced curators to rethink labels. A paragraph of specialist language may be accurate and still fail. Newer displays offer layered information: a short plain-language card, a deeper text for those who want it, and sometimes an audio clip in several languages. The aim is not to dilute scholarship but to open more doors into it.',
      },
      {
        key: 'F',
        text: 'Community programs have grown for a similar reason. Workshops with local schools, evening hours for night-shift workers, and collecting projects that invite residents to donate stories all treat the audience as partners. Critics worry that this turns museums into community centers with art attached. Supporters reply that a museum without a living public is only a warehouse.',
      },
      {
        key: 'G',
        text: 'There is a harder debate about whose objects belong on the walls. Claims for restitution—especially of items taken during colonial campaigns—have moved from academic journals into courtrooms and headlines. Some museums have returned works; others argue that they can care for fragile pieces more safely than the communities of origin. The argument is unfinished, and it will not be settled by lighting design.',
      },
      {
        key: 'H',
        text: 'Architecture has become another public statement. New wings of glass and timber advertise openness. Older buildings, once proud of their temple-like stairs, now add ground-level entrances so that a visitor does not have to climb toward culture as if it were a throne. The building itself teaches a theory of access.',
      },
      {
        key: 'I',
        text: 'None of these changes is free of risk. Blockbuster shows can pay the bills and still flatten a collection into a sequence of famous names. Interactive screens can illuminate a craft process or simply keep hands busy. The measure of success is not how much technology is present, but whether a visitor leaves with a more precise curiosity than they brought in.',
      },
      {
        key: 'J',
        text: 'If there is a common thread, it is humility. The contemporary museum is less sure that it owns the last word. It still conserves objects, still argues for their importance, but it also admits that meaning is made with the public, not merely delivered to it. That admission is uncomfortable for institutions built on authority. It may also be the condition of their survival.',
      },
    ],
    items: [
      {
        id: 'M1-i1',
        text: 'Some people who see artworks online become more motivated to visit the real objects.',
        answer: 'C',
        explanation: 'C 段：屏幕上研究过的人往往更想见原作。',
      },
      {
        id: 'M1-i2',
        text: 'Museums now face tighter public money and rising operating costs.',
        answer: 'B',
        explanation: 'B 段讲公共拨款持平，而维护、安保和保险成本未降。',
      },
      {
        id: 'M1-i3',
        text: 'New labels try to offer different depths of information rather than one dense text.',
        answer: 'E',
        explanation: 'E 段描述分层说明：短卡片、深文本、多语音频。',
      },
      {
        id: 'M1-i4',
        text: 'Returning objects taken in the colonial period has become a public legal issue.',
        answer: 'G',
        explanation: 'G 段讨论 restitution，从期刊进入法庭与新闻。',
      },
      {
        id: 'M1-i5',
        text: 'A museum visit is increasingly valued as a chance for people to be together.',
        answer: 'D',
        explanation: 'D 段强调社交场合：家庭出游、合影，机构开始把“在一起”视为目的之一。',
      },
      {
        id: 'M1-i6',
        text: 'Building design can express a more welcoming idea of who may enter.',
        answer: 'H',
        explanation: 'H 段：玻璃新翼、底层入口，建筑本身在讲述一种准入理论。',
      },
      {
        id: 'M1-i7',
        text: 'The old museum model treated visitors as quiet receivers of curatorial authority.',
        answer: 'A',
        explanation: 'A 段：安静行走、接受策展权威，参观像公民义务。',
      },
      {
        id: 'M1-i8',
        text: 'Popular exhibitions and gadgets can still fail if they do not deepen curiosity.',
        answer: 'I',
        explanation: 'I 段：大展和互动屏都有风险，成功标准是离开时是否带着更精确的好奇。',
      },
      {
        id: 'M1-i9',
        text: 'Programs that invite local people in have sparked a debate about the museum’s identity.',
        answer: 'F',
        explanation: 'F 段：社区项目让观众成为伙伴，批评者担心变成社区中心。',
      },
      {
        id: 'M1-i10',
        text: 'Today’s museums are less confident that they alone decide what objects mean.',
        answer: 'J',
        explanation: 'J 段：当代博物馆不再确信自己握有最后解释权，意义与公众共同生成。',
      },
    ],
  },
]

export const TRANSLATION: TranslationPaper[] = [
  {
    id: 'T1',
    title: '中国高铁',
    year: '样题 · 翻译',
    source:
      '过去二十年，中国建成了世界上规模最大的高速铁路网。高铁不仅缩短了城市之间的旅行时间，也改变了人们的生活方式。许多人选择在一个城市工作，在另一个城市生活。便捷的交通促进了区域协调发展，也让更多旅客有机会欣赏沿途的风景。未来，高铁将与其他交通方式更好衔接，为绿色出行提供更有力的支撑。',
    keypoints: [
      '世界上规模最大的高速铁路网：the world’s largest high-speed rail network',
      '缩短旅行时间：shorten travel time between cities',
      '改变生活方式：change the way people live / lifestyles',
      '跨城工作与生活：work in one city and live in another',
      '区域协调发展：coordinated regional development',
      '与其他交通方式衔接：better connect with other forms of transport',
      '绿色出行：green / low-carbon travel',
    ],
    reference:
      'Over the past two decades, China has built the world’s largest high-speed rail network. High-speed trains have not only shortened travel time between cities but also changed the way people live. Many now choose to work in one city and live in another. Convenient transport has promoted coordinated regional development and given more travelers a chance to enjoy the scenery along the way. In the future, high-speed rail will be better connected with other forms of transport, providing stronger support for green travel.',
    notes:
      '注意“不仅……也……”用 not only... but also...；“选择在一个城市工作，在另一个城市生活”不必译成两个完整从句，用 work in one city and live in another 更干净。',
  },
  {
    id: 'T2',
    title: '中国茶文化',
    year: '样题 · 翻译',
    source:
      '茶在中国文化中占有独特地位。它既是日常饮料，也是待客与交际的方式。不同地区的茶艺各有特色，但都强调安静、礼节和对细节的关注。近年来，年轻人对传统茶馆和新型茶饮都表现出浓厚兴趣。这并非简单的怀旧，而是一种把传统带入当代生活的尝试。通过一杯茶，人们得以放慢节奏，与他人分享片刻宁静。',
    keypoints: [
      '占有独特地位：occupy a unique place',
      '待客与交际：hospitality and social life',
      '茶艺：tea ceremony / tea arts',
      '安静、礼节、细节：quiet, courtesy, attention to detail',
      '浓厚兴趣：keen interest',
      '并非简单的怀旧：not mere nostalgia',
      '把传统带入当代生活：bring tradition into contemporary life',
      '放慢节奏：slow down',
    ],
    reference:
      'Tea occupies a unique place in Chinese culture. It is both an everyday drink and a way of offering hospitality and keeping company. Tea arts vary from region to region, yet all of them stress quiet, courtesy, and attention to detail. In recent years, young people have shown keen interest in both traditional teahouses and new-style tea drinks. This is not mere nostalgia, but an attempt to bring tradition into contemporary life. Over a cup of tea, people can slow down and share a moment of calm with others.',
    notes:
      '“待客与交际”不要直译成 receive guests and communicate，用 hospitality 更地道。“这并非简单的怀旧”是典型六级转折，用 not mere nostalgia 很稳。',
  },
  {
    id: 'T3',
    title: '绿色发展',
    year: '样题 · 翻译',
    source:
      '绿色发展已经成为中国经济转型的重要方向。它要求在追求增长的同时保护生态环境，使经济发展与自然承受能力相适应。许多城市正在限制高污染产业，投资清洁能源，并鼓励公众选择公共交通。对企业而言，环保不再只是额外成本，而可能成为新的竞争力。只有把绿水青山真正视为财富，可持续发展才不会停留在口号上。',
    keypoints: [
      '经济转型：economic transformation',
      '与自然承受能力相适应：in line with what nature can bear',
      '限制高污染产业：restrict highly polluting industries',
      '清洁能源：clean energy',
      '公共交通：public transport',
      '竞争力：competitiveness',
      '绿水青山：lucid waters and lush mountains / clear waters and green mountains',
      '可持续发展：sustainable development',
      '停留在口号上：remain a slogan',
    ],
    reference:
      'Green development has become an important direction in China’s economic transformation. It requires us to protect the environment while pursuing growth, so that the economy stays in line with what nature can bear. Many cities are restricting highly polluting industries, investing in clean energy, and encouraging the public to choose public transport. For companies, environmental protection is no longer merely an extra cost; it may become a new source of competitiveness. Only when clear waters and green mountains are truly treated as wealth will sustainable development cease to remain a slogan.',
    notes:
      '“绿水青山”可译 clear waters and green mountains，不必强行用诗意长句。末句 Only when... will... 是六级翻译里很好用的倒装。',
  },
]

export const WRITING: WritingPaper[] = [
  {
    id: 'W1',
    title: '线上学习能否取代课堂',
    year: '样题 · 作文',
    prompt:
      'For this part, you are allowed 30 minutes to write an essay on whether online learning can replace classroom teaching. You should write at least 150 words but no more than 200 words.',
    outline: [
      '开头：点出现象，提出自己的立场（取代不了 / 只能补充）。',
      '主体：课堂的不可替代处（即时交流、同伴压力、教师观察）+ 线上的真实优势（灵活、回放）。',
      '结尾：折中收束，强调混合，而不是二选一。',
    ],
    sample: `Online courses have grown familiar, and some people now ask whether the classroom has become optional. I do not think so. Digital lessons can complement a class; they cannot fully replace it.

A classroom is not only a place where information is delivered. It is a social arrangement. Students hesitate, interrupt, and watch one another try. A teacher can see confusion on a face and change pace at once. These small adjustments are hard to copy on a screen, however well a platform is designed. At the same time, it would be stubborn to deny the strengths of online learning. Recorded lectures let students replay a difficult proof. Flexible hours help those who work part-time. Used this way, the screen is a tool, not a rival.

The more useful question, then, is not which side wins, but how the two can share the week. A lecture watched at night and a seminar held in the morning may serve students better than either form alone. Technology should widen the room for learning, not empty it.`,
    rubric: [
      { name: '内容', desc: '有明确立场，两边都说到，不是空喊口号。' },
      { name: '结构', desc: '三段清楚：现象+论点，论证，收束。' },
      { name: '语言', desc: '少中式英语，注意 complement / replace / stubborn 这类词的准确使用。' },
    ],
  },
  {
    id: 'W2',
    title: '大学生是否应尽早规划职业',
    year: '样题 · 作文',
    prompt:
      'For this part, you are allowed 30 minutes to write an essay on whether college students should plan their careers as early as possible. You should write at least 150 words but no more than 200 words.',
    outline: [
      '开头：承认焦虑，提出“早规划，但保持弹性”。',
      '主体：早规划的好处（实习、课程选择）+ 过早锁死的坏处（错过转向）。',
      '结尾：规划是草稿，不是判决书。',
    ],
    sample: `Career talks begin almost as soon as students arrive on campus, and the pressure to choose a path can feel urgent. Early planning is useful; treating that plan as a final verdict is not.

Students who know, even roughly, what they want can choose courses and internships with more purpose. They waste fewer summers and write clearer applications. In that sense, an early sketch is a form of self-respect. Yet a sketch should remain a sketch. Many eighteen-year-olds have not met the work that will later matter to them. A plan that cannot be amended becomes a cage, and anxiety about “falling behind” may close doors that were still open.

A healthier habit is to review the plan once a term, the way one reviews a budget. Keep a direction, test it against real experience, and leave room to change. The aim of a college career plan is not to predict the future with certainty. It is to make the next decision a little less blind.`,
    rubric: [
      { name: '内容', desc: '不要只写“应该规划”，要写出“规划到什么程度”。' },
      { name: '结构', desc: '利弊都有，最后给出可执行的态度。' },
      { name: '语言', desc: '注意 verdict / amend / sketch 等词，避免 I think I think 叠句。' },
    ],
  },
  {
    id: 'W3',
    title: '公共场合使用手机',
    year: '样题 · 作文',
    prompt:
      'For this part, you are allowed 30 minutes to write an essay on the use of mobile phones in public places. You should write at least 150 words but no more than 200 words.',
    outline: [
      '开头：描述现象，提出需要边界，而不是禁令。',
      '主体：手机的正当用途（紧急联络、导航）+ 公共空间被侵占的代价（注意力、礼貌）。',
      '结尾：规则应针对场合，而不是针对设备本身。',
    ],
    sample: `It is now ordinary to see a row of people in a waiting room, each lit by a private screen. Mobile phones are not the enemy of public life, but they have made courtesy harder to take for granted.

There are legitimate reasons to keep a phone at hand. A message from family, a map in a strange station, or a sudden change of plan can all justify a glance. The problem begins when the glance becomes the whole visit: speakerphone conversations on a bus, videos in a quiet carriage, or a dinner at which nobody looks up. Shared space depends on a modest fiction—that strangers will not force their noise and light on one another. When that fiction collapses, public places feel smaller.

Rules should follow the setting. A library is not a platform; a park bench is not a studio. Phones can stay, if attention can still be lent, at least sometimes, to the people and rooms we actually inhabit.`,
    rubric: [
      { name: '内容', desc: '要具体场景，不要只会写 scientific and technological development。' },
      { name: '结构', desc: '先让步承认正当用途，再谈边界。' },
      { name: '语言', desc: 'courtesy / legitimate / fiction 这类词比 lots of people use phones 更有六级感。' },
    ],
  },
]

export const MODULES: {
  id: import('../types').ModuleId
  title: string
  en: string
  desc: string
  count: number
}[] = [
  { id: 'listening', title: '听力精听', en: 'Listening', desc: '对话 / 讲座 · 逐句跟听与听写', count: LISTENING.length },
  { id: 'reading', title: '阅读精做', en: 'Reading', desc: '仔细阅读 · 定位与错因', count: READING.length },
  { id: 'matching', title: '段落匹配', en: 'Matching', desc: '信息匹配 · 一段一义', count: MATCHING.length },
  { id: 'translation', title: '翻译精做', en: 'Translation', desc: '汉译英 · 采分点对照', count: TRANSLATION.length },
  { id: 'writing', title: '作文练习', en: 'Writing', desc: '议论文 · 提纲与范文', count: WRITING.length },
]
