import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  AlertCircle, 
  PlusCircle, 
  BookOpen, 
  GitBranch,
  Search,
  Filter,
  Calendar,
  ChevronDown
} from 'lucide-react';

const INTENT_DATA = [
  { name: '查询账单', count: 1240, color: '#3b82f6' },
  { name: '信用卡还款', count: 980, color: '#3b82f6' },
  { name: '额度申请', count: 850, color: '#3b82f6' },
  { name: '挂失补办', count: 620, color: '#3b82f6' },
  { name: '利息查询', count: 450, color: '#3b82f6' },
  { name: '密码重置', count: 380, color: '#3b82f6' },
];

const KNOWLEDGE_DATA = [
  { name: '分期费率计算规则', count: 850, type: '基础业务' },
  { name: '海外取现手续费', count: 720, type: '跨境业务' },
  { name: '信用额度调整说明', count: 640, type: '基础业务' },
  { name: '积分兑换流程', count: 530, type: '增值业务' },
  { name: '违约金收取标准', count: 420, type: '合规提示' },
];

const PROCESS_DATA = [
  { name: '进件审批流程', count: 1200, status: 'NORMAL' },
  { name: '注销销卡流程', count: 950, status: 'HIGH_FREQ' },
  { name: '紧急止付流程', count: 320, status: 'NORMAL' },
  { name: '逾期协商流程', count: 280, status: 'SENSITIVE' },
];

const ISSUE_INTENTS = [
  { name: '取消分期', issue: '容易与"分期咨询"混淆', confidence: '62%', count: 85 },
  { name: '反馈态度差', issue: '口语化严重，关键词覆盖不足', confidence: '58%', count: 64 },
  { name: '要求转人工', issue: '多出现在复杂场景，意图重叠', confidence: '65%', count: 120 },
];

const POTENTIAL_INTENTS = [
  { name: '数字人民币还款', matchedCount: 340, suggestCategory: '支付/还款' },
  { name: '虚拟卡注销', matchedCount: 210, suggestCategory: '卡片管理' },
  { name: '第三方支付绑定失败', matchedCount: 185, suggestCategory: '支付安全' },
];

const TeamMonitorStats: React.FC = () => {
  const [timeRange, setTimeRange] = useState('近7天');

  // Dynamic data generation based on timeRange
  const getDataScale = () => {
    switch (timeRange) {
      case '今天': return 0.12;
      case '昨天': return 0.15;
      case '近7天': return 1;
      case '近30天': return 4.2;
      default: return 1;
    }
  };

  const scale = getDataScale();

  const dynamicIntentData = INTENT_DATA.map(item => ({
    ...item,
    count: Math.round(item.count * scale)
  }));

  const dynamicKnowledgeData = KNOWLEDGE_DATA.map(item => ({
    ...item,
    count: Math.round(item.count * scale)
  }));

  const dynamicProcessData = PROCESS_DATA.map(item => ({
    ...item,
    count: Math.round(item.count * scale)
  }));

  const dynamicIssueIntents = ISSUE_INTENTS.map(item => ({
    ...item,
    count: Math.round(item.count * scale)
  }));

  const dynamicPotentialIntents = POTENTIAL_INTENTS.map(item => ({
    ...item,
    matchedCount: Math.round(item.matchedCount * scale)
  }));

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '今天': return '2026-07-16 至 2026-07-16';
      case '昨天': return '2026-07-15 至 2026-07-15';
      case '近7天': return '2026-07-09 至 2026-07-16';
      case '近30天': return '2026-06-17 至 2026-07-16';
      default: return '2026-07-09 至 2026-07-16';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto custom-scrollbar p-6 space-y-6">
      {/* Header Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex bg-slate-100 rounded-lg p-1">
            {['今天', '昨天', '近7天', '近30天'].map(t => (
              <button 
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-all ${timeRange === t ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex items-center space-x-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white cursor-pointer hover:border-blue-300 transition-colors">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-[13px] text-slate-600 font-medium">{getTimeRangeLabel()}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>
      </div>

      {/* Main Stats Row 1: High Freq Intents & Knowledge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Frequency Intents Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp size={18} />
              </div>
              <h2 className="text-[16px] font-bold text-slate-800">高频意图统计</h2>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dynamicIntentData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide domain={[0, 'dataMax + 200']} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[0, 4, 4, 0]} 
                  barSize={24}
                  label={{ position: 'right', fill: '#64748b', fontSize: 12, fontWeight: 600, offset: 8 }}
                >
                  {dynamicIntentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Knowledge Points List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <BookOpen size={18} />
              </div>
              <h2 className="text-[16px] font-bold text-slate-800">热门知识点</h2>
            </div>
          </div>
          <div className="flex-1 overflow-auto space-y-3 custom-scrollbar pr-1">
            {dynamicKnowledgeData.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <span className="text-[14px] font-bold">{i + 1}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-slate-700">{item.name}</span>
                    <span className="text-[12px] text-slate-400">{item.type}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[16px] font-black text-slate-800">{item.count}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">匹配次数</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Row 2: Business Processes & Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Processes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                <GitBranch size={18} />
              </div>
              <h2 className="text-[16px] font-bold text-slate-800">核心业务流程监控</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dynamicProcessData.map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[13px] font-bold text-slate-600">{item.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.status === 'HIGH_FREQ' ? 'bg-orange-100 text-orange-600' : 
                    item.status === 'SENSITIVE' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {item.status === 'HIGH_FREQ' ? '高频' : item.status === 'SENSITIVE' ? '敏感' : '正常'}
                  </span>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-[24px] font-black text-slate-800">{item.count}</span>
                  <span className="text-[12px] text-slate-400 font-medium">次触发</span>
                </div>
                <div className="mt-3 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-blue-500 h-full" style={{ width: `${Math.min(100, (item.count / (1200 * scale)) * 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recognition Issues */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertCircle size={18} />
              </div>
              <h2 className="text-[16px] font-bold text-slate-800">识别难点意图</h2>
            </div>
            <button className="text-[12px] font-bold text-slate-400">问题诊断</button>
          </div>
          <div className="space-y-4">
            {dynamicIssueIntents.map((item, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-rose-50/20 border border-rose-100/50">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px] font-black text-slate-800">{item.name}</span>
                    <span className="text-[12px] font-bold text-rose-600">识别率: {item.confidence}</span>
                  </div>
                  <p className="text-[12px] text-slate-500">{item.issue}</p>
                </div>
                <div className="text-right">
                  <div className="text-[18px] font-black text-slate-700">{item.count}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">异常数</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Potential New Intents */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <PlusCircle size={18} />
            </div>
            <h2 className="text-[16px] font-bold text-slate-800">高频未定义意图 (建议新增)</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dynamicPotentialIntents.map((item, i) => (
            <div key={i} className="relative p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer">
              <div className="mb-4">
                <span className="text-[16px] font-bold text-slate-800 block mb-1">{item.name}</span>
                <span className="text-[12px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                  建议分类: {item.suggestCategory}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">匹配话务量</span>
                  <span className="text-[20px] font-black text-slate-800">{item.matchedCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMonitorStats;
