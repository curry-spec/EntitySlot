import React from 'react';
import { ChevronDown, Bot } from 'lucide-react';

const SmartWorkOrder: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white p-4">
      {/* Top action row */}
      <div className="flex space-x-2 mb-4">
        <div className="flex-1 relative">
          <select className="w-full border border-slate-200 rounded px-3 py-1.5 text-[12px] bg-white text-slate-400 appearance-none focus:outline-none focus:border-blue-400 shadow-sm">
            <option>请选择</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-[9px] text-slate-300 pointer-events-none" />
        </div>
        
        <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-[12px] hover:bg-blue-700 transition flex items-center font-medium shadow-sm">
          <span className="italic font-black text-yellow-400 mr-1">AI</span> 一键摘要
        </button>
        
        <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-[12px] hover:bg-blue-700 transition shadow-sm font-medium">
          获取推荐工单
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <label className="text-slate-800 font-bold mb-2 text-[14px]">工单摘要</label>
        <div className="flex-1 min-h-[200px]">
           <textarea 
             className="w-full h-full border border-slate-200 rounded p-3 text-[12px] text-slate-700 focus:outline-none focus:border-blue-400 resize-none shadow-inner bg-slate-50/30 placeholder:text-slate-300"
             placeholder="工单摘要内容"
           ></textarea>
        </div>
        
        <div className="flex justify-end mt-4">
          <button className="bg-[#adc6fb] text-white px-10 py-2 rounded text-[14px] hover:bg-blue-400 transition font-bold shadow-sm">
            创建工单
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartWorkOrder;
