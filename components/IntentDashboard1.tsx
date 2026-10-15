import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Target, 
  AlertCircle, 
  FileText,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const IntentDashboard1: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [showHumanMetrics, setShowHumanMetrics] = useState(true);

  // Dynamic data generation based on timeRange
  const getStats = () => {
    const isToday = timeRange === 'today';
    const humanAnnotated = !isToday;

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
      { name: '投诉建议', value: 120 },
      { name: '人工服务', value: 100 },
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
    ];

    if (!humanAnnotated) {
      return base.map(item => ({ ...item, model: item.model, human: '-' }));
    }

    return base;
  };

  const stats = getStats();
  const topIntents = getTopIntents();
  const categoryAccuracy = getCategoryAccuracy();

  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'model' | 'human'; direction: 'asc' | 'desc' }>({
    key: 'model',
    direction: 'desc'
  });
  const pageSize = 5;

  const handleSort = (key: 'name' | 'model' | 'human') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
    setCurrentPage(1);
  };

  const sortedData = [...categoryAccuracy].sort((a, b) => {
    const modifier = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.key === 'name') {
      return a.name.localeCompare(b.name) * modifier;
    }
    const valA = a[sortConfig.key] === '-' ? -1 : (a[sortConfig.key] as number);
    const valB = b[sortConfig.key] === '-' ? -1 : (b[sortConfig.key] as number);
    return (valA - valB) * modifier;
  });

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      {/* Filters Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button 
              onClick={() => setTimeRange('today')}
              className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all ${timeRange === 'today' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              今天
            </button>
            <button 
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all ${timeRange === '7d' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              近7天
            </button>
            <button 
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all ${timeRange === '30d' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              近30天
            </button>
          </div>
          <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
          <div className="flex items-center text-slate-500 text-[13px] space-x-2 border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-slate-50 transition-colors">
            <Calendar size={14} />
            <span>{timeRange === 'today' ? '2024-03-07 ~ 2024-03-07' : (timeRange === '30d' ? '2024-02-07 ~ 2024-03-07' : '2024-03-01 ~ 2024-03-07')}</span>
            <ChevronDown size={14} />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 mr-4">
            <span className="text-[13px] text-slate-500 font-medium">展示人工指标</span>
            <button 
              onClick={() => setShowHumanMetrics(!showHumanMetrics)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showHumanMetrics ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showHumanMetrics ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <button className="flex items-center space-x-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium shadow-sm">
            <Download size={14} />
            <span>导出评测报告</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Core Stats Grid - Adjusted to 7 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <StatCard 
            title="样本总量" 
            value={stats.totalVolume.toLocaleString()} 
            icon={FileText} 
            color="slate"
            tooltip="系统接收到的原始消息总条数（未经过意图识别过滤）。"
          />
          <StatCard 
            title={`意图评估样本量${showHumanMetrics ? '(模型|人工)' : ''}`} 
            value={showHumanMetrics ? `${stats.totalSamples.model.toLocaleString()} | ${stats.totalSamples.human.toLocaleString()}` : stats.totalSamples.model.toLocaleString()} 
            icon={Filter} 
            color="blue"
            tooltip="经过前置规则过滤后，进入意图识别环节并产生评估结果的样本数量。"
          />
          <StatCard 
            title="意图识别平均耗时" 
            value={`${stats.avgLatency}ms`} 
            icon={Clock} 
            color="slate"
          />
          <StatCard 
            title={`全局意图准确率${showHumanMetrics ? '(模型|人工)' : ''}`} 
            value={showHumanMetrics ? `${stats.globalAccuracy.model} | ${stats.globalAccuracy.human}` : stats.globalAccuracy.model} 
            icon={Target} 
            color="emerald"
            tooltip="（TP + TN） / 全部 Judge 标注句子条数。"
          />
          <StatCard 
            title={`意图漏判占比${showHumanMetrics ? '(模型|人工)' : ''}`} 
            value={showHumanMetrics ? `${stats.missedRate.model} | ${stats.missedRate.human}` : stats.missedRate.model} 
            icon={AlertCircle} 
            color="rose"
            tooltip="分子：真实有意图但模型判无意图；分母：全部真实有意图句子。"
          />
          <StatCard 
            title={`意图错判占比${showHumanMetrics ? '(模型|人工)' : ''}`} 
            value={showHumanMetrics ? `${stats.categoryMisjudgmentRate.model} | ${stats.categoryMisjudgmentRate.human}` : stats.categoryMisjudgmentRate.model} 
            icon={AlertCircle} 
            color="orange"
            tooltip="分子：识别出有意图但分类错误；分母：全部真实有意图句子。"
          />
          <StatCard 
            title={`虚假意图占比${showHumanMetrics ? '(模型|人工)' : ''}`} 
            value={showHumanMetrics ? `${stats.falseIntentRate.model} | ${stats.falseIntentRate.human}` : stats.falseIntentRate.model} 
            icon={AlertCircle} 
            color="indigo"
            tooltip="分子：真实无意图模型识别有意图；分母：所有模型输出“有意图”的句子总数。"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TOP 10 Intents - Not distinguished */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-800 flex items-center">
                <span className="w-1 h-3 bg-blue-500 rounded-full mr-2"></span>
                业务意图分布 TOP10
              </h3>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topIntents} layout="vertical" margin={{ left: 40, right: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={11}
                    width={100}
                    tick={{ fill: '#64748b' }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3b82f6" 
                    radius={[0, 4, 4, 0]} 
                    barSize={20}
                    label={{ position: 'right', fill: '#94a3b8', fontSize: 11, offset: 8 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Single Category Accuracy - Distinguished */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center">
                <span className="w-1 h-3 bg-orange-500 rounded-full mr-2"></span>
                单类意图准确率{showHumanMetrics ? '(模型|人工)' : ''}
              </h3>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="overflow-y-auto custom-scrollbar flex-1">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[12px] text-slate-400 border-b border-slate-100">
                      <th 
                        className="pb-3 font-medium cursor-pointer hover:text-blue-500 transition-colors group/h"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          业务场景
                          <ArrowUpDown size={12} className={`ml-1 transition-opacity ${sortConfig.key === 'name' ? 'opacity-100' : 'opacity-0 group-hover/h:opacity-50'}`} />
                        </div>
                      </th>
                      <th 
                        className="pb-3 font-medium text-right cursor-pointer hover:text-blue-500 transition-colors group/h"
                        onClick={() => handleSort('model')}
                      >
                        <div className="flex items-center justify-end">
                          模型准确率
                          <ArrowUpDown size={12} className={`ml-1 transition-opacity ${sortConfig.key === 'model' ? 'opacity-100' : 'opacity-0 group-hover/h:opacity-50'}`} />
                        </div>
                      </th>
                      {showHumanMetrics && (
                        <th 
                          className="pb-3 font-medium text-right cursor-pointer hover:text-blue-500 transition-colors group/h"
                          onClick={() => handleSort('human')}
                        >
                          <div className="flex items-center justify-end">
                            人工准确率
                            <ArrowUpDown size={12} className={`ml-1 transition-opacity ${sortConfig.key === 'human' ? 'opacity-100' : 'opacity-0 group-hover/h:opacity-50'}`} />
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginatedData.map((item, idx) => (
                      <tr key={idx} className="group">
                        <td className="py-4 text-[13px] text-slate-600 group-hover:text-blue-600 transition-colors">{item.name}</td>
                        <td className="py-4 text-right">
                          <span className="text-[13px] font-bold text-slate-700">{item.model}%</span>
                        </td>
                        {showHumanMetrics && (
                          <td className="py-4 text-right">
                            <span className={`text-[13px] font-bold ${item.human === '-' ? 'text-slate-300' : 'text-blue-600'}`}>
                              {item.human === '-' ? '-' : `${item.human}%`}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  第 {currentPage} / {totalPages} 页 (共 {categoryAccuracy.length} 条)
                </span>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: any;
  color: string;
  isNegative?: boolean;
  tooltip?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon: Icon, color, isNegative, tooltip }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    orange: 'bg-orange-50 text-orange-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    slate: 'bg-slate-50 text-slate-600'
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-colors relative">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorMap[color]} group-hover:scale-110 transition-transform`}>
          <Icon size={18} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-[11px] font-bold ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center space-x-1 mb-1">
          <div className="text-[12px] text-slate-400 font-medium">{title}</div>
          {tooltip && (
            <div className="group/tip relative">
              <AlertCircle size={12} className="text-slate-300 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all z-10 pointer-events-none">
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          )}
        </div>
        <div className="text-xl font-black text-slate-800">{value}</div>
      </div>
    </div>
  );
};


export default IntentDashboard1;
