import React, { useState } from 'react';
import { 
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

type MenuItem = {
  id: string;
  label: string;
  icon?: any;
  view?: ViewState;
  children?: MenuItem[];
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const [expanded, setExpanded] = useState<string[]>(['content']);

  const menuStructure: MenuItem[] = [
    { 
      id: 'content', 
      label: '内容管理', 
      icon: FileText,
      children: [
         { id: 'INTENT', label: '意图管理', view: 'INTENT' },
         { id: 'ENTITY', label: '实体管理', view: 'ENTITY' },
      ]
    }
  ];

  const toggleExpand = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
    );
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expanded.includes(item.id);
    const isActive = item.view === currentView;

    // Base padding + depth indentation
    const paddingLeft = 16 + (depth * 12); 

    return (
      <div key={item.id}>
        <div 
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else if (item.view) {
              onChangeView(item.view);
            }
          }}
          className={`
            flex items-center py-3 pr-4 cursor-pointer text-sm transition-colors select-none
            ${isActive ? 'text-blue-400 bg-slate-800 border-r-2 border-blue-500' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}
          `}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {item.icon && <item.icon size={18} className={`mr-3 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />}
          <span className={`flex-1 truncate ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
          {hasChildren && (
            <span className="ml-2 text-slate-600">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="bg-[#0b1120]">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-72 bg-[#0f172a] h-full flex flex-col flex-shrink-0 text-slate-300 overflow-y-auto custom-scrollbar shadow-xl border-r border-slate-800">
      {/* Top Logo Area */}
      <div className="h-14 flex items-center px-4 border-b border-slate-800 bg-[#0f172a] sticky top-0 z-10">
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded mr-2.5 shadow-lg shadow-blue-500/20"></div>
        <span className="font-bold text-slate-100 tracking-wide">智能客服系统</span>
      </div>

      <div className="flex-1 py-4 space-y-0.5">
        {menuStructure.map(item => renderMenuItem(item))}
      </div>

      {/* Footer Version */}
      <div className="p-4 text-[10px] text-slate-600 border-t border-slate-800 text-center bg-[#0f172a]">
        v2.4.0 Build 20250617
      </div>
    </div>
  );
};

export default Sidebar;