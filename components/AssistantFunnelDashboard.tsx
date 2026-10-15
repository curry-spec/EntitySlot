import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
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
  Calendar,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type FunnelLayer = 'ENTRANCE' | 'FILTER' | 'REWRITE' | 'INTENT';

const AssistantFunnelDashboard: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<FunnelLayer>('ENTRANCE');
  const [timeRange, setTimeRange] = useState('7d');

  // Data - Constants
  const stats = [
    { title: '客户原始消息', value: '1,000', unit: '条' },
    { title: '过滤全局准确率', value: '82%', unit: '' },
    { title: 'Query 整体准确率', value: '90%', unit: '' },
    { title: '意图全局准确率', value: '56%', unit: '', isCritical: true },
    { title: '平均耗时', value: '1.2', unit: 's' },
    { title: 'Judge 整体准确性', value: '98%', unit: '' },
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
      metrics: [
        '正确拦截：32%', '误拦截：8%',
        '正确放行：50%', '漏拦截：10%'
      ],
      flowIn: 600
    },
    { 
      id: 'REWRITE' as FunnelLayer, 
      label: '③ Query 改写层', 
      count: 600, 
      accuracy: '90%',
      metrics: [
        '无需改写：40%', '轻度改写：30%',
        '重度改写：20%', '改写失败：10%'
      ],
      flowIn: 540
    },
    { 
      id: 'INTENT' as FunnelLayer, 
      label: '④ 意图识别层', 
      count: 540, 
      accuracy: '56%',
      metrics: [
        'TP 分类正确：56%', 'FN1 分类错误：15%',
        'FN2 漏识别：10%', 'FP 虚假意图：19%'
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

  const intentDetailData = [
    { name: '转账限额', error: 42 },
    { name: '信用卡挂失', error: 38 },
    { name: '余额查询', error: 31 },
    { name: '支付密码', error: 29 },
    { name: '贷款咨询', error: 24 },
  ];

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
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Assistant Funnel Dashboard</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="grid grid-cols-6 gap-4">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center mb-4">
              <Filter size={14} className="mr-2 text-blue-500" /> 全链路流转漏斗
            </h3>
            <div className="space-y-4 relative pr-10">
              {funnelSteps.map((step, idx) => (
                <FunnelStep 
                  key={step.id} 
                  {...step} 
                  isSelected={selectedLayer === step.id} 
                  onSelect={() => setSelectedLayer(step.id)}
                  width={100 - idx * 8}
                />
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 sticky top-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedLayer} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[500px] flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">{funnelSteps.find(s => s.id === selectedLayer)?.label}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Performance Analysis</p>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition-all shadow-sm">
                    <Download size={14} />
                    <span>导出评测样本</span>
                  </button>
                </div>

                <div className="flex-1 space-y-6">
                  {selectedLayer === 'ENTRANCE' && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
                        <MessageSquare size={40} />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-900">1,000 条</div>
                        <div className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-widest">Total Incoming Messages</div>
                      </div>
                    </div>
                  )}

                  {selectedLayer === 'FILTER' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">拦截准确率</div>
                          <div className="text-2xl font-black text-slate-800">80.0%</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">放行准确率</div>
                          <div className="text-2xl font-black text-slate-800">83.3%</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                          <Target size={14} className="text-rose-500 mr-2" /> 误拦/漏拦业务分布
                        </h5>
                        <div className="h-[220px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filterDetailData} layout="vertical" margin={{ left: 10 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={11} width={80} tick={{ fill: '#64748b', fontWeight: 600 }} />
                              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} />
                              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '10px', fontWeight: 700 }} />
                              <Bar dataKey="mis" name="误拦截" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={10} />
                              <Bar dataKey="missed" name="漏拦截" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={10} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedLayer === 'REWRITE' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                          <Activity size={14} className="text-emerald-500 mr-2" /> 改写类型分布
                        </h5>
                        <div className="h-[240px] flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={rewriteDetailData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={85}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {rewriteDetailData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ border: 'none', borderRadius: '8px' }} />
                              <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">改写失败</div>
                          <div className="text-2xl font-black text-slate-800">60 <span className="text-xs font-bold text-slate-400 ml-1">条</span></div>
                        </div>
                        <div className="text-right text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tighter">
                          主要失败原因：<br />
                          1. 推理超时 (42%) | 2. 语序混乱 (30%)
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedLayer === 'INTENT' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h5 className="text-[11px] font-black text-slate-700 uppercase flex items-center">
                          <Sparkles size={14} className="text-indigo-500 mr-2" /> 意图识别错误排名前5
                        </h5>
                        <div className="h-[240px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={intentDetailData} margin={{ left: 0, right: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} tick={{ fill: '#64748b', fontWeight: 600 }} />
                              <YAxis axisLine={false} tickLine={false} fontSize={11} tick={{ fill: '#64748b' }} />
                              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ border: 'none', borderRadius: '8px' }} />
                              <Bar dataKey="error" name="错误样本" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
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
  metrics: string[];
  flowIn?: number;
  isSelected: boolean;
  onSelect: () => void;
  width: number;
}

const FunnelStep: React.FC<FunnelStepProps> = ({ label, count, accuracy, metrics, flowIn, isSelected, onSelect, width }) => {
  return (
    <div className="relative flex flex-col items-center">
      <div 
        onClick={onSelect}
        className={`relative h-[110px] transition-all cursor-pointer rounded-xl flex flex-col items-center justify-center border-2 border-transparent select-none active:scale-[0.98] ${
          isSelected ? 'bg-blue-600 text-white border-blue-100 shadow-lg shadow-blue-100' : 'bg-white text-slate-800 hover:border-blue-100 hover:bg-slate-50 shadow-sm'
        }`}
        style={{ width: `${width}%` }}
      >
        <div className="text-[13px] font-black mb-1">{label}</div>
        <div className="flex items-center space-x-2">
          <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${isSelected ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>进入：{count.toLocaleString()}</div>
          {accuracy && (
            <div className={`text-[10px] font-black px-2 py-0.5 rounded ${isSelected ? 'bg-white/20' : 'bg-emerald-500 text-white'}`}>准确率：{accuracy}</div>
          )}
        </div>
        
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 px-6">
          {metrics.map((m, i) => (
            <div key={i} className={`text-[10px] font-bold opacity-70`}>{m}</div>
          ))}
        </div>

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

export default AssistantFunnelDashboard;
