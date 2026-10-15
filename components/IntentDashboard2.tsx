import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Clock, 
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  BarChart3,
  Table as TableIcon
} from 'lucide-react';

const IntentDashboard2: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [showHumanMetrics, setShowHumanMetrics] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'model' | 'human'; direction: 'asc' | 'desc' }>({
    key: 'model',
    direction: 'desc'
  });
  const pageSize = 8;

  // Data logic
  const getStats = () => {
    const isToday = timeRange === 'today';
    const base = timeRange === '30d' ? {
      totalVolume: 45800,
      model: { samples: 5420, acc: '68.2%', miss: '12.1%', cat: '9.8%', false: '9.9%' },
      human: { samples: 5100, acc: '94.5%', miss: '2.4%', cat: '1.5%', false: '1.6%' }
    } : {
      totalVolume: 8900,
      model: { samples: 1250, acc: '70.0%', miss: '10.0%', cat: '10.0%', false: '10.0%' },
      human: { samples: 1180, acc: '96.2%', miss: '1.8%', cat: '1.2%', false: '0.8%' }
    };

    if (isToday) {
      return {
        totalVolume: 1250,
        totalSamples: { model: 156, human: '-' },
        globalAccuracy: { model: '72.4%', human: '-' },
        missedRate: { model: '8.2%', human: '-' },
        categoryMisjudgmentRate: { model: '11.5%', human: '-' },
        falseIntentRate: { model: '7.9%', human: '-' },
        avgLatency: 312,
      };
    }

    return {
      totalVolume: base.totalVolume,
      totalSamples: { model: base.model.samples, human: base.human.samples },
      globalAccuracy: { model: base.model.acc, human: base.human.acc },
      missedRate: { model: base.model.miss, human: base.human.miss },
      categoryMisjudgmentRate: { model: base.model.cat, human: base.human.cat },
      falseIntentRate: { model: base.model.false, human: base.human.false },
      avgLatency: timeRange === '30d' ? 358 : 342,
    };
  };

  const getTopIntents = () => {
    const base = [
      { name: '转账限额查询', value: 420 },
      { name: '信用卡挂失', value: 380 },
      { name: '余额查询', value: 310 },
      { name: '支付密码重置', value: 290 },
      { name: '贷款申请咨询', value: 240 },
      { name: '开户网点查询', value: 210 },
      { name: '理财产品赎回', value: 180 },
      { name: '汇率查询', value: 150 },
    ];
    const factor = timeRange === 'today' ? 0.12 : (timeRange === '30d' ? 4.3 : 1);
    return base.map(item => ({ ...item, value: Math.round(item.value * factor) }));
  };

  const getCategoryAccuracy = () => {
    const humanAnnotated = timeRange !== 'today';
    const base = [
      { name: '转账限额查询', model: 92, human: 98 },
      { name: '信用卡挂失', model: 88, human: 97 },
      { name: '余额查询', model: 85, human: 95 },
      { name: '支付密码重置', model: 82, human: 94 },
      { name: '贷款申请咨询', model: 78, human: 92 },
      { name: '开户网点查询', model: 95, human: 99 },
      { name: '理财产品赎回', model: 81, human: 93 },
      { name: '汇率查询', model: 90, human: 98 },
      { name: '投诉建议', model: 74, human: 90 },
      { name: '人工服务', model: 68, human: 85 },
      { name: '分期业务咨询', model: 84, human: 96 },
      { name: '额度提升申请', model: 77, human: 91 },
      { name: '地址信息变更', model: 96, human: 99 },
      { name: '积分兑换查询', model: 89, human: 97 },
      { name: '反欺诈验证', model: 91, human: 98 },
    ];
    return humanAnnotated ? base : base.map(item => ({ ...item, human: '-' }));
  };

  const stats = getStats();
  const topIntents = getTopIntents();
  const rawCategoryData = getCategoryAccuracy();

  // Sorting logic
  const handleSort = (key: 'name' | 'model' | 'human') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
    setCurrentPage(1);
  };

  const sortedData = [...rawCategoryData].sort((a, b) => {
    const modifier = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.key === 'name') {
      return a.name.localeCompare(b.name) * modifier;
    }
    const valA = a[sortConfig.key] === '-' ? -1 : (a[sortConfig.key] as number);
    const valB = b[sortConfig.key] === '-' ? -1 : (b[sortConfig.key] as number);
    return (valA - valB) * modifier;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden text-slate-700">
      {/* Structural Header */}
      <div className="bg-white px-8 py-4 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center space-x-8">
          <div>
            <h2 className="text-base font-bold text-slate-900">意图质量监测中心</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Intent Performance Hub V2.0</p>
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
            {['today', '7d', '30d'].map(t => (
              <button
                key={t}
                onClick={() => { setTimeRange(t); setCurrentPage(1); }}
                className={`px-5 py-1.5 rounded-md text-[11px] font-bold transition-all ${timeRange === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t === 'today' ? '今日' : t === '7d' ? '周报' : '月报'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">人工对照</span>
            <button 
              onClick={() => setShowHumanMetrics(!showHumanMetrics)}
              className={`w-10 h-5 rounded-full transition-colors relative border border-slate-200 ${showHumanMetrics ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${showHumanMetrics ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>
          <button className="flex items-center space-x-2 px-5 py-2 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition-all shadow-md">
            <Download size={14} />
            <span>导出深度评估报告</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {/* Core Stats Section */}
        <div className="grid grid-cols-7 gap-4">
          <StatBox title="样本总量" value={stats.totalVolume.toLocaleString()} unit="条" icon={Clock} />
          <StatBox title={`评估样本${showHumanMetrics ? '(模|人)' : ''}`} value={showHumanMetrics ? `${stats.totalSamples.model} | ${stats.totalSamples.human}` : stats.totalSamples.model.toString()} unit="例" icon={Filter} highlight />
          <StatBox title="平均响应耗时" value={`${stats.avgLatency}`} unit="ms" />
          <StatBox title="意图准确率" value={showHumanMetrics ? `${stats.globalAccuracy.model} | ${stats.globalAccuracy.human}` : stats.globalAccuracy.model} color="emerald" />
          <StatBox title="意图漏判率" value={showHumanMetrics ? `${stats.missedRate.model} | ${stats.missedRate.human}` : stats.missedRate.model} color="rose" />
          <StatBox title="意图错判率" value={showHumanMetrics ? `${stats.categoryMisjudgmentRate.model} | ${stats.categoryMisjudgmentRate.human}` : stats.categoryMisjudgmentRate.model} color="orange" />
          <StatBox title="虚假意图率" value={showHumanMetrics ? `${stats.falseIntentRate.model} | ${stats.falseIntentRate.human}` : stats.falseIntentRate.model} color="indigo" />
        </div>

        {/* Two-Column Detail View */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Top Intent Distribution */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-[12px] font-black text-slate-800 mb-8 flex items-center uppercase tracking-widest">
              <BarChart3 size={18} className="text-blue-500 mr-2" />
              业务意图分布 TOP8
            </h3>
            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topIntents} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={11} width={100} tick={{ fill: '#64748b', fontWeight: 600 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 10, 10, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table with Pagination & Sorting */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[550px]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
              <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest flex items-center">
                <TableIcon size={18} className="text-indigo-500 mr-2" />
                单类意图效能明细
              </h3>
              <div className="text-[10px] text-slate-400 font-bold bg-white px-3 py-1 rounded-full border border-slate-200 uppercase tracking-tighter">
                Total {rawCategoryData.length} Intent Units
              </div>
            </div>
            <div className="flex-1 overflow-hidden overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] border-b border-slate-100 bg-white">
                    <th className="px-8 py-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('name')}>
                      <div className="flex items-center">业务场景 <ArrowUpDown size={12} className="ml-1 opacity-30" /></div>
                    </th>
                    <th className="px-8 py-4 text-right cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('model')}>
                      <div className="flex items-center justify-end">模型准确率 <ArrowUpDown size={12} className="ml-1 opacity-30" /></div>
                    </th>
                    {showHumanMetrics && (
                      <th className="px-8 py-4 text-right cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('human')}>
                        <div className="flex items-center justify-end">人工(对照) <ArrowUpDown size={12} className="ml-1 opacity-30" /></div>
                      </th>
                    )}
                    <th className="px-8 py-4 text-center">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-4 text-[13px] font-bold text-slate-700 group-hover:text-blue-600">{item.name}</td>
                      <td className="px-8 py-4 text-right font-mono text-[13px] text-slate-900">{item.model}%</td>
                      {showHumanMetrics && (
                        <td className="px-8 py-4 text-right font-mono text-[13px] text-blue-600 font-black">
                          {item.human === '-' ? '-' : `${item.human}%`}
                        </td>
                      )}
                      <td className="px-8 py-4">
                        <div className="flex justify-center">
                          <span className={`w-2 h-2 rounded-full ring-4 ring-offset-0 ${
                            item.model >= 90 ? 'bg-emerald-500 ring-emerald-50' : 
                            item.model >= 80 ? 'bg-blue-500 ring-blue-50' : 
                            'bg-orange-500 ring-orange-50'
                          }`}></span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination UI */}
            <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-white rounded-b-xl">
              <span className="text-[11px] text-slate-400 font-black uppercase tracking-tighter">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center space-x-1.5 px-3">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-[11px] font-black transition-all ${currentPage === page ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ title: string; value: string; unit?: string; icon?: any; color?: string; highlight?: boolean }> = ({ title, value, unit, icon: Icon, color = 'slate', highlight }) => {
  const colorMap: Record<string, string> = {
    slate: 'text-slate-900',
    emerald: 'text-emerald-600',
    rose: 'text-rose-600',
    orange: 'text-orange-600',
    indigo: 'text-indigo-600',
    blue: 'text-blue-600'
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.1em] leading-none">{title}</span>
        {Icon && <Icon size={14} className="text-slate-200" />}
      </div>
      <div className="flex items-baseline space-x-1">
        <span className={`text-xl font-black tracking-tighter ${highlight ? 'text-blue-600' : colorMap[color]}`}>
          {value}
        </span>
        {unit && <span className="text-[10px] font-bold text-slate-300">{unit}</span>}
      </div>
    </div>
  );
};

export default IntentDashboard2;
