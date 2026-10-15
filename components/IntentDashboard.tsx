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

const IntentDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Dynamic data generation based on timeRange
  const getStats = () => {
    switch(timeRange) {
      case 'today':
        return {
          totalVolume: 1250,
          totalSamples: 156,
          globalAccuracy: 72.4,
          missedRate: 8.2,
          categoryMisjudgmentRate: 11.5,
          falseIntentRate: 7.9,
          avgLatency: 312,
        };
      case '30d':
        return {
          totalVolume: 45800,
          totalSamples: 5420,
          globalAccuracy: 68.2,
          missedRate: 12.1,
          categoryMisjudgmentRate: 9.8,
          falseIntentRate: 9.9,
          avgLatency: 358,
        };
      default: // '7d'
        return {
          totalVolume: 8900,
          totalSamples: 1250,
          globalAccuracy: 70,
          missedRate: 10,
          categoryMisjudgmentRate: 10,
          falseIntentRate: 10,
          avgLatency: 342,
        };
    }
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
    const base = [
      { name: '转账限额查询', accuracy: 92 },
      { name: '信用卡挂失', accuracy: 88 },
      { name: '余额查询', accuracy: 85 },
      { name: '支付密码重置', accuracy: 82 },
      { name: '贷款申请咨询', accuracy: 78 },
      { name: '开户网点查询', accuracy: 95 },
      { name: '理财产品赎回', accuracy: 81 },
      { name: '汇率查询', accuracy: 90 },
      { name: '投诉建议', accuracy: 74 },
      { name: '人工服务', accuracy: 68 },
      { name: '手机银行激活', accuracy: 89 },
      { name: '网银限额调整', accuracy: 84 },
      { name: '跨行转账咨询', accuracy: 77 },
      { name: '结售汇业务', accuracy: 91 },
      { name: '金价实时查询', accuracy: 93 },
    ];

    const offset = timeRange === 'today' ? 2.4 : (timeRange === '30d' ? -1.8 : 0);
    return base.map(item => ({ 
      ...item, 
      accuracy: Math.min(100, Math.max(0, parseFloat((item.accuracy + offset).toFixed(1)))) 
    }));
  };

  const stats = getStats();
  const topIntents = getTopIntents();
  const singleCategoryAccuracy = getCategoryAccuracy();

  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'accuracy'; direction: 'asc' | 'desc' }>({
    key: 'accuracy',
    direction: 'desc'
  });
  const pageSize = 5;

  const handleSort = (key: 'name' | 'accuracy') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
    setCurrentPage(1); // Reset to first page on sort
  };

  const sortedData = [...singleCategoryAccuracy].sort((a, b) => {
    const modifier = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.key === 'name') {
      return a.name.localeCompare(b.name) * modifier;
    }
    return (a.accuracy - b.accuracy) * modifier;
  });

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#6366f1'];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      {/* Filters Header - Restored Time Switcher & Calendar */}
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
        <button className="flex items-center space-x-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] font-medium shadow-sm">
          <Download size={14} />
          <span>导出评测报告</span>
        </button>
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
            title="意图评估样本量" 
            value={stats.totalSamples.toLocaleString()} 
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
            title="全局意图准确率" 
            value={`${stats.globalAccuracy}%`} 
            icon={Target} 
            color="emerald"
            tooltip="公式 =（TP + TN） / 全部 Judge 标注句子条数。全部客户消息中，模型输出意图标签与 Judge 真值完全匹配的占比。"
          />
          <StatCard 
            title="意图漏判占比" 
            value={`${stats.missedRate}%`} 
            icon={AlertCircle} 
            color="rose"
            tooltip="分子：真实有意图但模型判无意图；分母：全部真实有意图句子。"
          />
          <StatCard 
            title="意图错判占比" 
            value={`${stats.categoryMisjudgmentRate}%`} 
            icon={AlertCircle} 
            color="orange"
            tooltip="分子：识别出有意图但分类错误；分母：全部真实有意图句子。"
          />
          <StatCard 
            title="虚假意图占比" 
            value={`${stats.falseIntentRate}%`} 
            icon={AlertCircle} 
            color="indigo"
            tooltip="分子：真实无意图模型识别有意图；分母：所有模型输出“有意图”的句子总数。"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TOP 10 Intents */}
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

          {/* Single Category Accuracy */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center">
                <span className="w-1 h-3 bg-orange-500 rounded-full mr-2"></span>
                单类意图准确率
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
                        onClick={() => handleSort('accuracy')}
                      >
                        <div className="flex items-center justify-end">
                          准确率
                          <ArrowUpDown size={12} className={`ml-1 transition-opacity ${sortConfig.key === 'accuracy' ? 'opacity-100' : 'opacity-0 group-hover/h:opacity-50'}`} />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginatedData.map((item, idx) => (
                      <tr key={idx} className="group">
                        <td className="py-4 text-[13px] text-slate-600 group-hover:text-blue-600 transition-colors">{item.name}</td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end space-x-3">
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${item.accuracy}%` }}
                              ></div>
                            </div>
                            <span className="text-[13px] font-bold text-slate-700 min-w-[40px]">{item.accuracy}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  第 {currentPage} / {totalPages} 页 (共 {singleCategoryAccuracy.length} 条)
                </span>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-7 h-7 rounded-md text-[11px] font-bold transition-all ${
                          currentPage === i + 1 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
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


export default IntentDashboard;
