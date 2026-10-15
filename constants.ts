import { Emotion, Scene, ComfortScript } from './types';

// Mock Data based on the Credit Card Loss Scenario

export const MOCK_EMOTIONS: Emotion[] = [
  { id: 'emo1', name: '烦躁', type: 'NEGATIVE', description: '用户表现出不耐烦、急躁的情绪', status: 'ACTIVE', createTime: '2023-11-01 10:00:00' },
  { id: 'emo2', name: '生气', type: 'NEGATIVE', description: '用户表现出愤怒、不满的情绪', status: 'ACTIVE', createTime: '2023-11-01 10:05:00' },
  { id: 'emo3', name: '着急', type: 'NEGATIVE', description: '用户表现出急迫、焦虑的情绪', status: 'ACTIVE', createTime: '2023-11-01 10:10:00' },
  { id: 'emo4', name: '委屈', type: 'NEGATIVE', description: '用户感到受委屈、不公', status: 'ACTIVE', createTime: '2023-11-01 10:15:00' },
  { id: 'emo5', name: '恐慌', type: 'NEGATIVE', description: '用户感到害怕、恐慌（如资金安全受威胁）', status: 'ACTIVE', createTime: '2023-11-01 10:20:00' },
  { id: 'emo6', name: '失望', type: 'NEGATIVE', description: '用户对服务或产品感到失望', status: 'ACTIVE', createTime: '2023-11-01 10:25:00' },
  { id: 'emo7', name: '不信任', type: 'NEGATIVE', description: '用户对客服或银行产生怀疑', status: 'ACTIVE', createTime: '2023-11-01 10:30:00' },
  { id: 'emo8', name: '无奈', type: 'NEGATIVE', description: '用户感到没有办法、妥协', status: 'ACTIVE', createTime: '2023-11-01 10:35:00' },
  { id: 'emo9', name: '失控', type: 'NEGATIVE', description: '用户情绪极度激动、无法沟通', status: 'ACTIVE', createTime: '2023-11-01 10:40:00' },
  { id: 'emo10', name: '投诉', type: 'NEGATIVE', description: '用户明确提出投诉', status: 'ACTIVE', createTime: '2023-11-01 10:45:00' },
  { id: 'emo11', name: '平静', type: 'NEUTRAL', description: '用户情绪平稳，正常沟通', status: 'ACTIVE', createTime: '2023-11-01 11:00:00' },
  { id: 'emo12', name: '满意', type: 'POSITIVE', description: '用户对服务表示认可', status: 'ACTIVE', createTime: '2023-11-01 11:05:00' },
  { id: 'emo13', name: '感谢', type: 'POSITIVE', description: '用户表达谢意', status: 'ACTIVE', createTime: '2023-11-01 11:10:00' },
  { id: 'emo14', name: '幽默/轻松', type: 'POSITIVE', description: '用户表现出轻松、开玩笑的态度', status: 'ACTIVE', createTime: '2023-11-01 11:15:00' }
];

export const SCENE_CATEGORIES = [
  '交易类/转账',
  '交易类/支付',
  '交易类/充值',
  '账户类/登录',
  '账户类/注册',
  '账户类/密码管理',
  '理财类/理财购买',
  '理财类/理财赎回',
  '理财类/收益查询',
  '信用卡类/账单查询',
  '信用卡类/还款',
  '信用卡类/额度管理'
];

export const MOCK_SCENES: Scene[] = [
  {
    id: 'scn1',
    name: '大额转账失败',
    categoryId: '交易类/转账',
    description: '用户尝试进行大额转账但因为额度限制或风控原因失败的场景',
    status: 'ACTIVE',
    createTime: '2023-11-02 10:00:00'
  },
  {
    id: 'scn2',
    name: '密码连续输错锁定',
    categoryId: '账户类/密码管理',
    description: '用户连续输错密码导致账户被临时锁定的场景',
    status: 'ACTIVE',
    createTime: '2023-11-02 11:00:00'
  },
  {
    id: 'scn3',
    name: '系统登录异常',
    categoryId: '账户类/登录',
    description: '用户登录系统时遇到异常',
    status: 'ACTIVE',
    createTime: '2023-11-03 09:00:00'
  },
  {
    id: 'scn4',
    name: '转账失败异常',
    categoryId: '交易类/转账',
    description: '用户转账失败',
    status: 'ACTIVE',
    createTime: '2023-11-03 09:10:00'
  }
];

export const MOCK_COMFORT_SCRIPTS: ComfortScript[] = [
  {
    id: 'cs1',
    categoryId: '账户类/登录',
    sceneId: 'scn3',
    emotionId: 'emo1',
    scriptType: '致歉类',
    scripts: [
      "非常抱歉，由于我们系统这边出现异常，给您转账造成了麻烦，耽误您的时间了，真的对不起。",
      "这是我们系统的问题，给您带来这么大的不便，我代表银行向您诚恳致歉。",
      "您别怪我这么说，确实是我们这边登录环节出了状况，让您着急转账却进不去，这是我的责任，先跟您说声对不起。"
    ],
    createTime: '2023-11-03 10:00:00'
  },
  {
    id: 'cs2',
    categoryId: '账户类/登录',
    sceneId: 'scn3',
    emotionId: 'emo3',
    scriptType: '共情类',
    scripts: [
      "我完全理解您现在的心情，转账本来就是急事，换作是谁被卡在登录这一步，都会非常着急。",
      "您别上火，我懂您急着用钱/付款，结果系统不给力，换我我也得急。",
      "我知道您不是对客服有意见，是真的事情耽误不得，您这份着急我特别能体会。"
    ],
    createTime: '2023-11-03 10:05:00'
  },
  {
    id: 'cs3',
    categoryId: '账户类/登录',
    sceneId: 'scn3',
    emotionId: 'emo5',
    scriptType: '稳控类',
    scripts: [
      "您先别着急，我就在线上陪着您，咱们一步步来，我一定帮您找到登录的办法。",
      "您先深呼吸一下，我这边已经在看您的账户情况了，不会让您一个人干着急。",
      "您放心，不管系统什么状态，我一直在线，您不是一个人在等，我来帮您处理。"
    ],
    createTime: '2023-11-03 10:10:00'
  },
  {
    id: 'cs4',
    categoryId: '账户类/登录',
    sceneId: 'scn3',
    emotionId: 'emo1',
    scriptType: '承诺类',
    scripts: [
      "您放心，这件事我来负责到底，就算系统一时恢复不了，我也会帮您通过其他方式完成转账。",
      "我向您承诺：今天一定帮您解决登录问题，如果系统修不好，我亲自对接后台或引导您用人工/电话银行转账。",
      "您不用再反复尝试了，我现在就接手您的问题，最快XX分钟内给您一个可操作的解决方案，转账不会耽误。"
    ],
    createTime: '2023-11-03 10:15:00'
  },
  {
    id: 'cs5',
    categoryId: '交易类/转账',
    sceneId: 'scn4',
    emotionId: 'emo2',
    scriptType: '致歉类',
    scripts: [
      "非常抱歉，这次转账没能成功，给您用钱造成了麻烦，这是我们系统/流程的问题，真的对不起。",
      "转账失败确实是我们这边需要承担的责任，耽误您正事了，我先向您诚恳致歉。",
      "您别生气，我承认是我们的问题导致转账没有完成，给您带来这么大不便，非常过意不去。"
    ],
    createTime: '2023-11-03 10:20:00'
  },
  {
    id: 'cs6',
    categoryId: '交易类/转账',
    sceneId: 'scn4',
    emotionId: 'emo3',
    scriptType: '共情类',
    scripts: [
      "我完全理解您现在的心情，钱转不出去，换谁都会着急上火，尤其是等着用钱的时候。",
      "您别太焦虑，我懂您这笔钱肯定是有急用，结果卡在最后一步，换我我也受不了。",
      "我知道您不是对银行有意见，是真的事情耽误不得，您这份着急我特别能体会。"
    ],
    createTime: '2023-11-03 10:25:00'
  },
  {
    id: 'cs7',
    categoryId: '交易类/转账',
    sceneId: 'scn4',
    emotionId: 'emo5',
    scriptType: '稳控类',
    scripts: [
      "您先别着急，我就在线上陪着您，咱们一起把转账失败的原因查清楚，不会让您一个人干等着。",
      "您先缓一缓，我这边已经在核实这笔转账的状态了，钱不会丢，我来帮您处理。",
      "您放心，不管是什么原因导致的失败，我一直在线，咱们一步步解决，肯定不让您耽误用钱。"
    ],
    createTime: '2023-11-03 10:30:00'
  },
  {
    id: 'cs8',
    categoryId: '交易类/转账',
    sceneId: 'scn4',
    emotionId: 'emo1',
    scriptType: '承诺类',
    scripts: [
      "您放心，这笔转账我来负责到底，今天一定帮您把钱成功转出去。",
      "我向您承诺：转账失败的问题我会全程跟进，如果线上走不通，我会帮您通过其他方式完成转账。",
      "您不用再反复尝试了，我现在就接手您的问题，最快XX分钟内给您一个明确的解决方案，钱一定到账。"
    ],
    createTime: '2023-11-03 10:35:00'
  }
];

export const RECOMMEND_CATEGORIES = [
  '默认', '信用卡挂失', '信用卡申请进度查询', '公共核身', '信用卡客户资料修改',
  '信用卡激活', '情绪话术-YLPOC勿删', '意图话术-YLPOC勿删', '正则表达式话术--YLPOC勿删',
  '投诉安抚话术', '盗刷投诉'
];

export const MOCK_RECOMMEND_SCRIPTS: any[] = [
  {
    id: 'rec_1', displayId: 'HS_P6R8S9', name: '身份核实话术', categoryId: '公共核身',
    creator: '王五6028', updateTime: '2025-06-24 10:47:21', status: 'ACTIVE',
    content: '请问您是本人吗？', linkName: '', linkUrl: '' // intentId and emotionId optional
  },
  {
    id: 'rec_2', displayId: 'HS_38I5XX', name: '信用卡挂失-身份核实-通过', categoryId: '信用卡挂失',
    creator: '王五6028', updateTime: '2025-06-24 10:37:32', status: 'ACTIVE',
    content: '身份核实已通过，马上为您办理。'
  },
  {
    id: 'rec_3', displayId: 'HS_EOPUK4', name: '信用卡挂失-身份核身不通过', categoryId: '信用卡挂失',
    creator: '王五6028', updateTime: '2025-06-24 10:38:05', status: 'ACTIVE',
    content: '很抱歉，身份核实未通过，为保障您的账户安全，建议您前往柜台。'
  },
  {
    id: 'rec_4', displayId: 'HS_1MNKVG', name: '信用卡挂失-卡信息查询', categoryId: '信用卡挂失',
    creator: '王五6028', updateTime: '2026-03-27 06:56:37', status: 'INACTIVE',
    content: '正在查询您的信用卡信息，请稍候。'
  },
  {
    id: 'rec_5', displayId: 'HS_RSQW0K', name: '信用卡挂失-卡信息查询-异常', categoryId: '信用卡挂失',
    creator: '王五6028', updateTime: '2026-03-27 06:56:32', status: 'INACTIVE',
    content: '查询信息时出现异常，请稍后再试。'
  }
];

export const INTENT_CATEGORIES = [
  { id: '1', name: '全部意图', count: 35 },
  { id: '2', name: '信用卡', count: 12 },
  { id: '3', name: '储蓄卡', count: 0 },
  { id: '4', name: '个人信贷', count: 0 },
  { id: '5', name: '投资理财', count: 0 },
  { id: '6', name: '手机银行', count: 1 },
  { id: '7', name: '投诉与建议', count: 2 },
  { id: '8', name: '账户管理', count: 0 },
  { id: '9', name: '借记卡', count: 1 },
  { id: '10', name: '确认信息', count: 0 },
  { id: '11', name: '中国银联', count: 19 }
];

export const MOCK_PROMPT_SCENARIOS = [
  '工单摘要',
  '意图识别',
  '情绪识别',
  '客服质检',
  '对话引导'
];

export const MOCK_SCENARIO_VARIABLES: Record<string, {name: string, value: string, desc: string, type?: string}[]> = {
  '工单摘要': [
    { name: '对话内容', value: '{{input}}', desc: '对话内容', type: '用户变量' },
    { name: '当前时间', value: '{{timestamp}}', desc: '当前时间', type: '系统变量' }
  ],
  '意图识别': [
    { name: '用户消息', value: '{{message}}', desc: '用户发送的消息内容', type: '用户变量' }
  ],
  '默认': []
};

export const MOCK_PROMPTS: any[] = [
  {
    id: 'p1',
    name: '客户支持与风险管理',
    model: 'qwen3-30b-a3b',
    businessScenario: '工单摘要',
    content: '# 任务目标 将通话记录转化为符合行业规范的通话小结段落，要求为纯文本叙述。\\n\\n# 通话记录\\n{{input}}\\n\\n# 当前时间\\n{{timestamp}}\\n\\n# 输出规则...',
    description: '',
    status: 'ACTIVE',
    updateTime: '2026-06-01 14:51:04',
    creator: '系统管理员',
    version: 'V2.4'
  },
  {
    id: 'p2',
    name: '贷款与分期服务',
    model: 'qwen3-30b-a3b',
    businessScenario: '工单摘要',
    content: '# 任务目标 将通话记录转化为符合行业规范的通话小结段落，要求为纯文本叙述且不出现任何标记符号。\\n\\n# 通话记录\\n{{input}}\\n\\n# 当前时间\\n{{timestamp}}\\n\\n# 输出格式 客户MM月dd日来...',
    description: '根据湖南反馈意见调整的版本',
    status: 'ACTIVE',
    updateTime: '2026-05-13 09:47:48',
    creator: 'xiaobei',
    version: 'V1.8'
  },
  {
    id: 'p3',
    name: '其他',
    model: 'qwen3-30b-a3b',
    businessScenario: '工单摘要',
    content: '# 任务目标 将通话记录转化为符合行业规范的通话小结段落，要求为纯文本叙述且不出现任何标记符号。\\n\\n# 通话记录\\n{{input}}\\n\\n# 当前时间\\n{{timestamp}}\\n\\n# 输出格式 客户MM月dd日来...',
    description: '',
    status: 'ACTIVE',
    updateTime: '2026-04-14 15:38:40',
    creator: '系统管理员',
    version: 'V1.0'
  },
  {
    id: 'p4',
    name: '信用卡服务',
    model: 'qwen3-30b-a3b',
    businessScenario: '工单摘要',
    content: '# 任务目标 将通话记录转化为符合行业规范的通话小结段落，要求为纯文本叙述且不出现任何标记符号。\\n\\n# 通话记录\\n{{input}}\\n\\n# 当前时间\\n{{timestamp}}\\n\\n# 输出格式 客户MM月dd日来...',
    description: '',
    status: 'ACTIVE',
    updateTime: '2026-04-14 15:39:39',
    creator: '系统管理员',
    version: 'V1.0'
  },
  {
    id: 'p5',
    name: '账户与电子服务',
    model: 'qwen3-30b-a3b',
    businessScenario: '工单摘要',
    content: '# 任务目标 将通话记录转化为符合行业规范的通话小结段落，要求为纯文本叙述且不出现任何标记符号。\\n\\n# 通话记录\\n{{input}}\\n\\n# 当前时间\\n{{timestamp}}\\n\\n# 输出格式 客户MM月dd日来...',
    description: '',
    status: 'ACTIVE',
    updateTime: '2026-04-14 15:39:53',
    creator: '系统管理员',
    version: 'V1.0'
  },
  {
    id: 'p6',
    name: 'local-工单摘要总结-表扬场景',
    model: 'qwen3-30b-a3b',
    businessScenario: '工单摘要',
    content: '# Role: 银行业客户表扬记录生成助手（正向服务事件版）\\n\\n## Profile - description: 根据银行客户来电或留言内容，以及输入的当前时间，生成一份完整、合规、书面化的“客户表扬小...',
    description: '',
    status: 'ACTIVE',
    updateTime: '2026-04-14 15:40:37',
    creator: '系统管理员',
    version: 'V1.0'
  },
  {
    id: 'p7',
    name: 'local-工单摘要总结-建议场景',
    model: 'qwen3-30b-a3b',
    businessScenario: '工单摘要',
    content: '# Role: 银行业客户建议类通话小结生成助手（以改进建议为核心）\\n\\n## Profile - description: 根据银行客户与客服的通话或聊天记录，以及输入的当前时间，生成一份完整、合规、书...',
    description: '',
    status: 'ACTIVE',
    updateTime: '2026-04-14 15:41:00',
    creator: '系统管理员',
    version: 'V1.0'
  },
  {
    id: 'p8',
    name: 'local-工单摘要总结-投诉场景',
    model: 'qwen3-30b-a3b',
    businessScenario: '工单摘要',
    content: '# Role: 银行业客户投诉类工单小结生成助手\\n\\n## Profile - description: 专用于生成银行客户投诉客服或客户经理类事件的小结。模型应准确识别投诉对象（支行+人员姓名+职位）...',
    description: '',
    status: 'ACTIVE',
    updateTime: '2026-04-14 15:41:05',
    creator: '系统管理员',
    version: 'V1.0'
  }
];

export const MOCK_INTENT_RECORDS: any[] = [
  {
    id: '1934853943475',
    name: '解锁冻结账户',
    categoryId: '信用卡',
    description: '处理用户信用卡账户被冻结的情况，需求解锁。',
    intentType: '意图路由',
    keywords: ['解锁', '冻结', '解冻账户'],
    cases: ['我的信用卡怎么被冻结了，能帮我解开吗？'],
    slots: [{ name: '卡号后四位', description: '待解锁的卡号后四位', entityId: 'ent_r2' }],
    thoughtProcess: '用户反映账户无法使用，经查为风控冻结...',
    creator: '系统管理员',
    status: 'ACTIVE',
    createTime: '2025-06-17 14:01:43'
  },
  {
    id: '1935536855520',
    name: '信用卡账单地址...',
    categoryId: '信用卡',
    description: '修改信用卡的账单寄送地址',
    intentType: '意图路由',
    keywords: ['修改地址', '账单地址'],
    cases: ['我想改一下每月的账单寄送地址。'],
    slots: [{ name: '新地址', description: '用户更新后的账单地址', entityId: 'ent_r9' }],
    thoughtProcess: '用户搬家后需要更新地址...',
    creator: '系统管理员',
    status: 'ACTIVE',
    createTime: '2025-06-19 11:15:22'
  },
  {
    id: '1937396815829',
    name: '确认信息',
    categoryId: '信用卡',
    description: '核对客户个人信息是否准确',
    intentType: '直接输出',
    keywords: ['确认信息', '身份核实'],
    cases: ['这是我的身份证号，你核对一下。'],
    slots: [{ name: '身份证号', description: '用于核身校验的身份证号', entityId: 'ent_r7' }],
    thoughtProcess: '核身流程必要步骤...',
    creator: '王五6028',
    status: 'ACTIVE',
    createTime: '2025-06-24 14:26:11'
  },
  {
    id: '1937397002195',
    name: '否认信息',
    categoryId: '信用卡',
    description: '客户否认某些交易或操作',
    intentType: '意图路由',
    keywords: ['不是我刷的', '否认交易', '盗刷'],
    cases: ['刚才那笔钱不是我花的！'],
    slots: [
      { name: '交易金额', description: '被否认的交易金额', entityId: 'ent_r5' },
      { name: '交易时间', description: '被否认的交易发生时间', entityId: 'ent_r6' }
    ],
    thoughtProcess: '疑似盗刷的情况，需要转人工或进入调查流...',
    creator: '系统管理员',
    status: 'ACTIVE',
    createTime: '2025-06-24 14:26:55'
  },
  {
    id: '1937403405819',
    name: '信用卡挂失',
    categoryId: '信用卡',
    description: '客户实体卡丢失，申请挂失',
    intentType: '直接输出',
    keywords: ['挂失', '卡丢了', '停用'],
    cases: ['我的卡掉了，怎么挂失？'],
    slots: [{ name: '卡后四位', description: '挂失信用卡的后四位数字', entityId: 'ent_r2' }],
    thoughtProcess: '标准挂失操作...',
    creator: '王五6028',
    status: 'ACTIVE',
    createTime: '2025-06-24 14:52:22'
  },
  {
    id: '1937403405820',
    name: '账户余额查询',
    categoryId: '储蓄卡',
    description: '查询客户储蓄卡当前余额',
    intentType: '意图路由',
    keywords: ['查余额', '剩多少钱', '余额'],
    cases: ['帮我查一下卡里还有多少钱'],
    slots: [{ name: '账户类型', description: '待查询的账户类型', entityId: 'unknown_account_type' }],
    thoughtProcess: '查询余额流程...',
    creator: '系统管理员',
    status: 'ACTIVE',
    createTime: '2025-06-25 09:00:00'
  }
];

export const MOCK_LOGS: any[] = [
  { id: '1', sessionId: 'R1_5002_6a228c38_5002', channel: '语音通话', startTime: '2026-06-05 16:43:55', endTime: '2026-06-05 16:47:59', evaluationStatus: 'NONE', taggingStatus: 'UNTAGGED' },
  { id: '2', sessionId: 'R1_5002_6a227ffa_5002', channel: '语音通话', startTime: '2026-06-05 15:51:52', endTime: '2026-06-05 15:53:00', evaluationStatus: 'EVALUATED', taggingStatus: 'TAGGED' },
  { id: '3', sessionId: 'R1_5001_6a226d8e_5001', channel: '语音通话', startTime: '2026-06-05 14:33:18', endTime: '2026-06-05 14:37:02', evaluationStatus: 'FAILED', taggingStatus: 'REVIEWING' },
  { id: '4', sessionId: 'R1_5002_6a226806_5002', channel: '语音通话', startTime: '2026-06-05 14:09:43', endTime: '2026-06-05 14:16:15', evaluationStatus: 'EVALUATING', taggingStatus: 'UNTAGGED' },
  { id: '5', sessionId: 'R1_5001_6a223ab2_5001', channel: '语音通话', startTime: '2026-06-05 10:56:05', endTime: '2026-06-05 10:56:21', evaluationStatus: 'NONE', taggingStatus: 'UNTAGGED' },
  { id: '6', sessionId: 'R1_5001_6a223084_5001', channel: '语音通话', startTime: '2026-06-05 10:12:44', endTime: '2026-06-05 10:12:59', evaluationStatus: 'NONE', taggingStatus: 'UNTAGGED' },
  { id: '7', sessionId: 'R1_5002_6a22302c_5002', channel: '语音通话', startTime: '2026-06-05 10:11:11', endTime: '2026-06-05 10:11:33', evaluationStatus: 'NONE', taggingStatus: 'UNTAGGED' },
  { id: '8', sessionId: 'R1_5002_6a2143cc_5002', channel: '语音通话', startTime: '2026-06-04 17:22:53', endTime: '2026-06-04 17:24:06', evaluationStatus: 'NONE', taggingStatus: 'UNTAGGED' },
  { id: '9', sessionId: 'R1_5001_6a212eae_5001', channel: '语音通话', startTime: '2026-06-04 15:52:45', endTime: '2026-06-04 15:57:00', evaluationStatus: 'NONE', taggingStatus: 'UNTAGGED' },
  { id: '10', sessionId: 'R1_5002_6a212641_5002', channel: '语音通话', startTime: '2026-06-04 15:17:09', endTime: '', evaluationStatus: 'NONE', taggingStatus: 'UNTAGGED' },
  { id: '11', sessionId: 'R1_5001_6a21260c_5001', channel: '语音通话', startTime: '2026-06-04 15:15:55', endTime: '2026-06-04 15:16:05', evaluationStatus: 'NONE', taggingStatus: 'UNTAGGED' },
];

export const ENTITY_CATEGORIES = [
  { id: '1', name: '全部实体', count: 15 },
  { id: '2', name: '公共实体', count: 5 },
  { id: '3', name: '业务实体', count: 10 }
];

export const MOCK_ENTITIES: any[] = [
  // 规则
  { id: 'ent_r1', name: '卡号', code: 'card_no', categoryId: '业务实体', description: '识别完整的信用卡号', entityType: '规则', values: [], synonyms: [], creator: '系统', status: 'ACTIVE', createTime: '2025-06-17 10:00:00' },
  { id: 'ent_r2', name: '卡尾号', code: 'card_last4', categoryId: '业务实体', description: '识别卡号后四位', entityType: '规则', values: [], synonyms: [], creator: '系统', status: 'ACTIVE', createTime: '2025-06-17 10:01:00' },
  { id: 'ent_r3', name: '手机号', code: 'phone', categoryId: '业务实体', description: '识别手机号码', entityType: '规则', values: [], synonyms: [], creator: '系统', status: 'ACTIVE', createTime: '2025-06-17 10:02:00' },
  { id: 'ent_r4', name: '验证码', code: 'verify_code', categoryId: '业务实体', description: '识别短信验证码', entityType: '规则', values: [], synonyms: [], creator: '系统', status: 'ACTIVE', createTime: '2025-06-17 10:03:00' },
  { id: 'ent_r5', name: '金额', code: 'amount', categoryId: '业务实体', description: '识别交易金额', entityType: '规则', values: [], synonyms: [], creator: '系统', status: 'ACTIVE', createTime: '2025-06-17 10:04:00' },
  { id: 'ent_r6', name: '时间', code: 'date', categoryId: '业务实体', description: '识别日期时间', entityType: '规则', values: [], synonyms: [], creator: '系统', status: 'ACTIVE', createTime: '2025-06-17 10:05:00' },
  { id: 'ent_r7', name: '身份证', code: 'id_card', categoryId: '业务实体', description: '识别身份证号', entityType: '规则', values: [], synonyms: [], creator: '系统', status: 'ACTIVE', createTime: '2025-06-17 10:06:00' },
  { id: 'ent_r8', name: '邮箱', code: 'email', categoryId: '业务实体', description: '识别电子邮箱地址', entityType: '规则', values: [], synonyms: [], creator: '系统', status: 'ACTIVE', createTime: '2025-06-17 10:07:00' },
  { id: 'ent_r9', name: '地址', code: 'address', categoryId: '业务实体', description: '识别详细居住或邮寄地址', entityType: '规则', values: [], synonyms: [], creator: '系统', status: 'ACTIVE', createTime: '2025-06-17 10:08:00' },
  
  // 词库
  { id: 'ent_t1', name: '机构名', code: 'org', categoryId: '业务实体', description: '识别银行机构名称', entityType: '词库', values: ['中国银行', '工商银行', '建设银行'], synonyms: [], creator: '系统管理员', status: 'ACTIVE', createTime: '2025-06-17 10:10:00', thesaurusItems: [
    { id: 't1_1', content: '中国银行', aliases: ['中行', 'BOC'], updater: 'xiaohei', updateTime: '2026-07-14 10:49:36' },
    { id: 't1_2', content: '工商银行', aliases: ['工行', 'ICBC'], updater: 'xiaohei', updateTime: '2026-07-14 10:49:30' },
    { id: 't1_3', content: '建设银行', aliases: ['建行', 'CCB'], updater: 'xiaohei', updateTime: '2026-07-14 10:49:23' }
  ]},
  { id: 'ent_t2', name: '网点', code: 'branch', categoryId: '业务实体', description: '识别具体网点名称', entityType: '词库', values: ['中关村支行', '陆家嘴支行'], synonyms: [], creator: '系统管理员', status: 'ACTIVE', createTime: '2025-06-17 10:11:00', thesaurusItems: [
    { id: 't2_1', content: '中关村支行', aliases: ['中关村网点'], updater: 'xiaohei', updateTime: '2026-07-14 10:49:17' },
    { id: 't2_2', content: '陆家嘴支行', aliases: ['陆家嘴网点'], updater: 'xiaohei', updateTime: '2026-07-14 10:49:09' }
  ]},
  { id: 'ent_t3', name: '卡产品', code: 'product', categoryId: '业务实体', description: '识别信用卡产品系列', entityType: '词库', values: ['标准金卡', '全币种卡'], synonyms: [], creator: '系统管理员', status: 'ACTIVE', createTime: '2025-06-17 10:12:00', thesaurusItems: [
    { id: 't3_1', content: '标准金卡', updater: 'xiaohei', updateTime: '2026-07-14 10:49:01' },
    { id: 't3_2', content: '全币种卡', updater: 'xiaohei', updateTime: '2026-07-14 10:48:53' }
  ]},
  { id: 'ent_t4', name: '业务词', code: 'biz', categoryId: '业务实体', description: '识别业务相关关键词', entityType: '词库', values: ['挂失', '补办', '销户'], synonyms: [], creator: '系统管理员', status: 'ACTIVE', createTime: '2025-06-17 10:13:00', thesaurusItems: [
    { id: 't4_1', content: '挂失', updater: 'xiaohei', updateTime: '2026-07-14 10:48:46' },
    { id: 't4_2', content: '补办', updater: 'xiaohei', updateTime: '2026-07-14 10:48:38' },
    { id: 't4_3', content: '销户', updater: 'xiaohei', updateTime: '2026-07-14 10:48:30' }
  ]},
  { id: 'ent_t5', name: '渠道', code: 'channel', categoryId: '业务实体', description: '识别服务渠道', entityType: '词库', values: ['手机银行', '网点', '电话'], synonyms: [], creator: '系统管理员', status: 'ACTIVE', createTime: '2025-06-17 10:14:00', thesaurusItems: [
    { id: 't5_1', content: '手机银行', updater: 'xiaohei', updateTime: '2026-07-14 10:48:22' },
    { id: 't5_2', content: '网点', updater: 'xiaohei', updateTime: '2026-07-14 10:48:15' },
    { id: 't5_3', content: '电话', updater: 'xiaohei', updateTime: '2026-07-14 10:48:08' }
  ]}
];