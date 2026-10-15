import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  PieChart as PieChartIcon,
  Sparkles, 
  Target, 
  Download, 
  RefreshCw,
  Filter,
  MessageSquare,
  Calendar,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  BarChart2,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type FunnelLayer = 'ENTRANCE' | 'FILTER' | 'REWRITE' | 'INTENT' | 'RETRIEVAL' | 'RRF' | 'RERANK' | 'INTENT_BRANCH';

interface IntentAccuracyRow {
  name: string;
  accuracy: number;
  count: number;
}

interface StepData {
  id: FunnelLayer;
  label: string;
  count: number;
  accuracy?: string;
  latency?: string;
  accuracyLabel?: string;
  accuracyTooltip?: string;
  enteringLabel?: string;
  latencyLabel?: string;
  metrics: string[];
  flowIn: number;
  subSteps?: any[];
  remark?: string;
}

const AssistantFunnelDashboard3: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<FunnelLayer>('ENTRANCE');
  const [selectedSubStep, setSelectedSubStep] = useState<FunnelLayer | null>(null);
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

  const funnelSteps: StepData[] = [
    { 
      id: 'ENTRANCE' as FunnelLayer, 
      label: '① 客户原始消息', 
      count: 1000, 
      metrics: ['消息总量：1000条'],
      flowIn: 1000
    },
    { 
      id: 'FILTER' as FunnelLayer, 
      label: '② TurnGate 过滤层', 
      count: 1000, 
      accuracy: '82%',
      latency: '200ms',
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
      id: 'INTENT' as FunnelLayer, 
      label: '④ 意图识别层', 
      count: 540, 
      accuracy: '56%',
      latency: '280ms',
      accuracyLabel: '整体准确率',
      latencyLabel: '全链路平均耗时',
      accuracyTooltip: '衡量意图识别分类的准确度；即正确识别并分类的消息占进入该环节总消息的比例。',
      metrics: [],
      flowIn: 540,
      subSteps: [
        { id: 'RETRIEVAL', label: '混合检索', metrics: [], latency: '150ms' },
        { id: 'RRF', label: 'RRF粗排', metrics: [], latency: '45ms' },
        { id: 'RERANK', label: 'Reranker精排', metrics: [], latency: '220ms' },
        { id: 'INTENT_BRANCH', label: '意图双分支', metrics: [], remark: '备注：为内部流量分流占比，总和100%' },
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

  const intentCompositionData = [
    { name: 'TP 分类正确', value: 302, color: '#10b981' },
    { name: 'FN1 分类错误', value: 81, color: '#f59e0b' },
    { name: 'FN2 漏识别', value: 54, color: '#94a3b8' },
    { name: 'FP 虚假意图', value: 103, color: '#f43f5e' },
  ];

  const intentBranchDistributionData = [
    { name: 'Reranker直接输出', value: 351, color: '#3b82f6' },
    { name: '大模型推理输出', value: 189, color: '#8b5cf6' },
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
            <div className="space-y-0 relative pr-10">
              {funnelSteps.map((step, idx) => {
                const isIntent = step.id === 'INTENT';
                return (
                  <React.Fragment key={step.id}>
                    <FunnelStep 
                      {...step} 
                      isSelected={selectedLayer === step.id && !selectedSubStep} 
                      onSelect={() => {
                        setSelectedLayer(step.id);
                        setSelectedSubStep(null);
                        setCurrentPage(1);
                      }}
                      width={100 - idx * 8}
                      showFlowLabel={!isIntent}
                      enteringLabel={step.enteringLabel}
                      accuracyLabel={step.accuracyLabel}
                      latencyLabel={step.latencyLabel}
                    />
                    
                    {isIntent && step.subSteps && (
                      <div className="relative mt-0 mb-10 space-y-4 flex flex-col items-center w-full">
                        {/* Parent to sub-steps connector (Dashed) */}
                        <div className="h-6 w-0.5 border-l-2 border-dashed border-slate-200"></div>
                        
                        {step.subSteps.map((sub, subIdx) => {
                          const subWidth = (100 - idx * 8) - 4 - (subIdx * 4); // Progressive tapering
                          return (
                            <React.Fragment key={sub.id}>
                              <FunnelStep 
                                id={sub.id as FunnelLayer}
                                label={`④-${subIdx + 1} ${sub.label}`}
                                count={step.count}
                                latency={sub.latency}
                                metrics={sub.metrics}
                                remark={sub.remark}
                                isSelected={selectedSubStep === sub.id}
                                onSelect={() => {
                                  setSelectedLayer('INTENT');
                                  setSelectedSubStep(sub.id as FunnelLayer);
                                  setCurrentPage(1);
                                }}
                                width={subWidth}
                                isSubStep={true}
                              />
                              {/* Sub-step to sub-step connector (Dashed) */}
                              {subIdx < step.subSteps.length - 1 && (
                                <div className="h-4 w-0.5 border-l-2 border-dashed border-slate-200"></div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 sticky top-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedLayer + (selectedSubStep || '')} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[620px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">
                        {selectedSubStep 
                          ? `④-${(funnelSteps.find(s => s.id === 'INTENT')?.subSteps?.findIndex(sub => sub.id === selectedSubStep) || 0) + 1} ${funnelSteps.find(s => s.id === 'INTENT')?.subSteps?.find(sub => sub.id === selectedSubStep)?.label}`
                          : funnelSteps.find(s => s.id === selectedLayer)?.label
                        }
                      </h4>
                    </div>
                  </div>
                  {!selectedSubStep && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition-all shadow-sm">
                      <Download size={14} />
                      <span>导出评测样本</span>
                    </button>
                  )}
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
                      <div className="space-y-3">
                        <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                          <Activity size={14} className="text-blue-500 mr-2" /> 模型业务质量指标
                        </h5>
                        <div className="grid grid-cols-6 gap-3">
                          <QualityCard 
                            title="拦截准确率" 
                            value="80.0%" 
                            tooltip="模型识别为需要拦截的样本中，真实确实需要拦截的占比。"
                          />
                          <QualityCard 
                            title="放行准确率" 
                            value="83.3%" 
                            tooltip="模型识别为应当放行的样本中，真实确实应当放行的占比。"
                          />
                          <QualityCard 
                            title="业务放行召回率" 
                            value="86.2%" 
                            tooltip="Judge 判定本该放行的全部正常消息中，被 TurnGate 成功放行的比例。"
                          />
                          <QualityCard 
                            title="误拦截率" 
                            value="8.0%" 
                            isWarning={true}
                            tooltip="真实应放行的正常消息中，被错误拦截的占比。"
                          />
                          <QualityCard 
                            title="漏拦截率" 
                            value="10.0%" 
                            isWarning={true}
                            tooltip="真实风险消息中，被错误放行的占比。"
                          />
                          <QualityCard 
                            title="轮次类型准确率" 
                            value="88.5%" 
                            tooltip="TurnGate 输出的轮次分类标记，和 Judge 评估模型分类标记完全一致的占比。"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                          <RefreshCw size={14} className="text-emerald-500 mr-2" /> 性能 & 评测基准
                        </h5>
                        <div className="grid grid-cols-6 gap-3">
                          <div className="col-span-2">
                            <QualityCard 
                              title="平均推理耗时" 
                              value="200ms" 
                              tooltip="TurnGate 模块单条消息平均推理耗时。"
                            />
                          </div>
                          <div className="col-span-2">
                            <QualityCard 
                              title="Judge 标注准确性" 
                              value="96.5%" 
                              tooltip="通过人工抽样复核 Judge 评测结果得到。"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3 pt-4 border-t border-slate-100">
                        <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                          <Filter size={14} className="text-indigo-500 mr-2" /> 消息结果全局分布
                        </h5>
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
                              <RechartsTooltip />
                              <Legend layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedLayer === 'REWRITE' && (
                    <div className="space-y-8 flex flex-col h-full">
                      <div className="space-y-4">
                        <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                          <Activity size={14} className="text-blue-500 mr-2" /> 1、改写前置分类分布
                        </h5>
                        <div className="h-[260px] flex items-center bg-slate-50/50 rounded-2xl border border-slate-100">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
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
                              >
                                {rewriteDetailData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <RechartsTooltip />
                              <Legend layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <QualityCard 
                          title="改写前置分类准确率" 
                          value="92.4%" 
                          tooltip="评判改写模型输出的前置分类是否与Judge真值匹配。"
                        />
                        <QualityCard 
                          title="改写执行准确率" 
                          value="88.5%" 
                          tooltip="仅评估需要执行改写的消息输出文本质量。"
                        />
                      </div>
                    </div>
                  )}

                  {selectedLayer === 'INTENT' && (
                    <div className="h-full flex flex-col min-w-0">
                      {!selectedSubStep && (
                        <div className="flex border-b border-slate-100 mb-4 flex-shrink-0">
                          <button 
                            onClick={() => setActiveIntentTab('composition')}
                            className={`px-4 py-2 text-[13px] font-bold transition-all relative ${activeIntentTab === 'composition' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            指标概览
                            {activeIntentTab === 'composition' && <motion.div layoutId="intentSideTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                          </button>
                          <button 
                            onClick={() => setActiveIntentTab('accuracy')}
                            className={`px-4 py-2 text-[13px] font-bold transition-all relative ${activeIntentTab === 'accuracy' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            全意图准确率
                            {activeIntentTab === 'accuracy' && <motion.div layoutId="intentSideTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                          </button>
                        </div>
                      )}

                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {!selectedSubStep ? (
                          <>
                            {activeIntentTab === 'composition' ? (
                              <div className="space-y-8 pb-4">
                                {/* 1. 全链路耗时总览表格 */}
                                <section>
                                  <div className="flex items-center space-x-2 mb-4">
                                    <RefreshCw size={16} className="text-blue-500" />
                                    <h5 className="text-[14px] font-bold text-slate-800">全链路耗时总览</h5>
                                  </div>
                                  <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                    <table className="w-full text-[12px] border-collapse">
                                      <thead>
                                        <tr className="bg-slate-100/50">
                                          <th className="py-2.5 px-4 text-left font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">阶段</th>
                                          <th className="py-2.5 px-4 text-right font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">平均耗时</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                        {[
                                          { label: 'Embedding', time: '25ms' },
                                          { label: 'Sparse 检索', time: '45ms' },
                                          { label: '向量检索', time: '80ms' },
                                          { label: 'RRF', time: '10ms' },
                                          { label: 'Reranker', time: '120ms' },
                                        ].map((item, idx) => (
                                          <tr key={idx} className="hover:bg-white transition-colors group">
                                            <td className="py-2.5 px-4 text-slate-600 font-medium group-hover:text-blue-600 transition-colors">{item.label}</td>
                                            <td className="py-2.5 px-4 text-right text-blue-600 font-mono font-bold">{item.time}</td>
                                          </tr>
                                        ))}
                                        <tr className="bg-blue-50/50">
                                          <td className="py-3 px-4 font-black text-slate-800">总计</td>
                                          <td className="py-3 px-4 text-right text-blue-700 font-mono font-black text-[14px]">280ms</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </section>

                                {/* 2. 全局效果大盘 */}
                                <section>
                                  <div className="flex items-center space-x-2 mb-4">
                                    <Activity size={16} className="text-emerald-500" />
                                    <h5 className="text-[14px] font-bold text-slate-800">全局效果大盘</h5>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <QualityCard title="整体意图准确率" value="56.0%" tooltip="最终识别结果与人工标注一致的比例" />
                                    <QualityCard title="检索前 K 命中率" value="88.4%" tooltip="检索阶段返回的 Top-K 候选结果中包含正确意图的比例" />
                                    <QualityCard title="RRF 前五命中率" value="72.1%" tooltip="多路召回融合后 Top-5 候选结果中包含正确意图的比例" />
                                    <QualityCard title="Reranker 直出准确率" value="65.8%" tooltip="重排序阶段直接判定为 Top-1 的意图准确率" />
                                    <QualityCard title="模型输出准确率" value="94.2%" tooltip="LLM 在给定候选意图情况下选择正确的比例" />
                                  </div>
                                </section>
                              </div>
                            ) : (
                              <div className="space-y-6 pb-4">
                                <section>
                                  <div className="flex items-center space-x-2 mb-4">
                                    <BarChart2 size={16} className="text-purple-500" />
                                    <h5 className="text-[14px] font-bold text-slate-800">全意图识别准确率</h5>
                                  </div>
                                  
                                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <table className="w-full text-[12px] border-collapse">
                                      <thead>
                                        <tr className="bg-slate-50">
                                          <th className="py-3 px-4 text-left font-bold text-slate-500 border-b border-slate-100">意图名称</th>
                                          <th className="py-3 px-4 text-right font-bold text-slate-500 border-b border-slate-100">准确率</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-50">
                                        {sortedIntentData.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((row, idx) => (
                                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4 text-slate-700 font-medium">{row.name}</td>
                                            <td className="py-3 px-4 text-right">
                                              <span className="font-bold text-slate-900">
                                                {row.accuracy}%
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                    
                                    <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                      <span className="text-[10px] text-slate-400 font-medium">共 {intentAccuracyRows.length} 条</span>
                                      <div className="flex items-center space-x-1">
                                        <button 
                                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                          disabled={currentPage === 1}
                                          className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                          <ChevronLeft size={14} />
                                        </button>
                                        
                                        {Array.from({ length: Math.ceil(intentAccuracyRows.length / pageSize) }).map((_, i) => (
                                          <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`min-w-[22px] h-[22px] flex items-center justify-center text-[11px] font-bold rounded-md transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                                          >
                                            {i + 1}
                                          </button>
                                        ))}

                                        <button 
                                          onClick={() => setCurrentPage(prev => Math.min(Math.ceil(intentAccuracyRows.length / pageSize), prev + 1))}
                                          disabled={currentPage === Math.ceil(intentAccuracyRows.length / pageSize)}
                                          className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                          <ChevronRight size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </section>
                              </div>
                            )}
                          </>
                        ) : (
                        <div className="h-full flex flex-col min-w-0">
                          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-6">
                              {selectedSubStep === 'RETRIEVAL' && (
                                <div className="space-y-6">
                                  <div>
                                    <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                                      <Target size={12} className="mr-2 text-blue-500" />
                                      1、召回细分指标块
                                    </h6>
                                    <div className="grid grid-cols-2 gap-3">
                                      <QualityCard title="sparse 检索 Top3 命中率" value="82.5%" tooltip="标准意图出现在 sparse 检索返回前 3 个候选中 / 成功执行数" />
                                      <QualityCard title="sparse 检索 Top5 命中率" value="85.1%" tooltip="标准意图出现在 sparse 检索返回前 5 个候选中 / 成功执行数" />
                                      <QualityCard title="sparse 检索前 K 命中率" value="88.4%" tooltip="标准意图出现在 sparse 检索召回前 K 个候选中 / 成功执行数" />
                                      <QualityCard title="向量检索 Top3 命中率" value="81.2%" tooltip="标准意图出现在向量检索返回前 3 个候选中 / 成功执行数" />
                                      <QualityCard title="向量检索 Top5 命中率" value="84.0%" tooltip="标准意图出现在向量检索返回前 5 个候选中 / 成功执行数" />
                                      <QualityCard title="向量检索前 K 命中率" value="86.5%" tooltip="标准意图出现在向量检索召回前 K 个候选中 / 成功执行数" />
                                      <div className="col-span-2">
                                        <QualityCard title="混检 Top1 准确率" value="68.2%" tooltip="混合检索输出 Top1 候选命中标准意图占比" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="pt-4 border-t border-slate-100">
                                    <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                                      <RefreshCw size={12} className="mr-2 text-emerald-500" />
                                      2、耗时明细块
                                    </h6>
                                    <div className="grid grid-cols-3 gap-3">
                                      <QualityCard title="Embedding 平均耗时" value="25ms" tooltip="Embedding 模型生成的平均处理耗时" />
                                      <QualityCard title="sparse 检索平均耗时" value="45ms" tooltip="稀疏检索路径的平均查询耗时" />
                                      <QualityCard title="向量检索平均耗时" value="80ms" tooltip="向量检索路径的平均查询耗时" />
                                    </div>
                                  </div>
                                </div>
                              )}
                              {selectedSubStep === 'RRF' && (
                                <div className="grid grid-cols-2 gap-4">
                                  <QualityCard 
                                    title="RRF前五命中率" 
                                    value="91.95%" 
                                    tooltip="标准意图出现在RRF融合前5个候选中 / 成功执行数" 
                                  />
                                  <QualityCard 
                                    title="RRF Hit@1" 
                                    value="52.75%" 
                                    tooltip="RRF Top1命中 / 成功执行数" 
                                  />
                                  <QualityCard 
                                    title="零候选率" 
                                    value="0.00%" 
                                    tooltip="RRF融合候选为空的样本数 / 成功执行数" 
                                  />
                                  <QualityCard 
                                    title="混检Top1准确率" 
                                    value="52.75%" 
                                    tooltip="RRF Top1命中 / 成功执行数" 
                                  />
                                </div>
                              )}
                              {selectedSubStep === 'RERANK' && (
                                <div className="grid grid-cols-2 gap-4">
                                  <QualityCard 
                                    title="Reranker Hit@1" 
                                    value="87.48%" 
                                    tooltip="Reranker Top1命中 / 成功执行数" 
                                  />
                                  <QualityCard 
                                    title="Reranker Top1准确率" 
                                    value="87.48%" 
                                    tooltip="Reranker Top1命中 / 成功执行数" 
                                  />
                                  <QualityCard 
                                    title="检索阶段意图直出率" 
                                    value="78.54%" 
                                    tooltip="Reranker 候选中心存在超过直出阈值且为直出类型的样本数 / 成功执行数" 
                                  />
                                  <QualityCard 
                                    title="Reranker前五命中率" 
                                    value="96.93%" 
                                    tooltip="标准意图出现在Reranker精排前5个候选中 / 成功执行数" 
                                  />
                                  <QualityCard 
                                    title="Reranker前K命中率" 
                                    value="96.93%" 
                                    tooltip="标准意图出现在Reranker前K个候选中 / 成功执行数" 
                                  />
                                  <QualityCard 
                                    title="Reranker直出准确率" 
                                    value="93.98%" 
                                    tooltip="Reranker Top1 意图超过阈值且命中标准意图且为直出类型 / Reranker 直出样本数" 
                                  />
                                  <QualityCard 
                                    title="Reranker未达阈值准确率" 
                                    value="63.69%" 
                                    tooltip="Reranker Top1 意图未达到阈值且命中标准意图且为直出类型 / Reranker Top1 未达阈值样本数" 
                                  />
                                </div>
                              )}
                              {selectedSubStep === 'INTENT_BRANCH' && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <QualityCard title="直出准确率" value="72.4%" tooltip="满足阈值直出分支正确率" />
                                    <QualityCard title="LLM推理准确率" value="48.2%" tooltip="进入LLM推理分支正确率" />
                                  </div>
                                  <div className="h-[320px] mt-4 bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={intentBranchDistributionData}
                                          cx="50%"
                                          cy="45%"
                                          innerRadius={60}
                                          outerRadius={100}
                                          paddingAngle={5}
                                          dataKey="value"
                                          labelLine={false}
                                          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                            return (
                                              <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[12px] font-bold">
                                                {`${(percent * 100).toFixed(1)}%`}
                                              </text>
                                            );
                                          }}
                                        >
                                          {intentBranchDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                          ))}
                                        </Pie>
                                        <RechartsTooltip 
                                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend 
                                          verticalAlign="bottom" 
                                          align="center" 
                                          iconType="circle"
                                          wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} 
                                        />
                                      </PieChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
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
  enteringLabel?: string;
  latencyLabel?: string;
  metrics: string[];
  remark?: string;
  subSteps?: any[];
  flowIn?: number;
  isSelected: boolean;
  onSelect: () => void;
  width: number;
  isSubStep?: boolean;
  showFlowLabel?: boolean;
}

const FunnelStep: React.FC<FunnelStepProps> = ({ 
  id, label, count, accuracy, latency, accuracyLabel, accuracyTooltip, enteringLabel, latencyLabel, metrics, remark, subSteps, flowIn, isSelected, onSelect, width, isSubStep, showFlowLabel = true
}) => {
  const isCompact = id === 'FILTER' || id === 'REWRITE';

  return (
    <div className={`relative flex flex-col items-center w-full ${isSubStep ? 'group/subcard' : ''}`}>
      <div 
        onClick={onSelect}
        className={`relative transition-all cursor-pointer rounded-xl flex flex-col items-center justify-center border-2 select-none active:scale-[0.98] ${
          isSelected 
            ? 'bg-blue-600 text-white border-blue-100 shadow-lg shadow-blue-100 z-10' 
            : 'bg-white text-slate-800 border-transparent hover:border-blue-100 hover:bg-slate-50 shadow-sm'
        } ${isCompact ? 'h-[120px] py-3' : 'h-[110px]'}`}
        style={{ width: `${width}%` }}
      >
        <div className="text-[13px] font-black mb-1">{label}</div>
        
        {id === 'INTENT' ? (
          <div className="flex flex-col items-center space-y-1 mt-1">
            <div className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-slate-600'}`}>
              进入：{count.toLocaleString()}
            </div>
            <div className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-slate-600'}`}>
              整体准确率：{accuracy}
            </div>
            <div className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-slate-600'}`}>
              全链路平均耗时：{latency}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                isSelected ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
              }`}>
                {enteringLabel || '进入'}：{count.toLocaleString()}
              </div>
              {accuracy && (
                <div className="group/acc relative">
                  <div className={`text-[10px] font-black px-2 py-0.5 rounded-full cursor-help transition-all ${
                    isSelected ? 'bg-white/20' : 'bg-emerald-500 text-white'
                  }`}>
                    {accuracyLabel || '准确率'}：{accuracy}
                  </div>
                  {accuracyTooltip && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/acc:block w-56 p-3 bg-slate-900 text-white text-[10px] rounded-xl shadow-2xl z-50 leading-relaxed font-medium pointer-events-none">
                      <div className="text-emerald-400 mb-1 font-black uppercase tracking-tighter">指标说明</div>
                      {accuracyTooltip}
                    </div>
                  )}
                </div>
              )}
              {latency && (
                <div className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm ${
                  isSelected ? 'bg-white/20' : 'bg-blue-500 text-white'
                }`}>
                  {latencyLabel || '平均耗时'}：{latency}
                </div>
              )}
            </div>
            
            {metrics && metrics.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 px-6">
                {metrics.map((m, i) => (
                  <div key={i} className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : 'text-slate-500'} flex items-center`}>
                    <div className={`w-1 h-1 rounded-full mr-1.5 ${isSelected ? 'bg-white/40' : 'bg-slate-300'}`}></div>
                    {m}
                  </div>
                ))}
              </div>
            )}

            {remark && !isSelected && (
              <div className="mt-2 text-[9px] font-bold text-slate-400 italic flex items-center px-4 text-center">
                <HelpCircle size={10} className="mr-1 opacity-50 shrink-0" />
                <span className="truncate">{remark}</span>
              </div>
            )}
          </>
        )}

        {isSelected && (
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rotate-45 border-t-2 border-r-2 border-blue-100"></div>
        )}
      </div>

      {flowIn && showFlowLabel && (
        <div className="flex flex-col items-center justify-center" style={{ height: '60px' }}>
          <div className="h-8 w-[2px] bg-slate-200"></div>
          <div className="relative">
            <ChevronDown size={16} className="text-slate-300 -mt-1" />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shadow-sm">
              向下流转：{flowIn}条
            </div>
          </div>
        </div>
      )}

      {/* Dashed connector logic for sub-steps is handled by the parent loop, 
          but we could add a placeholder for single steps if they wanted a label there. 
          Currently we only show the label on solid path. */}
    </div>
  );
};

const QualityCard: React.FC<{ title: string; value: string; unit?: string; tooltip: string; isWarning?: boolean }> = ({ title, value, unit, tooltip, isWarning }) => {
  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-blue-200 transition-all group relative">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate mr-1" title={title}>{title}</div>
        <div className="group/tip relative">
          <HelpCircle size={12} className="text-slate-300 cursor-help" />
          <div className="absolute top-full right-0 mt-2 hidden group-hover/tip:block w-48 p-2 bg-slate-800 text-white text-[9px] rounded-lg shadow-xl z-[100] leading-relaxed font-medium pointer-events-none">
            {tooltip}
          </div>
        </div>
      </div>
      <div className="flex items-baseline space-x-1">
        <div className={`text-lg font-black tracking-tight ${isWarning ? 'text-rose-600' : 'text-slate-800'}`}>{value}</div>
        {unit && <span className="text-[10px] font-bold text-slate-400">{unit}</span>}
      </div>
    </div>
  );
};

export default AssistantFunnelDashboard3;
