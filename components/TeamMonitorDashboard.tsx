import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Filter, 
  HelpCircle, 
  Info, 
  Search, 
  RefreshCcw,
  Table as TableIcon,
  LayoutGrid
} from 'lucide-react';

interface AgentRecord {
  id: string;
  name: string;
  group: string;
  status: 'CALLING' | 'IDLE' | 'OFFLINE';
  duration: string;
  callCount: number;
  alertCount: number;
}

const MOCK_AGENTS: AgentRecord[] = [
  { id: 'S0021', name: '张三', group: '班组1/G0001', status: 'CALLING', duration: '10:00:00', callCount: 3, alertCount: 0 },
  { id: 'S0022', name: '李四', group: '班组1/G0001', status: 'IDLE', duration: '00:00:00', callCount: 2, alertCount: 1 },
  { id: 'S0023', name: '王五', group: '班组1/G0001', status: 'OFFLINE', duration: '00:00:00', callCount: 1, alertCount: 0 },
  { id: 'S0024', name: '张一', group: '班组1/G0001', status: 'CALLING', duration: '10:00:00', callCount: 3, alertCount: 1 },
  { id: 'S0025', name: '李一', group: '班组1/G0001', status: 'IDLE', duration: '00:00:00', callCount: 2, alertCount: 0 },
  { id: 'S0026', name: '王一', group: '班组1/G0001', status: 'OFFLINE', duration: '00:00:00', callCount: 1, alertCount: 1 },
];

interface AgentMonitorListProps {
  onMonitorCall?: (agentId: string, agentName: string) => void;
}

const AgentMonitorList: React.FC<AgentMonitorListProps> = ({ onMonitorCall }) => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');

  const stats = [
    { label: '在线人数', value: '2000', unit: '人', info: true },
    { label: '通话中人数', value: '2000', unit: '人', info: true },
  ];

  const filteredAgents = MOCK_AGENTS.filter(agent => {
    if (activeTab === 'ALL') return true;
    return agent.status === activeTab;
  });

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      {/* Header Filters */}
      <div className="bg-white p-4 border-b border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex bg-slate-100 rounded p-1">
          {['今天', '昨天', '近7天', '近30天'].map(t => (
            <button 
              key={t}
              className={`px-4 py-1 text-[13px] rounded ${t === '近30天' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 border border-slate-200 rounded px-3 py-1.5 bg-white">
          <Calendar size={14} className="text-slate-400" />
          <span className="text-[13px] text-slate-600">2026-06-02 至 2026-07-02</span>
        </div>

        <div className="flex-1"></div>

        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="flex items-center space-x-2 border border-slate-200 rounded px-3 py-1.5 bg-white min-w-[120px] justify-between cursor-pointer">
              <span className="text-[13px] text-slate-600">班组2</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
          <div className="relative group">
            <div className="flex items-center space-x-2 border border-slate-200 rounded px-3 py-1.5 bg-white min-w-[120px] justify-between cursor-pointer">
              <span className="text-[13px] text-slate-600">坐席2</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-bold text-slate-700">{stat.label}</span>
              </div>
              <div className="flex items-baseline justify-end">
                <span className="text-[28px] font-bold text-slate-900 tracking-tight">{stat.value}</span>
                {stat.unit && <span className="ml-1 text-[14px] text-slate-400 font-medium">{stat.unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
          {/* Table Header/Filters */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex space-x-6">
              {[
                { label: '全部', id: 'ALL' },
                { label: '通话中', id: 'CALLING' },
                { label: '空闲', id: 'IDLE' },
                { label: '离线', id: 'OFFLINE' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-[13px] font-medium pb-1 relative transition-colors ${
                    activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-[13px] text-left border-collapse">
              <thead>
                <tr className="text-slate-600 border-b border-slate-200">
                  <th className="px-4 py-3 font-medium text-center bg-[#ebf2ff] border-r border-white">坐席ID</th>
                  <th className="px-4 py-3 font-medium text-center bg-[#ebf2ff] border-r border-white">姓名</th>
                  <th className="px-4 py-3 font-medium text-center bg-[#ebf2ff] border-r border-white">所属班组</th>
                  <th className="px-4 py-3 font-medium text-center bg-[#ebf2ff] border-r border-white">当前状态</th>
                  <th className="px-4 py-3 font-medium text-center bg-[#ebf2ff] border-r border-white">当前状态持续时长</th>
                  <th className="px-4 py-3 font-medium text-center bg-[#ebf2ff] border-r border-white">通话量</th>
                  <th className="px-4 py-3 font-medium text-center bg-[#ebf2ff] border-r border-white">告警次数</th>
                  <th className="px-4 py-3 font-medium text-center bg-[#ebf2ff]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAgents.map((agent, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 text-center font-mono">{agent.id}</td>
                    <td className="px-6 py-4 text-slate-900 font-medium text-center">{agent.name}</td>
                    <td className="px-6 py-4 text-slate-500 text-center">{agent.group}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          agent.status === 'CALLING' ? 'bg-green-500' : 
                          agent.status === 'IDLE' ? 'bg-blue-400' : 'bg-red-400'
                        }`}></div>
                        <span className="text-slate-700">
                          {agent.status === 'CALLING' ? '通话中' : 
                           agent.status === 'IDLE' ? '空闲' : '离线'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-center">{agent.duration}</td>
                    <td className="px-6 py-4 text-slate-900 font-bold text-center">{agent.callCount}</td>
                    <td className="px-6 py-4 text-center">
                       <span className={`font-bold ${agent.alertCount > 0 ? 'text-red-500' : 'text-slate-900'}`}>
                         {agent.alertCount}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {agent.status === 'CALLING' ? (
                        <button 
                          onClick={() => onMonitorCall?.(agent.id, agent.name)}
                          className="text-[#1890ff] hover:underline font-medium"
                        >
                          通话监控
                        </button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Mockup */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end space-x-4 text-[12px] text-slate-500">
               <span>共{filteredAgents.length}条</span>
               <div className="flex items-center border border-slate-200 rounded px-2 py-1 bg-white cursor-pointer">
                  5条/页 <ChevronDown size={12} className="ml-2" />
               </div>
               <div className="flex items-center space-x-1">
                 <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-400 bg-slate-50">{'<'}</button>
                 <button className="w-7 h-7 flex items-center justify-center border border-blue-500 bg-blue-500 text-white rounded">1</button>
                 <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50">2</button>
                 <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50">{'>'}</button>
               </div>
               <div className="flex items-center">
                  前往 <input type="text" value="1" readOnly className="w-8 border border-slate-200 rounded mx-1 text-center py-0.5" /> 页
               </div>
            </div>
        </div>
      </div>

      
      {/* IM Mockup at bottom right */}
      <div className="fixed bottom-0 right-0 z-50">
         <div className="bg-blue-600 text-white px-4 py-1.5 rounded-tl-lg flex items-center text-[12px] shadow-lg">
            <span>IM</span>
            <span className="bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full ml-1 font-bold">0</span>
         </div>
      </div>
    </div>
  );
};

export default AgentMonitorList;
