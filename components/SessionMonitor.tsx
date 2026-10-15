import React, { useState } from 'react';
import { 
  Search, 
  RefreshCcw, 
  ChevronDown, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  Headset,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SessionRecord {
  id: string;
  agentName: string;
  agentId: string;
  status: '未推送' | '已推送';
  startTime: string;
  endTime: string;
  duration: string;
  group: string;
  emotionTriggers: number;
  violationAlarms: number;
  serviceAlarms: number;
}

const MOCK_DATA: SessionRecord[] = [
  { id: 'R1_5002_6a4319ef_5002', agentName: '张三', agentId: '777', status: '已推送', startTime: '2026-06-30 09:21:13', endTime: '2026-06-30 09:23:50', duration: '00:02:37', group: '信用卡客服一组', emotionTriggers: 4, violationAlarms: 0, serviceAlarms: 25 },
  { id: 'R1_5001_6a431996_5001', agentName: '李四', agentId: '777', status: '未推送', startTime: '2026-06-30 09:19:40', endTime: '2026-06-30 09:20:42', duration: '00:01:02', group: '信用卡客服一组', emotionTriggers: 3, violationAlarms: 0, serviceAlarms: 12 },
  { id: 'R1_5001_6a4315e6_5001', agentName: '王五', agentId: '777', status: '未推送', startTime: '2026-06-30 09:03:54', endTime: '2026-06-30 09:04:58', duration: '00:01:04', group: '货后管理A组', emotionTriggers: 0, violationAlarms: 0, serviceAlarms: 4 },
  { id: 'R1_5002_6a426129_5002', agentName: '赵六', agentId: '777', status: '已推送', startTime: '2026-06-29 20:13:52', endTime: '2026-06-29 20:14:05', duration: '00:00:13', group: '货后管理A组', emotionTriggers: 0, violationAlarms: 0, serviceAlarms: 1 },
  { id: 'R1_5001_6a4260dc_5001', agentName: '陈七', agentId: '777', status: '未推送', startTime: '2026-06-29 20:11:29', endTime: '2026-06-29 20:11:47', duration: '00:00:18', group: 'VIP客户专席', emotionTriggers: 0, violationAlarms: 0, serviceAlarms: 1 },
];

const MOCK_TRANSCRIPT = [
  { id: 1, role: 'AGENT', time: '09:21:13', content: '您好，这里是信用卡中心，请问有什么可以帮您？' },
  { id: 2, role: 'CUSTOMER', time: '09:21:20', content: '我想查询一下我这个月的账单明细，感觉有点不对劲。' },
  { id: 3, role: 'AGENT', time: '09:21:25', content: '好的，请您提供一下您的身份证号后四位，我为您核实身份。' },
  { id: 4, role: 'CUSTOMER', time: '09:21:35', content: '1234。' },
  { id: 5, role: 'AGENT', time: '09:21:40', content: '正在为您查询，请稍等... 查到了，您本月消费共计 3500 元，其中有一笔 1200 元的餐饮消费。' },
  { id: 6, role: 'CUSTOMER', time: '09:21:55', content: '这笔餐饮消费不是我刷的，那天我根本没出门！你们系统是不是出问题了？' },
  { id: 7, role: 'AGENT', time: '09:22:05', content: '先生请您先别激动，我们会为您进行进一步核实的。' },
  { id: 8, role: 'CUSTOMER', time: '09:22:15', content: '核实什么核实！你们这就是欺诈！我要投诉你们！滚！' },
];

const SessionMonitor: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [data, setData] = useState<SessionRecord[]>(MOCK_DATA);

  const [showDetail, setShowDetail] = useState(false);
  const [showQCModal, setShowQCModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);
  const [problemType, setProblemType] = useState('');
  const [rectification, setRectification] = useState('');

  const GROUPS = ['信用卡客服一组', '货后管理A组', 'VIP客户专席'];
  const AGENTS = ['张三', '李四', '王五', '赵六', '陈七'];
  const STATUSES = ['未推送', '已推送'];
  const PROBLEM_TYPES = ['服务态度差', '业务不熟练', '违规承诺', '漏说欢迎语', '其他'];

  const handleSearch = () => {
    let filtered = [...MOCK_DATA];
    if (selectedGroup) filtered = filtered.filter(s => s.group === selectedGroup);
    if (selectedAgent) filtered = filtered.filter(s => s.agentName === selectedAgent);
    if (selectedStatus) filtered = filtered.filter(s => s.status === selectedStatus);
    setData(filtered);
  };

  const handleReset = () => {
    setSelectedGroup('');
    setSelectedAgent('');
    setSelectedStatus('');
    setData(MOCK_DATA);
  };

  const handleViewDetail = (session: SessionRecord) => {
    setSelectedSession(session);
    setShowDetail(true);
  };

  const handleSaveQC = () => {
    alert('质检结果已保存');
    setShowQCModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header Area */}
      <div className="bg-white px-6 py-3 border-b border-slate-200">
        <h1 className="text-[16px] font-bold text-slate-800">会话监控</h1>
      </div>

      {/* Header Section */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 shrink-0">
        <h1 className="text-[18px] font-bold text-slate-800">会话监控</h1>
      </div>

      {/* Filter Section */}
      <div className="px-6 pt-5 shrink-0">
        <div className="bg-white p-5 rounded-lg border border-slate-200/60 shadow-sm">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {/* Group Select */}
            <div className="flex items-center space-x-3">
              <label className="text-[13px] font-medium text-slate-600 whitespace-nowrap">所在班组</label>
              <div className="relative w-44">
                <div 
                  onClick={() => setIsGroupOpen(!isGroupOpen)}
                  className="flex items-center justify-between h-9 px-3 text-[13px] border border-slate-200 rounded bg-white cursor-pointer hover:border-blue-500 transition-all"
                >
                  <span className={selectedGroup ? 'text-slate-700' : 'text-slate-400'}>
                    {selectedGroup || '请选择'}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                {isGroupOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded shadow-lg z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div 
                      onClick={() => { setSelectedGroup(''); setIsGroupOpen(false); }}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-[13px] text-slate-600 transition-colors"
                    >
                      全部班组
                    </div>
                    {GROUPS.map(g => (
                      <div 
                        key={g} 
                        onClick={() => { setSelectedGroup(g); setIsGroupOpen(false); }}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-[13px] text-slate-600 transition-colors"
                      >
                        {g}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Agent Input */}
            <div className="flex items-center space-x-3">
              <label className="text-[13px] font-medium text-slate-600 whitespace-nowrap">坐席</label>
              <input 
                type="text"
                placeholder="请输入姓名"
                className="w-44 h-9 px-3 text-[13px] border border-slate-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              />
            </div>

            {/* Date Range */}
            <div className="flex items-center space-x-3">
              <label className="text-[13px] font-medium text-slate-600 whitespace-nowrap">会话时间</label>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="开始日期"
                    className="w-36 h-9 pl-9 pr-3 text-[13px] border border-slate-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <span className="text-slate-400">至</span>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="结束日期"
                    className="w-36 h-9 pl-9 pr-3 text-[13px] border border-slate-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Status Select */}
            <div className="flex items-center space-x-3">
              <label className="text-[13px] font-medium text-slate-600 whitespace-nowrap">状态</label>
              <div className="relative w-44">
                <div 
                  onClick={() => setIsStatusOpen(!isStatusOpen)}
                  className="flex items-center justify-between h-9 px-3 text-[13px] border border-slate-200 rounded bg-white cursor-pointer hover:border-blue-500 transition-all"
                >
                  <span className={selectedStatus ? 'text-slate-700' : 'text-slate-400'}>
                    {selectedStatus || '请选择'}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </div>
                {isStatusOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-150">
                    <div 
                      onClick={() => { setSelectedStatus(''); setIsStatusOpen(false); }}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-[13px] text-slate-600 transition-colors"
                    >
                      全部状态
                    </div>
                    {STATUSES.map(s => (
                      <div 
                        key={s} 
                        onClick={() => { setSelectedStatus(s); setIsStatusOpen(false); }}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-[13px] text-slate-600 transition-colors"
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 ml-auto">
              <button 
                onClick={handleSearch}
                className="h-9 px-6 bg-blue-600 text-white rounded text-[13px] font-medium hover:bg-blue-700 transition-all flex items-center justify-center shadow-sm active:scale-95"
              >
                查询
              </button>
              <button 
                onClick={handleReset}
                className="h-9 px-6 bg-white text-slate-600 border border-slate-200 rounded text-[13px] font-medium hover:bg-slate-50 transition-all active:scale-95"
              >
                重置
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Ribbon Section */}
      <div className="px-6 pt-5 shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="flex divide-x divide-slate-100">
            {[
              { label: '通话总量', value: '2,000', unit: '次', color: 'blue', icon: <Headset size={18} />, trend: '+12.5%', isUp: true },
              { label: '风险通话', value: '158', unit: '次', color: 'red', icon: <AlertCircle size={18} />, trend: '-2.4%', isUp: false },
              { label: '平均时长', value: '00:05:20', unit: '', color: 'emerald', icon: <Clock size={18} />, trend: '+0:12', isUp: true },
              { label: '告警人数', value: '20', unit: '人', color: 'orange', icon: <User size={18} />, trend: '+3', isUp: true },
            ].map((stat, i) => (
              <div key={i} className="flex-1 px-8 py-6 group hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-lg ${
                      stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                      stat.color === 'red' ? 'bg-red-50 text-red-600' :
                      stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {stat.icon}
                    </div>
                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <div className={`flex items-center space-x-1 text-[11px] font-black px-2 py-0.5 rounded-full ${
                    stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {stat.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    <span>{stat.trend}</span>
                  </div>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-[28px] font-black text-slate-800 tracking-tight leading-none">{stat.value}</span>
                  {stat.unit && <span className="text-[13px] font-bold text-slate-400">{stat.unit}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="px-6 py-5 flex flex-col flex-1 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200/60 overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="bg-[#f4f7ff] sticky top-0 z-10 border-b border-blue-100/50">
                  <th className="px-4 py-3.5 font-bold text-center text-slate-600 border-r border-white/50">会话ID</th>
                  <th className="px-4 py-3.5 font-bold text-center text-slate-600 border-r border-white/50">所属班组</th>
                  <th className="px-4 py-3.5 font-bold text-center text-slate-600 border-r border-white/50">座席名称</th>
                  <th className="px-4 py-3.5 font-bold text-center text-slate-600 border-r border-white/50">状态</th>
                  <th className="px-4 py-3.5 font-bold text-center text-slate-600 border-r border-white/50">会话开始时间</th>
                  <th className="px-4 py-3.5 font-bold text-center text-slate-600 border-r border-white/50">会话结束时间</th>
                  <th className="px-4 py-3.5 font-bold text-center text-slate-600 border-r border-white/50">客户情绪触发</th>
                  <th className="px-4 py-3.5 font-bold text-center text-slate-600 border-r border-white/50">座席违禁告警</th>
                  <th className="px-4 py-3.5 font-bold text-center text-slate-600 border-r border-white/50">座席服务告警</th>
                  <th className="px-4 py-3.5 font-bold text-center text-slate-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-4 text-center text-slate-500 font-mono text-[12px]">{row.id}</td>
                    <td className="px-4 py-4 text-center text-slate-600">{row.group}</td>
                    <td className="px-4 py-4 text-center text-slate-700 font-medium">{row.agentName}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                        row.status === '已推送' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-500">{row.startTime}</td>
                    <td className="px-4 py-4 text-center text-slate-500">{row.endTime}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`font-bold ${row.emotionTriggers > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                        {row.emotionTriggers}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`font-bold ${row.violationAlarms > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        {row.violationAlarms}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`font-bold ${row.serviceAlarms > 10 ? 'text-orange-500' : 'text-slate-400'}`}>
                        {row.serviceAlarms}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button 
                        onClick={() => handleViewDetail(row)}
                        className="text-blue-600 font-medium hover:text-blue-800 transition-colors hover:underline underline-offset-2"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination at bottom of the area */}
        <div className="mt-4 px-6 py-4 bg-white rounded border border-slate-200 flex items-center justify-between shadow-sm shrink-0">
          <div className="text-[13px] text-slate-500">
            共 <span className="font-bold text-slate-700">328</span> 条记录
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-slate-200 rounded px-2 py-1 bg-white cursor-pointer group hover:border-blue-400 transition-colors">
              <span className="text-slate-600 text-[12px]">10条/页</span>
              <ChevronDown size={14} className="ml-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="flex items-center space-x-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 transition-all active:scale-90">
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3, 4, 5].map((p) => (
                <button key={p} className={`w-8 h-8 flex items-center justify-center rounded font-bold text-[12px] transition-all active:scale-90 ${
                  p === 1 ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}>
                  {p}
                </button>
              ))}
              <span className="text-slate-400 px-1">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 font-bold text-[12px]">
                33
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 transition-all active:scale-90">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex items-center space-x-2 text-[13px] text-slate-500">
              <span>前往</span>
              <input 
                type="text" 
                defaultValue="1" 
                className="w-10 h-8 border border-slate-200 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold text-slate-700" 
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {showDetail && selectedSession && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowDetail(false)} />
          <div className="relative w-[900px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h2 className="text-[17px] font-bold text-slate-800">会话详情质检</h2>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-400 font-mono text-[11px] rounded tracking-tight">#{selectedSession.id}</span>
              </div>
              <button 
                onClick={() => setShowDetail(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/30">
              {/* Info Bar */}
              <div className="p-6 pb-2 shrink-0">
                <div className="bg-white rounded-lg p-5 flex items-center justify-between border border-slate-200/60 shadow-sm">
                  <div className="grid grid-cols-5 gap-6 flex-1">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-400 mb-1">坐席姓名</span>
                      <span className="text-[14px] font-bold text-slate-700">{selectedSession.agentName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-400 mb-1">所属班组</span>
                      <span className="text-[14px] font-bold text-slate-700">{selectedSession.group}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-400 mb-1">通话开始时间</span>
                      <span className="text-[14px] font-medium text-slate-600">{selectedSession.startTime}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-400 mb-1">会话时长</span>
                      <span className="text-[14px] font-bold text-blue-600">{selectedSession.duration}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-400 mb-1">处理状态</span>
                      <span className={`text-[12px] font-bold ${selectedSession.status === '已推送' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {selectedSession.status}
                      </span>
                    </div>
                  </div>
                  {selectedSession.status === '未推送' && (
                    <button 
                      onClick={() => setShowQCModal(true)}
                      className="ml-6 h-9 px-6 bg-blue-600 text-white rounded text-[13px] font-bold hover:bg-blue-700 transition-all shadow-sm active:scale-95"
                    >
                      质检
                    </button>
                  )}
                </div>
              </div>

              {/* Transcription Section */}
              <div className="flex-1 overflow-hidden flex flex-col p-6 pt-2">
                <div className="bg-white rounded-lg border border-slate-200/60 flex-1 flex flex-col min-h-0 overflow-hidden shadow-sm">
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-[13px] font-bold text-slate-700">对话转写记录</span>
                    <span className="text-[11px] text-slate-400">共 {MOCK_TRANSCRIPT.length} 条</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                    {MOCK_TRANSCRIPT.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.role === 'AGENT' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] items-start space-x-3 ${msg.role === 'AGENT' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
                            msg.role === 'AGENT' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {msg.role === 'AGENT' ? <Headset size={16} /> : <User size={16} />}
                          </div>
                          <div className={`flex flex-col ${msg.role === 'AGENT' ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center space-x-2 mb-1.5 px-1">
                              <span className="text-[12px] font-bold text-slate-600">
                                {msg.role === 'AGENT' ? '座席' : '客户'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                            </div>
                            <div className={`relative px-4 py-2.5 rounded-xl text-[13px] leading-relaxed shadow-sm ${
                              msg.role === 'AGENT' 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QC Modal */}
      {showQCModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowQCModal(false)} />
          <div className="relative bg-white w-[500px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-3 text-slate-900">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
                <h3 className="font-black text-[16px] tracking-tight">智能会话质检</h3>
              </div>
              <button onClick={() => setShowQCModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">问题分类</label>
                <div className="relative">
                  <select 
                    value={problemType}
                    onChange={(e) => setProblemType(e.target.value)}
                    className="w-full h-12 px-4 text-[13px] font-bold text-slate-700 border border-slate-100 rounded-2xl bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 appearance-none transition-all cursor-pointer"
                  >
                    <option value="">请选择检测出的问题类型</option>
                    {PROBLEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">整改指导建议</label>
                <textarea 
                  placeholder="在此输入详细的整改指导建议..."
                  value={rectification}
                  onChange={(e) => setRectification(e.target.value)}
                  className="w-full h-40 p-4 text-[14px] font-medium text-slate-700 border border-slate-100 rounded-2xl bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 resize-none transition-all placeholder:text-slate-300"
                />
              </div>
              <div className="flex items-start space-x-2 text-amber-500">
                <div className="mt-0.5"><X size={12} className="rotate-45" /></div>
                <p className="text-[11px] font-bold leading-relaxed">
                  提交后，质检报告将自动分发至所属班组长并同步记入座席年度绩效考核。
                </p>
              </div>
            </div>
            
            <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 flex justify-end space-x-4">
              <button 
                onClick={() => setShowQCModal(false)}
                className="px-6 py-3 text-[13px] font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
              >
                取消操作
              </button>
              <button 
                onClick={handleSaveQC}
                className="px-10 py-3 bg-slate-900 text-white rounded-2xl text-[13px] font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionMonitor;
