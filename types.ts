
export interface Emotion {
  id: string;
  name: string;
  type: 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE';
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  createTime: string;
  comfortScript?: string;
}

export interface Scene {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  createTime: string;
}

export interface ComfortScript {
  id: string;
  categoryId?: string;
  sceneId?: string;
  emotionId?: string;
  scriptType: '致歉类' | '共情类' | '稳控类' | '承诺类';
  scripts: string[];
  createTime: string;
}

export interface EmotionScript {
  emotionId: string;
  script: string;
}

export interface ScriptRecommend {
  id: string;
  displayId: string;
  name: string;
  categoryId: string;
  creator: string;
  updateTime: string;
  status: 'ACTIVE' | 'INACTIVE';
  content: string;
  linkName?: string;
  linkUrl?: string;
  intentIds?: string[];
  emotionScripts?: EmotionScript[];
}

export interface Slot {
  name: string;
  description: string;
  entityId: string;
}

export interface Intent {
  id: string; // 意图Id
  name: string; // 意图名称
  categoryId: string; // 所属分类
  description: string; // 意图描述
  intentType: '直接输出' | '意图路由'; // 意图类型
  keywords: string[]; // 意图关键词
  cases: string[]; // 意图泛化case
  slots: Slot[]; // 意图槽位
  thoughtProcess: string; // 思考过程
  creator: string; // 创建人
  status: 'ACTIVE' | 'INACTIVE'; // 状态
  createTime: string; // 创建时间
}

export interface ThesaurusItem {
  id: string;
  content: string;
  aliases?: string[];
  updater: string;
  updateTime: string;
}

export interface Entity {
  id: string; // 实体Id
  name: string; // 实体名称
  code: string; // 实体编码
  categoryId: string; // 所属分类
  description: string; // 实体描述
  entityType: '词库' | '规则'; // 实体类型
  values: string[]; // 实体值/枚举值
  synonyms: string[]; // 同义词
  creator: string; // 创建人
  status: 'ACTIVE' | 'INACTIVE'; // 状态
  createTime: string; // 创建时间
  thesaurusItems?: ThesaurusItem[]; // 词库内容
}

export interface Prompt {
  id: string;
  name: string;
  model: string;
  businessScenario: string;
  content: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  updateTime: string;
  creator: string;
  version: string;
}

export type ViewState = 'EMOTION' | 'SCENE' | 'SCRIPT' | 'AGENT_ASSISTANT' | 'INTENT' | 'ENTITY' | 'SIMULATOR' | 'PROMPT' | 'LOG_MONITOR' | 'SESSION_EVAL_STATS' | 'SESSION_EVAL_DETAIL' | 'SESSION_DETAIL' | 'TEAM_MONITOR_DASHBOARD' | 'REALTIME_CALL_MONITOR' | 'SESSION_MONITOR' | 'CALL_MONITOR_DETAIL' | 'TEAM_MONITOR_STATS' | 'AGENT_MONITOR_LIST' | 'DUAL_SCREEN_CONFIG' | 'DUAL_SCREEN_CONFIG_2' | 'INTENT_DASHBOARD' | 'INTENT_DASHBOARD_1' | 'INTENT_DASHBOARD_2' | 'ASSISTANT_FUNNEL_DASHBOARD' | 'ASSISTANT_FUNNEL_DASHBOARD_2' | 'ASSISTANT_FUNNEL_DASHBOARD_3' | 'VERSION_COMPARISON_LAB';
export type FormMode = 'LIST' | 'CREATE' | 'EDIT';

export interface LogRecord {
  id: string;
  sessionId: string;
  channel: string;
  startTime: string;
  endTime: string;
  evaluationStatus: 'EVALUATED' | 'FAILED' | 'EVALUATING' | 'NONE';
  taggingStatus: 'UNTAGGED' | 'REVIEWING' | 'TAGGED';
}
