import React from 'react';
import { Eye, ChevronDown, CheckCircle2, Search } from 'lucide-react';
import { Customer } from './CustomerListDrawer';

interface ProcessNavigationProps {
  isPristine?: boolean;
  customer?: Customer;
}

const ProcessNavigation: React.FC<ProcessNavigationProps> = ({ isPristine = true, customer }) => {
  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 h-[44px] border-b border-slate-100 bg-white shrink-0">
        <h2 className="font-semibold text-slate-800 flex items-center text-[14px]">
          <span className="w-[3px] h-[12px] bg-blue-600 mr-2 rounded-full"></span>
          智能流程导航
        </h2>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search Input */}
        <div className="p-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="搜索指引消息..." 
              className="w-full bg-[#f4f6f8] border-none rounded px-9 py-2 text-[13px] focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
           <div className="w-24 h-24 rounded-full border-4 border-slate-50 flex items-center justify-center mb-4 opacity-50">
              <div className="w-16 h-16 rounded-full border-2 border-slate-100 flex items-center justify-center">
                 <Search size={32} className="text-slate-200" />
              </div>
           </div>
           <p className="text-[13px] text-slate-400 text-center leading-relaxed">
             暂无指引消息，请调整筛选条件或等待新消息...
           </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessNavigation;
