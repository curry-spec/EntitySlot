import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface KnowledgeRecommendationProps {
  isPristine?: boolean;
}

const KnowledgeRecommendation: React.FC<KnowledgeRecommendationProps> = ({ isPristine = true }) => {
  const [subTab, setSubTab] = useState('auto');

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 h-[44px] border-b border-slate-200 bg-white shrink-0">
        <h2 className="font-semibold text-slate-800 text-[14px] flex items-center">
          <span className="w-[3px] h-[12px] bg-blue-600 mr-2 rounded-full"></span>
          知识-话术推荐
        </h2>
        <ChevronRight size={18} className="text-slate-300" />
      </div>

      {/* Sub tabs */}
      <div className="flex text-[12px] bg-white shrink-0 h-[40px] px-1">
        {[
          { key: 'auto', label: '自动推荐' },
          { key: 'manual', label: '手动查询' },
          { key: 'expert', label: '推荐回答(专家)' },
          { key: 'script', label: '话术推荐' }
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
         {/* Filter Bar */}
         <div className="flex space-x-2">
            <div className="flex-1 bg-white border border-slate-200 rounded px-4 py-1 flex items-center justify-between text-[12px] text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
              <span>历史推荐记录</span>
              <ChevronDown size={14} className="text-slate-300" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default KnowledgeRecommendation;
