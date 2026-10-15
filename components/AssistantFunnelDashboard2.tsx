import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Sparkles, 
  Target, 
  Download, 
  RefreshCw,
  Filter,
  MessageSquare,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type FunnelLayer = 'ENTRANCE' | 'FILTER' | 'REWRITE' | 'RETRIEVAL' | 'RRF' | 'RERANK' | 'INTENT_BRANCH';

interface IntentAccuracyRow {
  name: string;
  accuracy: number;
  count: number;
}

const AssistantFunnelDashboard2: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<FunnelLayer>('ENTRANCE');
  const [activeIntentTab, setActiveIntentTab] = useState<'composition' | 'accuracy'>('composition');
  const [timeRange, setTimeRange] = useState('7d');
  const [sortConfig, setSortConfig] = useState<{ key: keyof IntentAccuracyRow, direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Data - Constants
  const stats = [
    { title: '客户原始消息', value: '1,000', unit: '条' },
    { title: '过滤全局准确率', value: '82%', unit: '' },
    { title: 'Query 整体准确率', value: '90%', unit: '' },
    { title: '意图全局准确率', value: '56%', unit: '', isCritical: true },
    { title: '平均总耗时', value: '1.2', unit: 's' },
  ];

  const funnelSteps = [
    { 
      id: 'ENTRANCE' as FunnelLayer, 
      label: '① 客户原始消息', 
      count: 1000, 
      metrics: ['消息总量：1000条'],
    },
    { 
      id: 'FILTER' as FunnelLayer, 
      label: '② TurnGate 过滤层', 
      count: 1000, 
      accuracy: '82%',
      latency: '185ms',
      accuracyTooltip: '衡量过滤层对非法消息拦截及合法消息放行的准确程度；包含正确拦截与正确放行消息占进入该环节总消息的比例。',
      metrics: [],
      flowIn: 600
    },
    { 
      id: 'REWRITE' as FunnelLayer, 
      label: '③ Query 改写层', 
      count: 600, 
      accuracy: '90%',
      latency: '600ms',
      accuracyTooltip: '全进入改写层消息综合效果；既要前置分类识别正确；若消息需要改写，还要求改写输出文本经Judge判定合格才算正确；分母为进入Query改写层全部消息。',
      metrics: [],
      flowIn: 540
    },
    { 
      id: 'RETRIEVAL' as FunnelLayer, 
      label: '④ 混合检索', 
      count: 540, 
      metrics: [
        'recall@10：88% ｜ 平均耗时：150ms',
        '↓ 向下流转：540条'
      ],
      flowIn: 540
    },
    { 
      id: 'RRF' as FunnelLayer, 
      label: '⑤ RRF 粗排', 
      count: 540, 
      metrics: [
        'recall@10：92% ｜ 平均耗时：45ms',
        '↓ 向下流转：540条'
      ],
      flowIn: 540
    },
    { 
      id: 'RERANK' as FunnelLayer, 
      label: '⑥ Reranker 精排', 
      count: 540, 
      metrics: [
        'Hit@1：82% ｜ 平均耗时：220ms',
        '↓ 向下流转：540条'
      ],
      flowIn: 540
    },
    { 
      id: 'INTENT_BRANCH' as FunnelLayer, 
      label: '⑦ 意图输出', 
      count: 540, 
      accuracy: '56%',
      metrics: [
        'reranker：65% ｜ LLM：35%',
        'TP：56% | FN1：15% | FN2：10% | FP：19%'
      ]
    }
  ];

  const filterDetailData = [
    { name: '业务咨询', mis: 25, missed: 40 },
    { name: '情感宣泄', mis: 15, missed: 20 },
    { name: '广告推销', mis: 35, missed: 10 },
    { name: '敏感词', mis: 5, missed: 30 },
  ];

  const rewriteDetailData = [
    { name: '无需改写', value: 240 },
    { name: '轻度改写', value: 180 },
    { name: '重度改写', value: 120 },
    { name: '改写失败', value: 60 },
  ];

  const intentBranchDistributionData = [
    { name: 'Reranker直接输出', value: 351, color: '#3b82f6' },
    { name: '大模型推理输出', value: 189, color: '#8b5cf6' },
  ];

  const intentCompositionData = [
    { name: 'TP 分类正确', value: 302, color: '#10b981' },
    { name: 'FN1 分类错误', value: 81, color: '#f59e0b' },
    { name: 'FN2 漏识别', value: 54, color: '#94a3b8' },
    { name: 'FP 虚假意图', value: 103, color: '#f43f5e' },
  ];

  const intentAccuracyRows: IntentAccuracyRow[] = [
    { name: '转账限额查询', accuracy: 89.2, count: 145 },
    { name: '信用卡分期', accuracy: 72.5, count: 98 },
    { name: '理财产品赎回', accuracy: 94.1, count: 210 },
    { name: '贷款进度查询', accuracy: 68.4, count: 86 },
    { name: '支付密码重置', accuracy: 74.8, count: 112 },
    { name: '余额明细导出', accuracy: 82.3, count: 156 },
    { name: '开户网点查询', accuracy: 91.5, count: 78 },
    { name: '数字金业务', accuracy: 65.0, count: 42 },
    { name: 'ETC 申请', accuracy: 88.0, count: 65 },
    { name: '积分兑换', accuracy: 71.2, count: 134 },
  ];

  const sortedIntentData = useMemo(() => {
    let sortableData = [...intentAccuracyRows];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [sortConfig]);

  const paginatedIntentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedIntentData.slice(start, start + pageSize);
  }, [sortedIntentData, currentPage]);

  const requestSort = (key: keyof IntentAccuracyRow) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f43f5e', '#f59e0b', '#8b5cf6'];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden rounded-2xl border border-slate-200">
      <div className="bg-white px-8 py-4 flex items-center justify-between border-b border-slate-200 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-[12px] font-bold text-slate-700">2026-08-10 ~ 2026-08-17</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['今天', '7d', '30d'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-5 py-1.5 rounded-md text-[12px] font-bold transition-all ${timeRange === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t === '今天' ? '今天' : t === '7d' ? '近7天' : '近30天'}
              </button>
            ))}
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>
        <div className="flex items-center space-x-3">
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="grid grid-cols-5 gap-4">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center mb-4">
              <Filter size={14} className="mr-2 text-blue-500" /> 全链路
            </h3>
            <div className="space-y-4 relative pr-10">
              {funnelSteps.map((step, idx) => (
                <FunnelStep 
                  key={step.id} 
                  {...step} 
                  isSelected={selectedLayer === step.id} 
                  onSelect={() => {
                    setSelectedLayer(step.id);
                    setCurrentPage(1);
                  }}
                  width={100 - idx * 8}
                />
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 sticky top-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedLayer} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[620px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">{funnelSteps.find(s => s.id === selectedLayer)?.label}</h4>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition-all shadow-sm">
                    <Download size={14} />
                    <span>导出评测样本</span>
                  </button>
                </div>

                <div className="flex-1 space-y-8">
                  {selectedLayer === 'ENTRANCE' && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
                        <MessageSquare size={40} />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-900">1,000 条</div>
                        <div className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-widest">消息进入总量</div>
                      </div>
                    </div>
                  )}

                  {selectedLayer === 'FILTER' && (
                    <div className="space-y-6 flex flex-col h-full">
                      {/* 模块一：模型业务质量指标 */}
                      <div className="space-y-3">
                        <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                          <Activity size={14} className="text-blue-500 mr-2" /> 模型业务质量指标
                        </h5>
                        <div className="grid grid-cols-6 gap-3">
                          <QualityCard 
                            title="拦截准确率" 
                            value="80.0%" 
                            tooltip="拦截准确率：TP/(TP+FP)。模型识别为需要拦截的样本中，真实确实需要拦截的占比。"
                          />
                          <QualityCard 
                            title="放行准确率" 
                            value="83.3%" 
                            tooltip="放行准确率：TN/(TN+FN)。模型识别为应当放行的样本中，真实确实应当放行的占比。"
                          />
                          <QualityCard 
                            title="业务放行召回率" 
                            value="86.2%" 
                            tooltip="业务放行召回率：Judge 判定本该放行的全部正常消息中，被 TurnGate 成功放行的比例；1-业务放行召回率 = 误拦截率；数值越低，正常客户消息被误拦截越多，用户体验损伤越大。公式：TN/(TN+FP)"
                          />
                          <QualityCard 
                            title="误拦截率" 
                            value="8.0%" 
                            isWarning={true}
                            tooltip="误拦截率：真实应放行的正常消息中，被错误拦截的占比；衡量普通客户被误伤风险。分母：真值应放行消息，公式 FP/(TN+FP)"
                          />
                          <QualityCard 
                            title="漏拦截率" 
                            value="10.0%" 
                            isWarning={true}
                            tooltip="漏拦截率：真实风险消息（应当拦截）中，被错误放行的占比；衡量线上安全泄露风险。公式：FN/(TP+FN)"
                          />
                          <QualityCard 
                            title="轮次类型准确率" 
                            value="88.5%" 
                            tooltip="轮次类型准确率：TurnGate 输出的轮次分类标记，和 Judge 评估模型分类标记完全一致的占比，观测过滤分类标记是否准确。"
                          />
                        </div>
                      </div>

                      {/* 模块二：性能 & 评测基准指标 */}
                      <div className="space-y-3">
                        <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                          <RefreshCw size={14} className="text-emerald-500 mr-2" /> 性能 & 评测基准
                        </h5>
                        <div className="grid grid-cols-6 gap-3">
                          <div className="col-span-2">
                            <QualityCard 
                              title="平均推理耗时" 
                              value="185ms" 
                              tooltip="平均耗时：TurnGate 模块单条消息平均推理耗时，用于观测服务性能、超时隐患。"
                            />
                          </div>
                          <div className="col-span-4 opacity-0"></div>
                        </div>
                      </div>

                      {/* 模块三：消息结果全局分布 (新迁移为饼图) */}
                      <div className="flex-1 space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                            <Filter size={14} className="text-indigo-500 mr-2" /> 消息结果全局分布（占全部进入消息比例）
                          </h5>
                          <div className="group/tip relative">
                            <HelpCircle size={14} className="text-slate-300 cursor-help" />
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tip:block w-64 p-3 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl z-50 leading-relaxed font-medium pointer-events-none">
                              四项指标总和为 100%，以该环节全部进入消息为分母。
                            </div>
                          </div>
                        </div>
                        <div className="h-[220px] flex items-center bg-slate-50/50 rounded-2xl border border-slate-100">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: '正确拦截', value: 32, color: '#10b981' },
                                  { name: '误拦截', value: 8, color: '#f43f5e' },
                                  { name: '正确放行', value: 50, color: '#3b82f6' },
                                  { name: '漏拦截', value: 10, color: '#f59e0b' },
                                ]}
                                cx="40%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                labelLine={true}
                              >
                                {[
                                  { name: '正确拦截', value: 32, color: '#10b981' },
                                  { name: '误拦截', value: 8, color: '#f43f5e' },
                                  { name: '正确放行', value: 50, color: '#3b82f6' },
                                  { name: '漏拦截', value: 10, color: '#f59e0b' },
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                                formatter={(value: number) => [`${value}%`, '占比']}
                              />
                              <Legend 
                                layout="vertical" 
                                verticalAlign="middle" 
                                align="right" 
                                wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingRight: '40px' }} 
                                formatter={(value) => <span className="text-slate-600">{value}</span>}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedLayer === 'REWRITE' && (
                    <div className="space-y-8 flex flex-col h-full">
                      {/* 模块 1：改写前置分类分布 (模型线上输出) */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                            <Activity size={14} className="text-blue-500 mr-2" /> 1、改写前置分类分布（模型线上输出）
                          </h5>
                          <div className="group/tip relative">
                            <HelpCircle size={14} className="text-slate-300 cursor-help" />
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tip:block w-64 p-3 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl z-50 leading-relaxed font-medium pointer-events-none">
                              该饼图为Query改写模块线上前置分类输出结果，用于路由后续改写逻辑；Judge会离线独立评估该分类的正确性。
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-[260px] flex items-center bg-slate-50/50 rounded-2xl border border-slate-100">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                              <Pie
                                data={[
                                  { name: '无需改写', value: 40, color: '#94a3b8' },
                                  { name: '修正覆盖', value: 15, color: '#3b82f6' },
                                  { name: '指代消解', value: 12, color: '#10b981' },
                                  { name: '省略补全', value: 13, color: '#8b5cf6' },
                                  { name: '桥接指代', value: 10, color: '#f59e0b' },
                                  { name: '增量合并', value: 10, color: '#6366f1' },
                                ]}
                                cx="35%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={75}
                                paddingAngle={3}
                                dataKey="value"
                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                labelLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                              >
                                {[
                                  { name: '无需改写', value: 40, color: '#94a3b8' },
                                  { name: '修正覆盖', value: 15, color: '#3b82f6' },
                                  { name: '指代消解', value: 12, color: '#10b981' },
                                  { name: '省略补全', value: 13, color: '#8b5cf6' },
                                  { name: '桥接指代', value: 10, color: '#f59e0b' },
                                  { name: '增量合并', value: 10, color: '#6366f1' },
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                                formatter={(value: number) => [`${value}%`, '占比']}
                              />
                              <Legend 
                                layout="vertical" 
                                verticalAlign="middle" 
                                align="right" 
                                wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingRight: '10px' }} 
                                formatter={(value) => <span className="text-slate-600">{value}</span>}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* 模块 2：Judge 离线评测结果 */}
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                          <Target size={14} className="text-indigo-500 mr-2" /> 2、Judge离线评测结果（Judge离线口径）
                        </h5>
                        <div className="grid grid-cols-2 gap-6">
                          <QualityCard 
                            title="改写前置分类准确率" 
                            value="92.4%" 
                            tooltip="评判6类前置分类识别是否准确，分类错误会导致后续选择错误改写逻辑。公式：前置分类判断正确条数 ÷ Query改写层输入总消息数"
                          />
                          <QualityCard 
                            title="改写执行准确率" 
                            value="88.5%" 
                            tooltip="针对需要改写的消息（排除无需改写），Judge评估改写后输出文本符合业务标准的占比。仅统计需要执行改写的样本；“无需改写”样本不参与本指标计算。"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedLayer === 'RETRIEVAL' && (
                    <div className="space-y-6 h-full flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-[3px] h-5 bg-blue-500 rounded-full"></div>
                          <h5 className="text-base font-bold text-slate-800">④ 混合检索</h5>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase flex items-center">
                          <Activity size={14} className="text-blue-500 mr-2" /> 1、检索性能指标
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <QualityCard 
                            title="整体 recall@10" 
                            value="88.2%" 
                            tooltip="整体recall@10：稀疏+稠密混合检索，标准意图是否落在返回top10候选文档占比，衡量检索召回能力。"
                          />
                          <QualityCard 
                            title="平均耗时(ms)" 
                            value="150" 
                            tooltip="混合检索环节单条消息平均耗时。"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase flex items-center">
                          <Target size={14} className="text-emerald-500 mr-2" /> 2、两路检索细分指标
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase">稀疏 Sparse 检索 recall@10</div>
                            <div className="text-2xl font-black text-slate-800">84.5%</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase">稠密 Dense 检索 recall@10</div>
                            <div className="text-2xl font-black text-slate-800">81.2%</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-slate-100 text-[11px] text-slate-400 font-medium italic">
                        *如需查看候选文档样本，请通过右上角“导出评测样本”获取报表。
                      </div>
                    </div>
                  )}

                  {selectedLayer === 'RRF' && (
                    <div className="space-y-6 h-full flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-[3px] h-5 bg-indigo-500 rounded-full"></div>
                          <h5 className="text-base font-bold text-slate-800">⑤ RRF 粗排</h5>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase flex items-center">
                          <Activity size={14} className="text-indigo-500 mr-2" /> 1、RRF 融合后指标
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <QualityCard 
                            title="RRF recall@10" 
                            value="92.1%" 
                            tooltip="RRF recall@10：稀疏、稠密结果经过RRF算法融合重排后，标准意图落在top10候选的占比。"
                          />
                          <QualityCard 
                            title="平均耗时(ms)" 
                            value="45" 
                            tooltip="RRF 融合重排环节平均耗时。"
                          />
                        </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-slate-100 text-[11px] text-slate-400 font-medium italic">
                        *如需查看融合后候选样本，请通过右上角“导出评测样本”获取报表。
                      </div>
                    </div>
                  )}

                  {selectedLayer === 'RERANK' && (
                    <div className="space-y-6 h-full flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-[3px] h-5 bg-purple-500 rounded-full"></div>
                          <h5 className="text-base font-bold text-slate-800">⑥ Reranker 精排</h5>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase flex items-center">
                          <Activity size={14} className="text-purple-500 mr-2" /> 1、精排效果&性能指标
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <QualityCard 
                            title="Hit@1" 
                            value="82.4%" 
                            tooltip="Hit@1：reranker重排序完成后，top-1候选文档等于标准真值意图的样本占比，衡量精排排序质量。"
                          />
                          <QualityCard 
                            title="平均耗时(ms)" 
                            value="220" 
                            tooltip="Reranker 精排环节单条消息平均耗时。"
                          />
                        </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-slate-100 text-[11px] text-slate-400 font-medium italic">
                        *如需查看 TOP5 候选文档样本，请通过右上角“导出评测样本”获取报表。
                      </div>
                    </div>
                  )}

                  {selectedLayer === 'INTENT_BRANCH' && (
                    <div className="space-y-6 h-full flex flex-col overflow-y-auto pr-2 custom-scrollbar">
                      <div className="flex items-center justify-between sticky top-0 bg-white pb-2 z-10">
                        <div className="flex items-center space-x-3">
                          <div className="w-[3px] h-5 bg-rose-500 rounded-full"></div>
                          <h5 className="text-base font-bold text-slate-800">⑦ 意图输出</h5>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase flex items-center">
                          <Activity size={14} className="text-rose-500 mr-2" /> 1、输出分支流量分布
                        </h5>
                        <div className="h-[200px] flex items-center bg-slate-50/50 rounded-2xl border border-slate-100">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={intentBranchDistributionData}
                                cx="40%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                              >
                                {intentBranchDistributionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                                formatter={(value: number) => [`${value}条`, '消息数']}
                              />
                              <Legend 
                                layout="vertical" 
                                verticalAlign="middle" 
                                align="right" 
                                wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingRight: '20px' }} 
                                formatter={(value) => <span className="text-slate-600">{value}</span>}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute top-4 right-4 group">
                            <HelpCircle size={14} className="text-slate-300 cursor-help" />
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl z-50 leading-relaxed font-medium">
                              线上真实流量占比；Judge会分别评估两条分支识别效果
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase flex items-center">
                          <Target size={14} className="text-indigo-500 mr-2" /> 2、自动 Judge 评测指标
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                          <QualityCard 
                            title="全局意图匹配正确率" 
                            value="56%" 
                            tooltip="模型输出最终意图与标准真值一致的比例。"
                          />
                          <QualityCard 
                            title="分类错误占比" 
                            value="15%" 
                            tooltip="模型识别出了意图，但与真值意图分类不符。"
                          />
                          <QualityCard 
                            title="漏识别占比" 
                            value="10%" 
                            tooltip="标准真值有具体意图，但模型未能识别或判定为无意图。"
                          />
                          <QualityCard 
                            title="虚假意图占比" 
                            value="19%" 
                            tooltip="标准真值为无意图或非业务意图，但模型强行识别出了具体业务意图。"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase flex items-center">
                          <Activity size={14} className="text-emerald-500 mr-2" /> 3、分支拆分效果指标
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase">reranker 直接输出分支准确率</div>
                            <div className="text-xl font-black text-slate-800">72.4%</div>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase">大模型推理输出分支准确率</div>
                            <div className="text-xl font-black text-slate-800">48.2%</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <h5 className="text-[11px] font-black text-slate-400 uppercase flex items-center">
                            <Users size={14} className="text-slate-500 mr-2" /> 4、人工复核基准
                          </h5>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">抽样复核样本：100条（非全量）</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-100/50 p-3 rounded-xl border border-slate-200/60">
                            <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Judge 意图评估吻合率</div>
                            <div className="text-xl font-black text-slate-800">95.2%</div>
                          </div>
                          <div className="bg-slate-100/50 p-3 rounded-xl border border-slate-200/60">
                            <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Judge 拒识评估吻合率</div>
                            <div className="text-xl font-black text-slate-800">92.8%</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-slate-100 text-[11px] text-slate-400 font-medium italic">
                        *如需查看错误样本详情，请通过右上角“导出评测样本”按钮获取详细报表。
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; unit: string; isCritical?: boolean }> = ({ title, value, unit, isCritical }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">{title}</span>
      </div>
      <div className="flex items-baseline space-x-1">
        <span className={`text-xl font-black tracking-tight ${isCritical ? 'text-rose-600' : 'text-slate-900'}`}>{value}</span>
        {unit && <span className="text-[11px] font-bold text-slate-300">{unit}</span>}
      </div>
    </div>
  );
};

interface FunnelStepProps {
  id: FunnelLayer;
  label: string;
  count: number;
  accuracy?: string;
  latency?: string;
  accuracyLabel?: string;
  accuracyTooltip?: string;
  metrics: string[];
  flowIn?: number;
  isSelected: boolean;
  onSelect: () => void;
  width: number;
}

const FunnelStep: React.FC<FunnelStepProps> = ({ 
  id, label, count, accuracy, latency, accuracyLabel, accuracyTooltip, metrics, flowIn, isSelected, onSelect, width 
}) => {
  const isCompact = id === 'FILTER' || id === 'REWRITE';

  return (
    <div className="relative flex flex-col items-center">
      <div 
        onClick={onSelect}
        className={`relative transition-all cursor-pointer rounded-xl flex flex-col items-center justify-center border-2 border-transparent select-none active:scale-[0.98] ${
          isSelected ? 'bg-blue-600 text-white border-blue-100 shadow-lg shadow-blue-100' : 'bg-white text-slate-800 hover:border-blue-100 hover:bg-slate-50 shadow-sm'
        } ${isCompact ? 'h-[120px] py-3' : 'h-[110px]'}`}
        style={{ width: `${width}%` }}
      >
        <div className="text-[13px] font-black mb-1">{label}</div>
        <div className="flex items-center space-x-2">
          <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>进入：{count.toLocaleString()}</div>
          {accuracy && (
            <div className="group/acc relative">
              <div className={`text-[10px] font-black px-2 py-0.5 rounded-full cursor-help ${isSelected ? 'bg-white/20' : 'bg-emerald-500 text-white'}`}>
                {accuracyLabel || '准确率'}：{accuracy}
              </div>
              {accuracyTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/acc:block w-48 p-2 bg-slate-800 text-white text-[9px] rounded-lg shadow-xl z-50 leading-relaxed font-medium pointer-events-none">
                  {accuracyTooltip}
                </div>
              )}
            </div>
          )}
          {latency && (
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-blue-500 text-white'}`}>平均耗时：{latency}</div>
          )}
        </div>
        
        {metrics && metrics.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 px-6">
            {metrics.map((m, i) => (
              <div key={i} className={`text-[10px] font-bold opacity-70`}>{m}</div>
            ))}
          </div>
        )}

        {isSelected && (
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rotate-45 border-t-2 border-r-2 border-blue-100"></div>
        )}
      </div>

      {flowIn && (
        <div className="flex flex-col items-center py-1">
          <div className="h-4 w-[1.5px] bg-slate-200"></div>
          <div className="flex items-center text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase">
            向下流转：{flowIn}条
          </div>
        </div>
      )}
    </div>
  );
};

const QualityCard: React.FC<{ title: string; value: string; tooltip: string; isWarning?: boolean }> = ({ title, value, tooltip, isWarning }) => {
  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-blue-200 transition-all group relative">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate mr-1" title={title}>{title}</div>
        <div className="group/tip relative">
          <HelpCircle size={12} className="text-slate-300 cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:block w-48 p-2 bg-slate-800 text-white text-[9px] rounded-lg shadow-xl z-50 leading-relaxed font-medium pointer-events-none">
            {tooltip}
          </div>
        </div>
      </div>
      <div className={`text-lg font-black tracking-tight ${isWarning ? 'text-rose-600' : 'text-slate-800'}`}>{value}</div>
    </div>
  );
};

export default AssistantFunnelDashboard2;
