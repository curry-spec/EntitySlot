import React from 'react';
import { Phone, User, Settings, Mic, Headphones, PauseCircle, PhoneForwarded, HelpCircle, PhoneOff } from 'lucide-react';

const TopNav: React.FC = () => {
  return (
    <div className="h-14 bg-gradient-to-r from-[#4a85fd] to-[#2d6cdf] text-white flex items-center justify-between px-4 shadow-md flex-shrink-0 z-10">
      
      {/* Left: Status Indicators */}
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <Phone size={16} />
          <span>客户来电</span>
        </div>
        <div className="flex items-center space-x-2 opacity-80">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>实时质检</span>
        </div>
        <div className="flex items-center space-x-2">
           <span className="opacity-70">当前状态:</span>
           <span className="font-semibold">未登录</span>
        </div>
        <div className="flex items-center space-x-2 bg-black/10 px-3 py-1 rounded">
           <span className="opacity-70">排队人数:</span>
           <span className="font-bold">0</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center">
        <div className="flex items-center border-r border-white/20 pr-4 mr-4 space-x-4">
             <ActionIcon icon={Settings} label="设置" />
             <ActionIcon icon={User} label="签入" />
             <ActionIcon icon={Headphones} label="示闲" />
             <ActionIcon icon={Phone} label="呼出" />
             <ActionIcon icon={PhoneOff} label="挂断" />
             <ActionIcon icon={PauseCircle} label="保持" />
             <ActionIcon icon={HelpCircle} label="求助" />
             <ActionIcon icon={PhoneForwarded} label="转接" />
             <ActionIcon icon={Mic} label="静音" />
        </div>
        
        <div className="flex items-center cursor-pointer">
           <img src="https://picsum.photos/40/40" alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white/50" />
           <span className="ml-2 text-sm font-medium">管理员</span>
        </div>
      </div>
    </div>
  );
};

const ActionIcon = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex flex-col items-center cursor-pointer hover:bg-white/10 p-1 rounded transition-colors group">
    <Icon size={18} className="mb-0.5 group-hover:scale-110 transition-transform" />
    <span className="text-[10px] opacity-90">{label}</span>
  </div>
);

export default TopNav;
