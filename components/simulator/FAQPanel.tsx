import React, { useState } from 'react';
import { ChevronDown, Search, SendHorizontal } from 'lucide-react';

const FAQPanel: React.FC = () => {
  const [subTab, setSubTab] = useState('auto');

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Sub tabs */}
      <div className="flex text-[12px] bg-white shrink-0 h-[40px] px-1 border-b border-slate-100">
        {[
          { key: 'auto', label: '自动推荐' },
          { key: 'manual', label: '手动查询' }
        ].map(tab => (
          <button 
            key={tab.key}
            className={`flex-1 flex items-center justify-center relative transition ${subTab === tab.key ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-500'}`}
            onClick={() => setSubTab(tab.key)}
          >
            {tab.label}
            {subTab === tab.key && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-blue-600 rounded-t-sm"></div>}
          </button>
        ))}
      </div>

      <div className="p-3 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
         {subTab === 'auto' && (
           /* Filter Bar only for Auto tab */
           <div className="flex space-x-2">
              <div className="flex-1 bg-white border border-slate-200 rounded px-4 py-1 flex items-center justify-between text-[12px] text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                <span>历史推荐记录</span>
                <ChevronDown size={14} className="text-slate-300" />
              </div>
           </div>
         )}

         {subTab === 'manual' && (
           <div className="flex items-center space-x-2 bg-white p-1">
             <div className="relative flex-1">
               <input 
                 type="text" 
                 placeholder="请输入" 
                 className="w-full bg-transparent border-none rounded px-9 py-2 text-[14px] text-slate-400 focus:ring-0 focus:outline-none"
               />
               <Search size={18} className="absolute left-2 top-2 text-slate-300" />
             </div>
             <button className="bg-blue-600 text-white px-4 py-1.5 rounded flex items-center space-x-1.5 hover:bg-blue-700 transition shadow-sm font-medium text-[13px]">
                <SendHorizontal size={14} className="rotate-[-45deg] translate-y-[-1px]" />
                <span>发送</span>
             </button>
           </div>
         )}
      </div>
    </div>
  );
};

export default FAQPanel;
