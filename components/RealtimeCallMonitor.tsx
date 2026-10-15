import React, { useState } from 'react';
import { 
  Search, 
  RefreshCcw, 
  Download, 
  ChevronDown, 
  Calendar,
  MessageSquare,
  Phone,
  Clock,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  UserPlus,
  Info,
  MoreHorizontal,
  X,
  User,
  Headset,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SessionRecord {
  id: string;
  agentName: string;
  agentId: string;
  group: string;
  channel: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: 'ON_CALL' | 'IDLE' | 'OFFLINE';
  qcStatus?: 'QC_DONE' | 'PENDING';
  riskLevel: 'HIGH' | 'MEDIUM' | 'NONE' | 'LOW';
  violation: string;
  alarmCount: number;
}

const MOCK_SESSIONS: SessionRecord[] = [
  { id: 'CALL20251216001', agentName: '张三', agentId: '001', group: '信用卡客服一组', channel: '电话', startTime: '2025-12-16 14:00:00', endTime: '2025-12-16 14:05:32', duration: '00:05:32', status: 'ON_CALL', riskLevel: 'HIGH', violation: '敏感词', alarmCount: 4 },
  { id: 'CHAT20251216002', agentName: '李四', agentId: '002', group: '信用卡客服一组', channel: '在线客服', startTime: '2025-12-16 18:45:00', endTime: '2025-12-16 18:45:00', duration: '00:00:00', status: 'IDLE', riskLevel: 'NONE', violation: '', alarmCount: 0 },
  { id: 'APP20251216003', agentName: '王五', agentId: '003', group: '货后管理A组', channel: 'APP客服', startTime: '2025-12-16 14:00:00', endTime: '2025-12-16 14:02:30', duration: '00:02:30', status: 'ON_CALL', riskLevel: 'NONE', violation: '', alarmCount: 0 },
  { id: 'CALL20251216004', agentName: '赵六', agentId: '004', group: '货后管理A组', channel: '电话', startTime: '2025-12-16 15:15:00', endTime: '2025-12-16 15:15:00', duration: '00:00:00', status: 'OFFLINE', riskLevel: 'NONE', violation: '', alarmCount: 0 },
  { id: 'CALL20251216005', agentName: '陈七', agentId: '005', group: 'VIP客户专席', channel: '电话', startTime: '2025-12-16 14:20:00', endTime: '2025-12-16 14:21:00', duration: '00:01:00', status: 'ON_CALL', riskLevel: 'MEDIUM', violation: '话术不合规', alarmCount: 2 },
];

interface RealtimeCallMonitorProps {
  onMonitorCall?: (agentId: string, agentName: string) => void;
}

const RealtimeCallMonitor: React.FC<RealtimeCallMonitorProps> = ({ onMonitorCall }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);
  
  // New state for filters
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [agentSearch, setAgentSearch] = useState<string>('');
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [showAlarmRecords, setShowAlarmRecords] = useState(false);
  const [highlightedMsgId, setHighlightedMsgId] = useState<number | null>(null);

  const GROUPS = ['信用卡客服一组', '货后管理A组', 'VIP客户专席'];
  const STATUSES = [
    { label: '通话中', value: 'ON_CALL' },
    { label: '空闲', value: 'IDLE' },
    { label: '离线', value: 'OFFLINE' }
  ];

  const MOCK_TRANSCRIPT = [
    { id: 1, role: 'AGENT', time: '14:00:05', content: '您好，很高兴为您服务，请问有什么可以帮您的？' },
    { id: 2, role: 'CUSTOMER', time: '14:00:12', content: '我想查询一下我的信用卡账单，感觉上个月扣款不对。' },
    { id: 3, role: 'AGENT', time: '14:00:20', content: '好的，请问您的身份证号后四位是多少？我为您核实一下。' },
    { id: 4, role: 'CUSTOMER', time: '14:00:35', content: '3421。你们这扣费怎么这么多，莫名其妙多出了个手续费。' },
    { id: 5, role: 'AGENT', time: '14:01:10', content: '非常抱歉给您带来困扰，我查看到这笔手续费是跨行取现产生的，您可以核实一下是否有此操作。' },
    { id: 6, role: 'CUSTOMER', time: '14:01:45', content: '取个钱还要手续费？当初办卡的时候怎么没说？你们这就是欺诈！' },
    { id: 7, role: 'AGENT', time: '14:02:15', content: '滚。请您先别激动，协议中确实有相关说明的。如果您需要，我可以为您详细解读一下。' },
  ];

  const MOCK_ALARMS = [
    { id: 'RISK_00891', type: '违禁词告警', level: '中风险', time: '14:01:10', content: '坐席未询问用户意愿，直接默认"48小时内自动补卡"', advice: '1. 建议进行合规培训；2. 强调"补卡需用户确认"', msgId: 5 },
    { id: 'RISK_00892', type: '违禁词告警', level: '高风险', time: '14:01:10', content: '坐席承诺48小时内自动补卡，违反公司话术规范', advice: '1. 立即停止违规话术；2. 对用户进行解释说明', msgId: 5 },
    { id: 'RISK_00893', type: '情绪告警', level: '高风险', time: '14:01:45', content: '客户情绪激烈，出现"欺诈"等敏感词', advice: '1. 安抚客户情绪；2. 解释扣费标准', msgId: 6 },
    { id: 'RISK_00894', type: '敏感词告警', level: '高风险', time: '14:02:15', content: '坐席说出了敏感词"滚"', advice: '1. 立即切断通话；2. 坐席停岗培训', msgId: 7 },
  ];

  const handleAlarmClick = (msgId: number) => {
    setHighlightedMsgId(msgId);
    const element = document.getElementById(`msg-${msgId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const AGENTS_BY_GROUP: Record<string, {name: string, id: string}[]> = {
    '信用卡客服一组': [{name: '张三', id: '001'}, {name: '李四', id: '002'}],
    '货后管理A组': [{name: '王五', id: '003'}, {name: '赵六', id: '004'}],
    'VIP客户专席': [{name: '陈七', id: '005'}],
  };

  const filteredAgents = selectedGroup ? AGENTS_BY_GROUP[selectedGroup] || [] : [];

  const handleViewDetail = (session: SessionRecord) => {
    setSelectedSession(session);
    setShowDetail(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden font-sans">
      {/* Page Title Bar */}
      <div className="bg-white px-6 py-4 border-b border-slate-100">
         <h1 className="text-[18px] font-bold text-slate-800">通话监控</h1>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white p-6 border-b border-slate-200 shadow-sm flex items-center justify-end">
        <div className="flex items-center space-x-10 mr-6">
          {/* Group Select */}
          <div className="flex items-center space-x-4">
            <span className="text-[14px] font-medium text-slate-700 whitespace-nowrap">班组</span>
            <div className="relative">
              <div 
                onClick={() => setIsGroupOpen(!isGroupOpen)}
                className="flex items-center space-x-2 border border-slate-200 rounded px-3 py-2 bg-white min-w-[200px] justify-between cursor-pointer text-[13px] hover:border-blue-400 transition-colors"
              >
                <span className={selectedGroup ? 'text-slate-700' : 'text-slate-400'}>
                  {selectedGroup || '请选择'}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              {isGroupOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded shadow-lg z-20 py-1">
                  {GROUPS.map(g => (
                    <div 
                      key={g} 
                      onClick={() => { setSelectedGroup(g); setIsGroupOpen(false); setAgentSearch(''); }}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-[13px] text-slate-600"
                    >
                      {g}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Agent Select / Input */}
          <div className="flex items-center space-x-4">
            <span className="text-[14px] font-medium text-slate-700 whitespace-nowrap">坐席</span>
            <div className="relative">
              <input 
                type="text" 
                placeholder="请输入坐席姓名" 
                value={agentSearch}
                onChange={(e) => { setAgentSearch(e.target.value); setIsAgentOpen(true); }}
                onFocus={() => setIsAgentOpen(true)}
                className="pl-3 pr-4 py-2 border border-slate-200 rounded text-[13px] w-[240px] outline-none focus:border-blue-500 transition-colors"
              />
              <ChevronDown 
                size={14} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" 
                onClick={() => setIsAgentOpen(!isAgentOpen)}
              />
              {isAgentOpen && selectedGroup && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded shadow-lg z-20 py-1 max-h-[200px] overflow-y-auto">
                  {filteredAgents.filter(a => a.name.includes(agentSearch) || a.id.includes(agentSearch)).map(a => (
                    <div 
                      key={a.id} 
                      onClick={() => { setAgentSearch(`${a.name}(${a.id})`); setIsAgentOpen(false); }}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-[13px] text-slate-600"
                    >
                      {a.name}({a.id})
                    </div>
                  ))}
                  {filteredAgents.length === 0 && (
                    <div className="px-3 py-2 text-[13px] text-slate-400">该班组暂无坐席</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Status Select */}
          <div className="flex items-center space-x-4">
            <span className="text-[14px] font-medium text-slate-700 whitespace-nowrap">通话状态</span>
            <div className="relative">
              <div 
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="flex items-center space-x-2 border border-slate-200 rounded px-3 py-2 bg-white min-w-[160px] justify-between cursor-pointer text-[13px] hover:border-blue-400 transition-colors"
              >
                <span className={selectedStatus ? 'text-slate-700' : 'text-slate-400'}>
                  {STATUSES.find(s => s.value === selectedStatus)?.label || '请选择'}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              {isStatusOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded shadow-lg z-20 py-1">
                  {STATUSES.map(s => (
                    <div 
                      key={s.value} 
                      onClick={() => { setSelectedStatus(s.value); setIsStatusOpen(false); }}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-[13px] text-slate-600"
                    >
                      {s.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="bg-[#1890ff] text-white px-10 py-2 rounded text-[14px] font-medium hover:bg-[#40a9ff] transition-colors">查询</button>
          <button 
            onClick={() => { setSelectedGroup(''); setSelectedStatus(''); setAgentSearch(''); }}
            className="bg-white border border-[#1890ff] text-[#1890ff] px-10 py-2 rounded text-[14px] font-medium hover:bg-blue-50 transition-colors"
          >
            重置
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 custom-scrollbar py-6">
        {/* Session List Table */}
        <div className="bg-white border border-slate-200 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="text-slate-700 text-[13px]">
                  <th className="px-4 py-4 font-semibold text-center bg-[#f0f5ff] border-r border-white">坐席姓名</th>
                  <th className="px-4 py-4 font-semibold text-center bg-[#f0f5ff] border-r border-white">坐席ID</th>
                  <th className="px-4 py-4 font-semibold text-center bg-[#f0f5ff] border-r border-white">所在班组</th>
                  <th className="px-4 py-4 font-semibold text-center bg-[#f0f5ff] border-r border-white">通话状态</th>
                  <th className="px-4 py-4 font-semibold text-center bg-[#f0f5ff] border-r border-white">通话时长</th>
                  <th className="px-4 py-4 font-semibold text-center bg-[#f0f5ff] border-r border-white">告警次数</th>
                  <th className="px-4 py-4 font-semibold text-center bg-[#f0f5ff]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_SESSIONS.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50 transition-colors text-[13px]">
                    <td className="px-4 py-5 text-slate-900 font-medium text-center">{session.agentName}</td>
                    <td className="px-4 py-5 text-slate-600 text-center font-mono">{session.agentId}</td>
                    <td className="px-4 py-5 text-slate-500 text-center">{session.group}</td>
                    <td className="px-4 py-5 text-center">
                      <span className={`${
                        session.status === 'ON_CALL' ? 'text-blue-500' : 
                        session.status === 'IDLE' ? 'text-green-500' : 'text-slate-400'
                      } flex items-center justify-center font-medium`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          session.status === 'ON_CALL' ? 'bg-blue-500' : 
                          session.status === 'IDLE' ? 'bg-green-500' : 'bg-slate-400'
                        }`}></div>
                        {session.status === 'ON_CALL' ? '通话中' : 
                         session.status === 'IDLE' ? '空闲' : '离线'}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-slate-600 text-center font-mono">{session.duration}</td>
                    <td className="px-4 py-5 text-center">
                       <span className={`font-mono font-bold ${session.alarmCount > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                          {session.alarmCount}
                       </span>
                    </td>
                    <td className="px-4 py-5 text-center">
                       <div className="flex items-center justify-center space-x-4">
                          {session.status === 'ON_CALL' ? (
                            <button 
                              onClick={() => onMonitorCall?.(session.agentId, session.agentName)}
                              className="text-[#1890ff] hover:underline font-medium"
                            >
                              通话监控
                            </button>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="bg-[#f0f2f5] px-8 py-2.5 flex items-center justify-end space-x-3 text-[13px] text-slate-600 border-t border-slate-200">
         <span>共 {MOCK_SESSIONS.length} 条</span>
         <div className="flex items-center border border-slate-300 rounded px-3 py-1 bg-white cursor-pointer hover:border-blue-500 transition-colors">
            {MOCK_SESSIONS.length}条/页 <ChevronDown size={14} className="ml-2 text-slate-400" />
         </div>
         <div className="flex items-center space-x-1">
           <button className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded text-slate-400 bg-white hover:bg-slate-50" disabled>{'<'}</button>
           <button className="w-8 h-8 flex items-center justify-center border border-[#1890ff] bg-[#1890ff] text-white rounded font-medium">1</button>
           <button className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded text-slate-400 bg-white hover:bg-slate-50" disabled>{'>'}</button>
         </div>
         <div className="flex items-center space-x-2 ml-4">
            <span>前往</span>
            <input type="text" defaultValue="1" className="w-12 h-8 border border-slate-300 rounded text-center outline-none focus:border-blue-500" />
            <span>页</span>
         </div>
      </div>
      
      {/* IM Mockup */}
      <div className="fixed bottom-0 right-0 z-50">
         <div className="bg-blue-600 text-white px-4 py-1.5 rounded-tl-lg flex items-center text-[12px] shadow-lg">
            <span>IM</span>
            <span className="bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full ml-1 font-bold">0</span>
         </div>
      </div>
    </div>
  );
};

export default RealtimeCallMonitor;
