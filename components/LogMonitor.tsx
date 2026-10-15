import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { LogRecord } from '../types';
import { MOCK_LOGS } from '../constants';

export default function LogMonitor({ onNavigateToDetail }: { onNavigateToDetail: (id: string) => void }) {
  const [logs, setLogs] = useState<LogRecord[]>(MOCK_LOGS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchSessionId, setSearchSessionId] = useState('');
  const [searchAgentId, setSearchAgentId] = useState('');

  const handleSearch = () => {
    let filtered = [...MOCK_LOGS];
    if (searchSessionId) {
      filtered = filtered.filter(log => log.sessionId.includes(searchSessionId));
    }
    if (searchAgentId) {
      // Since agentId isn't in LogRecord yet, we mock this or just filter sessionId for demo
      filtered = filtered.filter(log => log.sessionId.includes(searchAgentId));
    }
    setLogs(filtered);
  };

  const handleReset = () => {
    setSearchSessionId('');
    setSearchAgentId('');
    setLogs(MOCK_LOGS);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(logs.map(log => log.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden shadow-sm border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between bg-white">
         <h2 className="text-[16px] font-bold text-slate-800">日志监控</h2>
      </div>

      <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center bg-white">
        <div className="flex items-center">
          <span className="text-[13px] text-slate-700 mr-2">时间范围</span>
          <div className="flex items-center border border-slate-200 bg-white rounded px-2">
            <Calendar size={14} className="text-slate-400 mr-2" />
            <input type="text" placeholder="开始时间" className="w-24 text-[13px] outline-none py-1.5" />
            <span className="text-slate-400 px-2 text-[12px]">至</span>
            <input type="text" placeholder="结束时间" className="w-24 text-[13px] outline-none py-1.5" />
          </div>
        </div>

        <div className="flex items-center">
          <span className="text-[13px] text-slate-700 mr-2">坐席工号</span>
          <input 
            type="text" 
            placeholder="请输入" 
            className="w-40 border border-slate-200 rounded px-3 py-1.5 text-[13px] outline-none focus:border-blue-400" 
            value={searchAgentId}
            onChange={(e) => setSearchAgentId(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <span className="text-[13px] text-slate-700 mr-2">会话ID</span>
          <input 
            type="text" 
            placeholder="请输入" 
            className="w-40 border border-slate-200 rounded px-3 py-1.5 text-[13px] outline-none focus:border-blue-400" 
            value={searchSessionId}
            onChange={(e) => setSearchSessionId(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <span className="text-[13px] text-slate-700 mr-2">渠道分类</span>
          <div className="w-44 border border-slate-200 rounded px-3 py-1.5 text-[13px] text-slate-400 bg-white flex justify-between items-center cursor-pointer">
            请选择 <ChevronDown size={14} />
          </div>
        </div>

        <div className="flex space-x-2 ml-auto">
           <button 
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded text-[13px] transition-colors"
           >查询</button>
           <button 
            onClick={handleReset}
            className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-6 py-1.5 rounded text-[13px] transition-colors"
           >重置</button>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-slate-100 flex items-center space-x-3 bg-white">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-[13px] shadow-sm">
          导出
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-white px-4 pb-4 custom-scrollbar">
         <table className="w-full text-center border-collapse text-[13px]">
            <thead>
               <tr className="bg-[#e7eefe]">
                  <th className="py-3 px-3 border-b border-white border-r w-10">
                     <input 
                        type="checkbox" 
                        className="rounded border-slate-300"
                        checked={selectedIds.length === logs.length && logs.length > 0}
                        onChange={handleSelectAll}
                     />
                  </th>
                  <th className="py-3 px-4 font-medium text-slate-700 border-b border-white border-r">会话ID</th>
                  <th className="py-3 px-4 font-medium text-slate-700 border-b border-white border-r">渠道</th>
                  <th className="py-3 px-4 font-medium text-slate-700 border-b border-white border-r">开始时间</th>
                  <th className="py-3 px-4 font-medium text-slate-700 border-b border-white border-r">结束时间</th>
                  <th className="py-3 px-4 font-medium text-slate-700 border-b border-white">操作</th>
               </tr>
            </thead>
            <tbody>
               {logs.map(log => (
                  <tr key={log.id} className="bg-white border-b border-slate-50 hover:bg-slate-50 transition-colors">
                     <td className="py-3 px-3 text-center border-r border-slate-50">
                         <input 
                            type="checkbox" 
                            className="rounded border-slate-300"
                            checked={selectedIds.includes(log.id)}
                            onChange={() => handleSelectRow(log.id)}
                         />
                     </td>
                     <td className="py-3 px-4 text-slate-700 border-r border-slate-50">{log.sessionId}</td>
                     <td className="py-3 px-4 text-slate-700 border-r border-slate-50">{log.channel}</td>
                     <td className="py-3 px-4 text-slate-600 border-r border-slate-50">{log.startTime}</td>
                     <td className="py-3 px-4 text-slate-600 border-r border-slate-50">{log.endTime}</td>
                     <td className="py-3 px-4">
                        <button 
                           className="text-blue-500 hover:text-blue-700 text-[13px]"
                           onClick={() => onNavigateToDetail(log.sessionId)}
                        >详情</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>

         {/* Pagination Header (bottom) */}
         <div className="mt-4 flex items-center justify-end text-[13px] text-slate-600 space-x-4 bg-white p-2 rounded shadow-sm border border-slate-100">
             <span>共 268 条</span>
             <div className="flex items-center border border-slate-300 rounded px-2 py-1 bg-slate-50">
                50条/页 <ChevronDown size={14} className="ml-2" />
             </div>
             <div className="flex items-center space-x-1">
                 <button className="p-1 rounded text-slate-400 hover:bg-slate-100"><ChevronLeft size={14} /></button>
                 <button className="w-6 h-6 flex items-center justify-center rounded bg-blue-600 text-white font-medium">1</button>
                 <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-300 hover:bg-slate-50">2</button>
                 <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-300 hover:bg-slate-50">3</button>
                 <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-300 hover:bg-slate-50">4</button>
                 <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-300 hover:bg-slate-50">5</button>
                 <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-300 hover:bg-slate-50">6</button>
                 <button className="p-1 rounded text-slate-600 hover:bg-slate-100"><ChevronRight size={14} /></button>
             </div>
             <div className="flex items-center">
                <span className="mr-2">前往</span>
                <input type="text" className="w-10 border border-slate-300 rounded text-center py-1 outline-none mr-2" defaultValue="1" />
                <span>页</span>
             </div>
         </div>
      </div>
    </div>
  );
}
