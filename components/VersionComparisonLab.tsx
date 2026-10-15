import React, { useState, useMemo } from 'react';
import { 
  Play, 
  ChevronDown, 
  ChevronRight,
  Download, 
  Activity,
  Search,
  ArrowRight,
  MessageSquare,
  RefreshCw,
  Calendar,
  Filter,
  HelpCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

type LabStatus = 'IDLE' | 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
type FunnelLayer = 'ENTRANCE' | 'FILTER' | 'REWRITE' | 'INTENT' | 'RETRIEVAL' | 'RRF' | 'RERANK' | 'INTENT_BRANCH';

const VersionComparisonLab: React.FC<{ onPushGray: () => void }> = ({ onPushGray }) => {
  const [status, setStatus] = useState<LabStatus>('IDLE');
  const [selectedLayer, setSelectedLayer] = useState<FunnelLayer>('ENTRANCE');
  const [selectedSubStep, setSelectedSubStep] = useState<FunnelLayer | null>(null);
  const [activeErrorTab, setActiveErrorTab] = useState<'fixed' | 'bad' | 'legacy'>('bad');
  const [timeRange, setTimeRange] = useState('7d');

  // Exact Data - Cloned from Dashboard 3 but with "Experimental" additions
  const stats = [
    { title: '客户原始消息', value: '1,000', baseline: '1,000', unit: '条' },
    { title: '过滤全局准确率', value: '85%', baseline: '82%', unit: '' },
    { title: 'Query 整体准确率', value: '92%', baseline: '90%', unit: '' },
    { title: '意图全局准确率', value: '62%', baseline: '56%', unit: '', isCritical: true },
    { title: '平均总耗时', value: '0.95', baseline: '1.2', unit: 's' },
  ];

  const funnelSteps = [
    { 
      id: 'ENTRANCE' as FunnelLayer, 
      label: '① 客户原始消息', 
      count: 1000, 
      baselineCount: 1000,
      metrics: ['消息总量：1000条'],
      flowIn: 1000
    },
    { 
      id: 'FILTER' as FunnelLayer, 
      label: '② TurnGate 过滤层', 
      count: 1000, 
      baselineCount: 1000,
      accuracy: '85%',
      baselineAccuracy: '82%',
      latency: '180ms',
      baselineLatency: '200ms',
      accuracyTooltip: '衡量过滤层对非法消息拦截及合法消息放行的准确程度。',
      metrics: [],
      flowIn: 620
    },
    { 
      id: 'REWRITE' as FunnelLayer, 
      label: '③ Query 改写层', 
      count: 620, 
      baselineCount: 600,
      accuracy: '92%',
      baselineAccuracy: '90%',
      latency: '550ms',
      baselineLatency: '600ms',
      accuracyTooltip: '全进入改写层消息综合效果。',
      metrics: [],
      flowIn: 580
    },
    { 
      id: 'INTENT' as FunnelLayer, 
      label: '④ 意图识别层', 
      count: 580, 
      baselineCount: 540,
      accuracy: '62%',
      baselineAccuracy: '56%',
      latency: '350ms',
      baselineLatency: '400ms',
      accuracyTooltip: '衡量意图识别分类的准确度。',
      metrics: [
        '测试: TP 62% | FP 16% | FN 22%',
        '基线: TP 56% | FP 19% | FN 25%'
      ],
      flowIn: 580,
      subSteps: [
        { id: 'RETRIEVAL', label: '混合检索', metrics: ['测试: 91.5%', '基线: 88.2%'], latency: '140ms', baselineLatency: '150ms' },
        { id: 'RRF', label: 'RRF粗排', metrics: ['测试: 93.0%', '基线: 92.1%'], latency: '40ms', baselineLatency: '45ms' },
        { id: 'RERANK', label: 'Reranker精排', metrics: ['测试: 88.5%', '基线: 82.4%'], latency: '200ms', baselineLatency: '220ms' },
        { id: 'INTENT_BRANCH', label: '意图双分支', metrics: ['分流优化已执行'], latency: '110ms', baselineLatency: '120ms', remark: '备注：算法优化后链路分支分布' },
      ]
    }
  ];

  const handleRunBatch = () => {
    setStatus('QUEUED');
    setTimeout(() => {
      setStatus('RUNNING');
      setTimeout(() => setStatus('COMPLETED'), 2000);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      {/* Top Header - Exact Match */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0 z-20 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-[12px] font-bold text-slate-700">2026-08-12 ~ 2026-08-19</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['今天', '7d', '30d'].map((r) => (
              <button
                key={r}
                disabled={status === 'RUNNING' || status === 'QUEUED'}
                onClick={() => setTimeRange(r)}
                className={`px-5 py-1.5 rounded-md text-[12px] font-bold transition-all ${
                  timeRange === r 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                } disabled:opacity-50`}
              >
                {r === '今天' ? '今天' : r === '7d' ? '近7天' : '近30天'}
              </button>
            ))}
          </div>

          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleRunBatch}
            disabled={status === 'RUNNING' || status === 'QUEUED' || status === 'COMPLETED'}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[13px] font-black transition-all shadow-lg ${
              status === 'COMPLETED' 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
            }`}
          >
            {status === 'RUNNING' ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
            <span>执行跑批</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {status === 'IDLE' || status === 'QUEUED' || status === 'RUNNING' ? (
          <div className="flex flex-col items-center justify-center h-[500px] bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center p-12">
            <div className="relative mb-10">
              {status === 'RUNNING' || status === 'QUEUED' ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20 scale-150"></div>
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 relative z-10 shadow-inner">
                    <RefreshCw size={44} className="animate-spin" />
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <Activity size={44} />
                </div>
              )}
            </div>
            {status === 'IDLE' && (
              <h4 className="font-black text-2xl mb-3 text-slate-600">
                请选择时间样本区间
              </h4>
            )}
            <p className="text-slate-400 text-[15px] font-medium max-w-md mx-auto leading-relaxed">
              {status === 'IDLE' ? '点击【执行跑批】生成对比结果' : '执行中请稍候...'}
            </p>
            {(status === 'RUNNING' || status === 'QUEUED') && (
              <div className="mt-10 w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="h-full bg-blue-500"
                />
              </div>
            )}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
            {/* Top Stats - Exact Clone of Dashboard 3 StatCard */}
            <div className="grid grid-cols-5 gap-4">
              {stats.map((s, i) => (
                <StatCard 
                  key={i} 
                  title={s.title} 
                  value={s.value} 
                  unit={s.unit} 
                  isCritical={s.isCritical}
                  baseline={s.baseline}
                />
              ))}
            </div>

            <div className="grid grid-cols-12 gap-6 items-start">
              {/* Left Column: Funnel - Exact Clone of Dashboard 3 FunnelStep */}
              <div className="col-span-12 lg:col-span-5 space-y-4">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center mb-4">
                  <Filter size={14} className="mr-2 text-blue-500" /> 全链路对比
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
                          }}
                          width={100 - idx * 8}
                          showFlowLabel={!isIntent}
                        />
                        
                        {isIntent && step.subSteps && (
                          <div className="relative mt-0 mb-10 space-y-4 flex flex-col items-center w-full">
                            <div className="h-6 w-0.5 border-l-2 border-dashed border-slate-200"></div>
                            {step.subSteps.map((sub, subIdx) => {
                              const subWidth = (100 - idx * 8) - 4 - (subIdx * 4);
                              return (
                                <React.Fragment key={sub.id}>
                                  <FunnelStep 
                                    {...sub}
                                    id={sub.id as FunnelLayer}
                                    label={`④-${subIdx + 1} ${sub.label}`}
                                    count={step.count}
                                    baselineCount={step.baselineCount}
                                    isSelected={selectedSubStep === sub.id}
                                    onSelect={() => {
                                      setSelectedLayer('INTENT');
                                      setSelectedSubStep(sub.id as FunnelLayer);
                                    }}
                                    width={subWidth}
                                    isSubStep={true}
                                  />
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

              {/* Right Column Panel - Exact Clone of Dashboard 3 Panel Layout */}
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
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">
                          {selectedSubStep 
                            ? funnelSteps.find(s => s.id === 'INTENT')?.subSteps?.find(sub => sub.id === selectedSubStep)?.label 
                            : funnelSteps.find(s => s.id === selectedLayer)?.label}
                        </h4>
                      </div>
                      {!selectedSubStep && (
                        <button className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition-all shadow-sm">
                          <Download size={14} />
                          <span>导出评测样本</span>
                        </button>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                      {selectedLayer === 'ENTRANCE' && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-20">
                          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
                            <MessageSquare size={40} />
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="text-3xl font-black text-slate-900">1,000 条</div>
                              <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">测试版本总量</div>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                              <div className="text-2xl font-bold text-slate-400">1,000 条</div>
                              <div className="text-[10px] text-slate-300 font-bold mt-1 uppercase tracking-widest">基线版本总量</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedLayer === 'FILTER' && (
                        <div className="space-y-6 flex flex-col h-full overflow-y-auto custom-scrollbar pr-2">
                          {/* Section 1: Model Business Quality */}
                          <div className="space-y-3">
                            <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                              <Activity size={14} className="text-blue-500 mr-2" /> 模型业务质量指标
                            </h5>
                            <div className="grid grid-cols-6 gap-2">
                              <QualityCard title="拦截准确率" value="80.0%" baseline="78.5%" tooltip="拦截准确率：模型识别为需要拦截的样本中，真实确需拦截的占比。" />
                              <QualityCard title="放行准确率" value="83.3%" baseline="81.0%" tooltip="放行准确率：模型识别为应当放行的样本中，真实确应放行的占比。" />
                              <QualityCard title="业务放行召回率" value="86.2%" baseline="84.0%" tooltip="Judge 判定本该放行的全部正常消息中，被 TurnGate 成功放行的比例。" />
                              <QualityCard title="误拦截率" value="8.0%" baseline="9.2%" isWarning={true} tooltip="误拦截率：真实应放行的正常消息中，被错误拦截的占比。" />
                              <QualityCard title="漏拦截率" value="10.0%" baseline="12.0%" isWarning={true} tooltip="漏拦截率：真实风险消息中，被错误放行的占比。" />
                              <QualityCard title="轮次类型准确率" value="88.5%" baseline="86.0%" tooltip="TurnGate 输出的轮次分类标记，和 Judge 评估模型分类标记完全一致的占比。" />
                            </div>
                          </div>

                          {/* Section 2: Performance & Benchmark */}
                          <div className="space-y-3">
                            <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                              <RefreshCw size={14} className="text-emerald-500 mr-2" /> 性能 & 评测基准
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                              <QualityCard title="平均推理耗时" value="200ms" baseline="220ms" tooltip="TurnGate 模块单条消息平均推理耗时。" />
                              <QualityCard title="JUDGE 标注准确性" value="96.5%" baseline="95.8%" tooltip="通过人工抽样复核 Judge 评测结果得到。" />
                            </div>
                          </div>

                          {/* Section 3: Global Distribution */}
                          <div className="flex-1 space-y-3 pt-4 border-t border-slate-100">
                            <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                              <Filter size={14} className="text-indigo-500 mr-2" /> 消息结果分布对比 (测试 vs 基线)
                            </h5>
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col space-y-6">
                              <div className="grid grid-cols-2 gap-8">
                                {/* Test Chart */}
                                <div className="flex flex-col items-center">
                                  <div className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">测试版本分布</div>
                                  <div className="h-[160px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={[
                                            { name: '正确拦截', value: 32, color: '#10b981' },
                                            { name: '漏拦截', value: 10, color: '#f59e0b' },
                                            { name: '正确放行', value: 50, color: '#3b82f6' },
                                            { name: '误拦截', value: 8, color: '#8b5cf6' },
                                          ]}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={45}
                                          outerRadius={65}
                                          paddingAngle={4}
                                          dataKey="value"
                                        >
                                          <Cell fill="#10b981" />
                                          <Cell fill="#f59e0b" />
                                          <Cell fill="#3b82f6" />
                                          <Cell fill="#8b5cf6" />
                                        </Pie>
                                        <RechartsTooltip />
                                      </PieChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>

                                {/* Baseline Chart */}
                                <div className="flex flex-col items-center">
                                  <div className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">基线版本分布</div>
                                  <div className="h-[160px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={[
                                            { name: '正确拦截', value: 28, color: '#10b981' },
                                            { name: '漏拦截', value: 12, color: '#f59e0b' },
                                            { name: '正确放行', value: 52, color: '#3b82f6' },
                                            { name: '误拦截', value: 8, color: '#8b5cf6' },
                                          ]}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={45}
                                          outerRadius={65}
                                          paddingAngle={4}
                                          dataKey="value"
                                        >
                                          <Cell fill="#10b981" />
                                          <Cell fill="#f59e0b" />
                                          <Cell fill="#3b82f6" />
                                          <Cell fill="#8b5cf6" />
                                        </Pie>
                                        <RechartsTooltip />
                                      </PieChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              </div>

                              {/* Legend & Deltas */}
                              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-50">
                                {[
                                  { name: '正确拦截', t: 32, b: 28, color: 'bg-emerald-500', isPositive: true },
                                  { name: '正确放行', t: 50, b: 52, color: 'bg-blue-500', isPositive: true },
                                  { name: '漏拦截', t: 10, b: 12, color: 'bg-orange-500', isPositive: false },
                                  { name: '误拦截', t: 8, b: 8, color: 'bg-violet-500', isPositive: false },
                                ].map((item, idx) => {
                                  const diff = item.t - item.b;
                                  const isBetter = item.isPositive ? diff > 0 : diff < 0;
                                  return (
                                    <div key={idx} className="flex flex-col space-y-1">
                                      <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                        <span className="text-[11px] font-bold text-slate-500">{item.name}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-[13px] font-black text-slate-800">{item.t}%</span>
                                        <span className={`text-[9px] font-black ${diff === 0 ? 'text-slate-300' : isBetter ? 'text-emerald-500' : 'text-rose-500'}`}>
                                          {diff > 0 ? '+' : ''}{diff}%
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedLayer === 'REWRITE' && (
                        <div className="space-y-6 flex flex-col h-full">
                          <div className="flex items-center justify-between flex-shrink-0">
                            <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                              <Activity size={14} className="text-indigo-500 mr-2" /> 3 Query 改写层
                            </h5>
                            <button className="flex items-center space-x-2 px-3 py-1.5 bg-[#0f172a] text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition-all shadow-sm">
                              <Download size={13} />
                              <span>导出评测样本</span>
                            </button>
                          </div>

                          <div className="space-y-4">
                            <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center px-2">
                              <Activity size={14} className="text-blue-500 mr-2" /> 1、改写前置分类分布 (测试 vs 基线)
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                <div className="text-[10px] font-black text-slate-400 mb-4 text-center uppercase tracking-widest">测试版本分布</div>
                                <div className="h-[240px]">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                      <Pie
                                        data={[
                                          { name: '修正覆盖', value: 15, color: '#10b981' },
                                          { name: '增量合并', value: 10, color: '#64748b' },
                                          { name: '指代消解', value: 12, color: '#6366f1' },
                                          { name: '无需改写', value: 40, color: '#3b82f6' },
                                          { name: '桥接指代', value: 10, color: '#94a3b8' },
                                          { name: '省略补全', value: 13, color: '#ef4444' },
                                        ]}
                                        cx="40%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value"
                                        labelLine={true}
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                      >
                                        {[
                                          '#10b981', '#64748b', '#6366f1', '#3b82f6', '#94a3b8', '#ef4444'
                                        ].map((color, index) => (
                                          <Cell key={`cell-${index}`} fill={color} stroke="none" />
                                        ))}
                                      </Pie>
                                      <Legend 
                                        layout="vertical" verticalAlign="middle" align="right" 
                                        iconType="rect" 
                                        wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingLeft: '20px' }} 
                                      />
                                      <RechartsTooltip />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                              <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 opacity-75">
                                <div className="text-[10px] font-black text-slate-400 mb-4 text-center uppercase tracking-widest">基线版本分布</div>
                                <div className="h-[240px]">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                      <Pie
                                        data={[
                                          { name: '无需改写', value: 42, color: '#3b82f6' },
                                          { name: '修正覆盖', value: 12, color: '#10b981' },
                                          { name: '省略补全', value: 15, color: '#ef4444' },
                                          { name: '指代消解', value: 10, color: '#6366f1' },
                                          { name: '桥接指代', value: 11, color: '#94a3b8' },
                                          { name: '增量合并', value: 10, color: '#64748b' },
                                        ]}
                                        cx="40%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value"
                                        labelLine={false}
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                      >
                                        {[
                                          '#3b82f6', '#10b981', '#ef4444', '#6366f1', '#94a3b8', '#64748b'
                                        ].map((color, index) => (
                                          <Cell key={`cell-${index}`} fill={color} stroke="none" opacity={0.6} />
                                        ))}
                                      </Pie>
                                      <Legend 
                                        layout="vertical" verticalAlign="middle" align="right" 
                                        iconType="rect" 
                                        wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingLeft: '20px' }} 
                                      />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <QualityCard 
                              title="改写前置分类准确率" 
                              value="92.4%" 
                              baseline="89.5%" 
                              tooltip="改写模块对输入消息进行前置分类（如指代、省略等）的识别准确率" 
                            />
                            <QualityCard 
                              title="改写执行准确率" 
                              value="88.5%" 
                              baseline="85.2%" 
                              tooltip="经改写后生成的文本满足 Judge 判定合格的样本比例" 
                            />
                          </div>
                        </div>
                      )}

                      {selectedLayer === 'INTENT' && (
                        <div className="space-y-6 h-full flex flex-col">
                          {!selectedSubStep ? (
                            <div className="space-y-8 pb-4">
                              {/* 1. 全链路耗时总览表格 */}
                              <section>
                                <div className="flex items-center space-x-2 mb-4">
                                  <RefreshCw size={16} className="text-blue-500" />
                                  <h5 className="text-[14px] font-bold text-slate-800">全链路耗时总览 (测试 vs 基线)</h5>
                                </div>
                                <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                  <table className="w-full text-[12px] border-collapse">
                                    <thead>
                                      <tr className="bg-slate-100/50">
                                        <th className="py-2.5 px-4 text-left font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">阶段</th>
                                        <th className="py-2.5 px-4 text-right font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">测试版本</th>
                                        <th className="py-2.5 px-4 text-right font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">基线版本</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {[
                                        { label: 'Embedding', e: '25ms', b: '28ms' },
                                        { label: 'Sparse 检索', e: '45ms', b: '50ms' },
                                        { label: '向量检索', e: '80ms', b: '85ms' },
                                        { label: 'RRF', e: '10ms', b: '12ms' },
                                        { label: 'Reranker', e: '120ms', b: '135ms' },
                                      ].map((item, idx) => (
                                        <tr key={idx} className="hover:bg-white transition-colors group">
                                          <td className="py-2.5 px-4 text-slate-600 font-medium group-hover:text-blue-600 transition-colors">{item.label}</td>
                                          <td className="py-2.5 px-4 text-right text-blue-600 font-mono font-bold">{item.e}</td>
                                          <td className="py-2.5 px-4 text-right text-slate-400 font-mono">{item.b}</td>
                                        </tr>
                                      ))}
                                      <tr className="bg-blue-50/50">
                                        <td className="py-3 px-4 font-black text-slate-800">总计</td>
                                        <td className="py-3 px-4 text-right text-blue-700 font-mono font-black text-[14px]">280ms</td>
                                        <td className="py-3 px-4 text-right text-slate-500 font-mono text-[14px]">310ms</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </section>

                              {/* 2. 全局效果大盘 对齐 Dashboard 3 */}
                              <section>
                                <div className="flex items-center space-x-2 mb-4">
                                  <Activity size={16} className="text-emerald-500" />
                                  <h5 className="text-[14px] font-bold text-slate-800">全局效果大盘对比</h5>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <QualityCard title="整体意图准确率" value="56.0%" baseline="54.0%" tooltip="最终识别结果与人工标注一致的比例" />
                                  <QualityCard title="检索前 K 命中率" value="88.4%" baseline="86.5%" tooltip="检索阶段返回的 Top-K 候选结果中包含正确意图的比例" />
                                  <QualityCard title="RRF 前五命中率" value="72.1%" baseline="70.8%" tooltip="多路召回融合后 Top-5 候选结果中包含正确意图的比例" />
                                  <QualityCard title="Reranker 直出准确率" value="65.8%" baseline="62.4%" tooltip="重排序阶段直接判定为 Top-1 的意图准确率" />
                                  <QualityCard title="模型输出准确率" value="94.2%" baseline="92.5%" tooltip="LLM 在给定候选意图情况下选择正确的比例" />
                                </div>
                              </section>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {selectedSubStep === 'RETRIEVAL' && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-3">
                                    <QualityCard title="Sparse 检索前 K 命中率" value="88.4%" baseline="86.5%" tooltip="标准意图出现在 sparse 检索召回前 K 个候选中" />
                                    <QualityCard title="向量检索前 K 命中率" value="86.5%" baseline="84.2%" tooltip="标准意图出现在向量检索召回前 K 个候选中" />
                                    <QualityCard title="混检 Top1 准确率" value="68.2%" baseline="65.4%" tooltip="混合检索输出 Top1 候选命中标准意图占比" />
                                    <QualityCard title="混合检索平均耗时" value="150ms" baseline="165ms" tooltip="混合检索模块内部处理耗时对比" />
                                  </div>
                                </div>
                              )}
                              {selectedSubStep === 'RRF' && (
                                <div className="grid grid-cols-2 gap-4">
                                  <QualityCard title="RRF前五命中率" value="91.95%" baseline="90.5%" tooltip="标准意图出现在RRF融合前5个候选中" />
                                  <QualityCard title="RRF Hit@1" value="52.75%" baseline="51.2%" tooltip="RRF Top1命中样本占比" />
                                  <QualityCard title="零候选率" value="0.00%" baseline="0.05%" isWarning={true} tooltip="RRF融合候选为空的样本数占比" />
                                  <QualityCard title="混检Top1准确率" value="52.75%" baseline="51.2%" tooltip="RRF输出的Top1结果命中真值占比" />
                                </div>
                              )}
                              {selectedSubStep === 'RERANK' && (
                                <div className="grid grid-cols-2 gap-3">
                                  <QualityCard title="Reranker Top1 准确率" value="87.48%" baseline="84.2%" tooltip="Reranker Top1 命中的准确率对比" />
                                  <QualityCard title="Reranker 前五命中率" value="96.93%" baseline="95.1%" tooltip="标准意图出现在精排前 5 个候选中" />
                                  <QualityCard title="Reranker 直出准确率" value="93.98%" baseline="91.5%" tooltip="意图超过阈值且命中的直出分支准确率" />
                                  <QualityCard title="意图直出率" value="78.54%" baseline="76.2%" tooltip="超过直出阈值并直接输出的样本比例" />
                                  <QualityCard title="平均精排耗时" value="220ms" baseline="245ms" tooltip="Reranker 精排环节耗时对比" />
                                </div>
                              )}
                              {selectedSubStep === 'INTENT_BRANCH' && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <QualityCard title="直出路径准确率" value="72.4%" baseline="70.5%" tooltip="满足阈值直出分支正确率对比" />
                                    <QualityCard title="LLM 推理路径准确率" value="48.2%" baseline="46.5%" tooltip="进入 LLM 推理分支正确率对比" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
                                      <div className="text-[10px] font-black text-slate-400 mb-4 text-center uppercase tracking-widest">测试版本分流分布</div>
                                      <div className="h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                            <Pie
                                              data={[
                                                { name: 'Reranker直出', value: 72.4, color: '#3b82f6' },
                                                { name: 'LLM推理分支', value: 27.6, color: '#10b981' }
                                              ]}
                                              cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value"
                                              labelLine={false}
                                              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                            >
                                              <Cell fill="#3b82f6" stroke="none" />
                                              <Cell fill="#10b981" stroke="none" />
                                            </Pie>
                                            <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                                          </PieChart>
                                        </ResponsiveContainer>
                                      </div>
                                    </div>
                                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 opacity-70">
                                      <div className="text-[10px] font-black text-slate-400 mb-4 text-center uppercase tracking-widest">基线版本分流分布</div>
                                      <div className="h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                            <Pie
                                              data={[
                                                { name: 'Reranker直出', value: 70.5, color: '#3b82f6' },
                                                { name: 'LLM推理分支', value: 29.5, color: '#10b981' }
                                              ]}
                                              cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value"
                                              labelLine={false}
                                              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                            >
                                              <Cell fill="#3b82f6" stroke="none" opacity={0.6} />
                                              <Cell fill="#10b981" stroke="none" opacity={0.6} />
                                            </Pie>
                                            <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                                          </PieChart>
                                        </ResponsiveContainer>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- Components Cloned EXACTLY from AssistantFunnelDashboard3.tsx Style ---

const StatCard: React.FC<{ title: string; value: string; unit?: string; isCritical?: boolean; baseline?: string }> = ({ title, value, unit, isCritical, baseline }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none truncate pr-2" title={title}>{title}</span>
        {baseline ? (
          <div className="text-[10px] font-black text-emerald-500 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
            {parseFloat(value) > parseFloat(baseline) ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
            {Math.abs(((parseFloat(value) / parseFloat(baseline) - 1) * 100)).toFixed(1)}%
          </div>
        ) : (
          <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
            <Activity size={16} />
          </div>
        )}
      </div>
      <div className="flex items-baseline space-x-1">
        <div className="flex flex-col">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black tracking-tight text-slate-900">{value}</span>
            {unit && <span className="text-sm font-bold text-slate-300">{unit}</span>}
          </div>
          {baseline && (
            <div className="text-[10px] font-bold text-slate-300 mt-1 flex items-center">
              <span className="opacity-70">基线:</span>
              <span className="ml-1">{baseline}{unit}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FunnelStep: React.FC<any> = ({ 
  id, label, count, baselineCount, accuracy, baselineAccuracy, latency, baselineLatency, accuracyTooltip, metrics, flowIn, isSelected, onSelect, width, isSubStep, showFlowLabel = true 
}) => {
  const isCompact = id === 'FILTER' || id === 'REWRITE';

  return (
    <div className={`relative flex flex-col items-center w-full ${isSubStep ? 'group/subcard' : ''}`}>
      <div 
        onClick={onSelect}
        className={`relative transition-all cursor-pointer rounded-xl flex flex-col items-center justify-center border-2 select-none active:scale-[0.98] overflow-hidden ${
          isSelected 
            ? 'bg-blue-600 text-white border-blue-100 shadow-lg shadow-blue-100 z-10' 
            : 'bg-white text-slate-800 border-transparent hover:border-blue-100 hover:bg-slate-50 shadow-sm'
        } ${isCompact ? 'h-[120px] py-3' : 'h-[110px]'}`}
        style={{ width: `${width}%` }}
      >
        <div className="text-[13px] font-black mb-2">{label}</div>
        
        <div className="flex flex-col space-y-1.5 w-full">
          {/* Test Layer */}
          <div className="flex items-center justify-center space-x-1.5">
            <div className={`text-[9px] font-black px-1.5 py-0.5 rounded transition-colors flex items-center ${
              isSelected ? 'bg-white/20' : 'bg-blue-50 text-blue-600'
            }`}>
              <span className="opacity-70 mr-1">测试</span>
              <span className="font-black">{count}</span>
            </div>
            {accuracy && (
              <div className="group/acc relative">
                <div className={`text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center cursor-help ${
                  isSelected ? 'bg-white/20' : 'bg-emerald-500 text-white'
                }`}>
                  <span className={isSelected ? 'text-white/70' : 'text-emerald-100'}>准确率</span>
                  <span className="ml-0.5">{accuracy}</span>
                </div>
                {accuracyTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/acc:block w-56 p-3 bg-slate-900 text-white text-[10px] rounded-xl shadow-2xl z-50 leading-relaxed font-medium pointer-events-none">
                    <div className="text-emerald-400 mb-1 font-black uppercase tracking-tighter text-[9px]">指标说明</div>
                    {accuracyTooltip}
                  </div>
                )}
              </div>
            )}
            {latency && (
              <div className={`text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center ${
                isSelected ? 'bg-white/20' : 'bg-blue-500 text-white'
              }`}>
                <span className={isSelected ? 'text-white/70' : 'text-blue-100'}>耗时</span>
                <span className="ml-0.5">{latency}</span>
              </div>
            )}
          </div>

          {/* Baseline Layer */}
          <div className="flex items-center justify-center space-x-1.5">
            <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors flex items-center ${
              isSelected ? 'bg-white/10' : 'bg-slate-100 text-slate-400'
            }`}>
              <span className="opacity-70 mr-1 font-black">基线</span>
              <span>{baselineCount}</span>
            </div>
            {baselineAccuracy && (
              <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center ${
                isSelected ? 'bg-white/10' : 'bg-slate-100 text-slate-400'
              }`}>
                <span className="opacity-70 mr-1 font-black">准确率</span>
                <span>{baselineAccuracy}</span>
              </div>
            )}
            {baselineLatency && (
              <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center ${
                isSelected ? 'bg-white/10' : 'bg-slate-100 text-slate-400'
              }`}>
                <span className="opacity-70 mr-1 font-black">耗时</span>
                <span>{baselineLatency}</span>
              </div>
            )}
          </div>
        </div>
        
        {metrics && metrics.length > 0 && isSelected && (
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-0.5 px-4">
            {metrics.map((m: string, i: number) => (
              <div key={i} className="text-[8px] font-bold text-white/70 flex items-center">
                <div className="w-0.5 h-0.5 rounded-full mr-1 bg-white/40"></div>
                {m}
              </div>
            ))}
          </div>
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
            <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shadow-sm flex items-center">
              向下流转：
              <span className="font-black ml-1 text-[10px]">{flowIn}条</span>
              <span className="mx-1 opacity-30">/</span>
              <span className="opacity-50 font-bold">1000条</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const QualityCard: React.FC<{ 
  title: string; 
  value: string; 
  baseline: string; 
  tooltip: string;
  isWarning?: boolean;
}> = ({ title, value, baseline, tooltip, isWarning }) => {
  const unit = value.includes('ms') ? 'ms' : value.includes('%') ? '%' : '';
  const valNum = parseFloat(value);
  const baseNum = parseFloat(baseline);
  const diff = (valNum - baseNum).toFixed(1);
  const isBetter = isWarning ? parseFloat(diff) < 0 : parseFloat(diff) > 0;

  return (
    <div className="bg-[#f8fafc] p-3 rounded-xl border border-transparent hover:border-blue-200 transition-all group relative">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] font-bold text-slate-400 truncate mr-1" title={title}>{title}</div>
        <div className="group/tip relative">
          <HelpCircle size={12} className="text-slate-300 cursor-help" />
          <div className="absolute top-full right-0 mt-2 hidden group-hover/tip:block w-48 p-2 bg-slate-800 text-white text-[9px] rounded-lg shadow-xl z-50 leading-relaxed font-medium pointer-events-none">
            {tooltip}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-xl font-black tracking-tight text-slate-800">
          {value}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div className="text-[9px] font-bold text-slate-300 flex items-center">
            <span className="opacity-70">基线:</span>
            <span className="ml-1">{baseline}</span>
          </div>
          <div className={`text-[8px] font-black px-1 rounded ${isBetter ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
            {parseFloat(diff) > 0 ? '+' : ''}{diff}{unit}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionComparisonLab;
