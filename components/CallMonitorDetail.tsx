import React from 'react';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Clock, 
  ShieldAlert,
  MessageSquare,
  AlertTriangle,
  History,
  Info,
  ChevronDown,
  Headset,
  Zap,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface CallMonitorDetailProps {
  agentId: string;
  agentName: string;
  onBack: () => void;
}

const MOCK_DIALOGUE = [
  { 
    role: 'CUSTOMER', 
    text: '你好，我想咨询一下我的信用卡账单。', 
    time: '10:00:01',
    intent: '账单查询',
    knowledge: '信用卡账单查询方式',
    sentiment: '平和'
  },
  { role: 'AGENT', text: '您好，请问是本人查询吗？麻烦提供一下您的卡号后四位。', time: '10:00:05' },
  { 
    role: 'CUSTOMER', 
    text: '是的，卡号后四位是 1234。', 
    time: '10:00:10',
    intent: '身份确认',
    knowledge: '客户身份验证流程',
    sentiment: '平和'
  },
  { role: 'AGENT', text: '好的，正在为您查询，请稍等。', time: '10:00:15' },
  { 
    role: 'CUSTOMER', 
    text: '你们这个账单怎么这么多利息啊？我明明按时还了！', 
    time: '10:00:30',
    intent: '利息异议',
    knowledge: '信用卡利息计算规则',
    sentiment: '愤怒' 
  },
  { role: 'AGENT', text: '很抱歉给您带来困扰，我帮您确认一下还款记录。', time: '10:00:35' },
  { 
    role: 'CUSTOMER', 
    text: '那你们快点查，我这急着用钱呢，这利息也太黑了。', 
    time: '10:01:20',
    intent: '催促查询',
    knowledge: '客户安抚话术规范',
    sentiment: '焦虑' 
  },
  { role: 'AGENT', text: '理解您的心情，系统显示您上月有一笔取现交易，利息是按天计收的。', time: '10:01:45' },
];

const MOCK_ALERTS = [
  { id: 'A1', type: '违禁词告警', content: '坐席未询问用户意愿，直接默认"48小时内自动补卡"', time: '14:01:10', level: 'HIGH', rawText: '非常抱歉给您带来困扰，我看到这笔手续费是跨行取现产生的，您可以核实一下是否有此操作。' },
  { id: 'A2', type: '违禁词告警', content: '坐席承诺48小时内自动补卡，违反公司话术规范', time: '14:01:10', level: 'HIGH', rawText: '非常抱歉给您带来困扰，我看到这笔手续费是跨行取现产生的，您可以核实一下是否有此操作。' },
  { id: 'A3', type: '情绪告警', content: '客户情绪激烈，出现"欺诈"等敏感词', time: '14:01:45', level: 'MEDIUM', rawText: '取个钱还要手续费？当初办卡的时候怎么没说？你们这就是欺诈！' },
  { id: 'A4', type: '敏感词告警', content: '出现敏感业务词汇"高杠杆"，需关注合规性', time: '14:02:15', level: 'MEDIUM', rawText: '这个产品的收益率非常高，通过高杠杆操作可以实现资产翻倍。' },
  { id: 'A5', type: '违禁词告警', content: '坐席使用了绝对化用语"百分之百保证"', time: '14:03:10', level: 'HIGH', rawText: '您放心，这款理财产品我们是百分之百保证本金安全的。' },
  { id: 'A6', type: '情绪告警', content: '坐席语气生硬，未进行有效安抚', time: '14:04:05', level: 'LOW', rawText: '规则就是这样的，您再怎么说也没用，请配合我们的工作。' },
  { id: 'A7', type: '业务合规', content: '未进行双录提醒，违反监管要求', time: '14:05:20', level: 'HIGH', rawText: '接下来我将为您办理开户业务，请您配合。' },
  { id: 'A8', type: '敏感词告警', content: '提到竞争对手敏感对比', time: '14:06:15', level: 'MEDIUM', rawText: '隔壁银行的产品利息更低，我们的更有优势。' },
];

const CallMonitorDetail: React.FC<CallMonitorDetailProps> = ({ agentId, agentName, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-[#f0f2f5]">
      {/* Top Header */}
      <div className="bg-white px-6 py-3 border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex items-center space-x-3">
            <h1 className="text-[16px] font-bold text-slate-800">通话实时监控</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <button className="h-9 px-6 bg-red-500 text-white rounded text-[13px] font-medium hover:bg-red-600 transition-all shadow-sm shadow-red-500/20">
              强制干预
            </button>
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded shadow-xl py-1 hidden group-hover:block z-50 overflow-hidden">
               {['监听', '强拦', '强插', '强拆'].map(action => (
                 <div key={action} className="px-4 py-2 hover:bg-red-50 text-[13px] text-red-600 cursor-pointer transition-colors font-medium text-center">
                    {action}
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Session Info Bar */}
      <div className="bg-white px-6 py-4 border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Headset size={20} />
              </div>
              <div>
                <div className="text-[12px] text-slate-400">当前坐席</div>
                <div className="text-[14px] font-bold text-slate-700">{agentName} ({agentId})</div>
              </div>
            </div>
            <div>
              <div className="text-[12px] text-slate-400">所属班组</div>
              <div className="text-[14px] font-medium text-slate-700">信用卡客服一组</div>
            </div>
            <div>
              <div className="text-[12px] text-slate-400">通话开始时间</div>
              <div className="text-[14px] font-medium text-slate-700">2026-07-06 10:00:01</div>
            </div>
            <div>
              <div className="text-[12px] text-slate-400">累计时长</div>
              <div className="text-[14px] font-bold text-blue-600 font-mono">00:05:20</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left: Dialogue Content */}
        <div className="flex-[2] bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-[14px] font-bold text-slate-700">实时对话数据</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
            {MOCK_DIALOGUE.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'AGENT' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] flex flex-col ${msg.role === 'AGENT' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2.5 rounded-xl text-[14px] leading-relaxed shadow-sm ${
                    msg.role === 'AGENT' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/30'
                  }`}>
                    {msg.text}
                  </div>
                  {/* Real-time analysis for CUSTOMER */}
                  {msg.role === 'CUSTOMER' && (
                    <div className="mt-2 space-y-1 text-[12px] text-slate-500 ml-4">
                      {(msg as any).intent && (
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-400">识别意图:</span>
                          <span className="text-slate-600">{(msg as any).intent}</span>
                        </div>
                      )}
                      {(msg as any).knowledge && (
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-400">知识关联:</span>
                          <span className="text-blue-500 hover:underline cursor-pointer">{(msg as any).knowledge}</span>
                        </div>
                      )}
                      {(msg as any).sentiment && (
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-400">客户情绪:</span>
                          <span className={`${(msg as any).sentiment === '愤怒' ? 'text-red-500 font-bold' : 'text-red-500'}`}>
                            {(msg as any).sentiment}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Alarm Records */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-4 bg-red-500 rounded-full"></div>
              <span className="text-[14px] font-bold text-slate-700">实时告警记录</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-[12px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#f0f5ff]">
                  <th className="px-4 py-3 text-slate-600 font-medium text-left border-r border-white">原话术</th>
                  <th className="px-2 py-3 text-slate-600 font-medium text-center border-r border-white">触发时间</th>
                  <th className="px-2 py-3 text-slate-600 font-medium text-center border-r border-white">告警类型</th>
                  <th className="px-4 py-3 text-slate-600 font-medium text-left">告警内容</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_ALERTS.map((alert) => (
                  <tr key={alert.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-4 text-slate-600 leading-relaxed max-w-[200px] border-r border-slate-50">
                      {alert.rawText}
                    </td>
                    <td className="px-2 py-4 text-center text-slate-500 font-mono border-r border-slate-50 whitespace-nowrap">
                      {alert.time}
                    </td>
                    <td className="px-2 py-4 text-center border-r border-slate-50">
                      <span className={`inline-block px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap ${
                        alert.type === '违禁词告警' 
                          ? 'bg-red-50 text-red-500' 
                          : alert.type === '情绪告警'
                          ? 'bg-orange-50 text-orange-500'
                          : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {alert.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-700 font-medium leading-relaxed">
                      {alert.content}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {MOCK_ALERTS.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                <ShieldAlert size={48} className="mb-4 opacity-10" />
                <p className="text-[13px]">暂无实时告警</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallMonitorDetail;
