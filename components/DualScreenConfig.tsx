import React, { useState } from 'react';
import { ChevronLeft, Save, Phone, BookOpen, Compass, Briefcase, X, Settings } from 'lucide-react';

interface DualScreenConfigProps {
  version?: 1 | 2;
}

const DualScreenConfig: React.FC<DualScreenConfigProps> = ({ version = 1 }) => {
  const [configName, setConfigName] = useState('管理员');
  const [activeConfig, setActiveConfig] = useState<string | null>(null);
  const [modules, setModules] = useState({
    callMonitor: version === 1,
    processNav: version === 1,
    knowledge: version === 1,
    other: version === 1, // Renamed from 工作台
  });

  const [subModules, setSubModules] = useState({
    smartFill: true,
    callSummary: true,
    historyOrder: true,
    sms: true,
    profile: true,
  });

  const [knowledgeSubModules, setKnowledgeSubModules] = useState({
    faq: true,
    docs: true,
  });

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <div className="h-[56px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
        <h1 className="text-lg font-bold text-slate-800">编辑双屏配置</h1>
        <div className="flex items-center space-x-3">
          <button className="px-5 py-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition-colors text-[14px]">返回</button>
          <button className="px-5 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-[14px] font-medium shadow-sm flex items-center">
            <Save size={16} className="mr-1.5" />
            保存
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Basic Config */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-12">
            <div className="flex items-center gap-4">
              <div className="flex items-center w-[100px] shrink-0">
                <span className="text-rose-500 font-bold mr-1">*</span>
                <span className="text-slate-700 font-medium whitespace-nowrap">配置名称</span>
              </div>
              <input 
                type="text" 
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                className="w-[300px] border border-slate-200 rounded px-3 py-1.5 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center w-[100px] shrink-0">
                <span className="text-rose-500 font-bold mr-1">*</span>
                <span className="text-slate-700 font-medium whitespace-nowrap">适用岗位</span>
              </div>
              <div className="flex items-center border border-slate-200 rounded px-2 py-1 bg-white w-[260px] min-h-[34px] group hover:border-blue-500 transition-colors cursor-pointer">
                <div className="flex flex-wrap gap-1 flex-1">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[12px] flex items-center">
                    超级管理员 <X size={12} className="ml-1 text-slate-400 hover:text-slate-600" />
                  </span>
                  <span className="text-slate-400 text-[12px] self-center ml-1">+ 3</span>
                </div>
                <ChevronLeft size={16} className="text-slate-400 rotate-[-90deg]" />
              </div>
            </div>
          </div>

          {/* Module Toggles */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center w-[100px] shrink-0">
              <span className="text-transparent font-bold mr-1">*</span>
              <span className="text-slate-700 font-medium">模块配置</span>
            </div>
            
            <ModuleToggle 
              label="通话监测" 
              icon={Phone} 
              active={modules.callMonitor} 
              onChange={(v) => setModules({...modules, callMonitor: v})} 
              version={version}
            />
            <ModuleToggle 
              label="智能流程导航" 
              icon={Compass} 
              active={modules.processNav} 
              onChange={(v) => setModules({...modules, processNav: v})} 
              version={version}
            />
            <ModuleToggle 
              label="知识推荐" 
              icon={BookOpen} 
              active={modules.knowledge} 
              onChange={(v) => setModules({...modules, knowledge: v})} 
              onConfigure={() => setActiveConfig('knowledge')}
              version={version}
            />
            <ModuleToggle 
              label="其他模块" 
              icon={Briefcase} 
              active={modules.other} 
              onChange={(v) => setModules({...modules, other: v})} 
              onConfigure={() => setActiveConfig('other')}
              version={version}
            />
          </div>

          {/* Sub Module Checkboxes for Knowledge (Version 1 Only) */}
          {version === 1 && modules.knowledge && (
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200 pl-8">
              <span className="text-slate-500 text-[13px] w-[130px] shrink-0">知识推荐功能配置</span>
              <div className="flex items-center space-x-6">
                <Checkbox label="FAQ" checked={knowledgeSubModules.faq} onChange={(v) => setKnowledgeSubModules({...knowledgeSubModules, faq: v})} />
                <Checkbox label="文档" checked={knowledgeSubModules.docs} onChange={(v) => setKnowledgeSubModules({...knowledgeSubModules, docs: v})} />
              </div>
            </div>
          )}

          {/* Sub Module Checkboxes (Version 1 Only) */}
          {version === 1 && modules.other && (
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200 pl-8">
              <span className="text-slate-500 text-[13px] w-[130px] shrink-0">其他模块功能配置</span>
              <div className="flex items-center space-x-6">
                <Checkbox label="智能填单" checked={subModules.smartFill} onChange={(v) => setSubModules({...subModules, smartFill: v})} />
                <Checkbox label="智能话务小结" checked={subModules.callSummary} onChange={(v) => setSubModules({...subModules, callSummary: v})} />
                <Checkbox label="历史工单" checked={subModules.historyOrder} onChange={(v) => setSubModules({...subModules, historyOrder: v})} />
                <Checkbox label="发送短信" checked={subModules.sms} onChange={(v) => setSubModules({...subModules, sms: v})} />
                <Checkbox label="客户画像" checked={subModules.profile} onChange={(v) => setSubModules({...subModules, profile: v})} />
              </div>
            </div>
          )}
        </div>

        {/* Modal for Version 2 Sub Module Configuration */}
        {version === 2 && activeConfig && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800">
                  {activeConfig === 'knowledge' ? '知识推荐功能配置' : '其他模块功能配置'}
                </h3>
                <button onClick={() => setActiveConfig(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  {activeConfig === 'knowledge' ? (
                    <>
                      <SubModuleItem 
                        label="FAQ" 
                        description="常见问题快速推荐" 
                        active={knowledgeSubModules.faq} 
                        onClick={() => setKnowledgeSubModules({...knowledgeSubModules, faq: !knowledgeSubModules.faq})} 
                      />
                      <SubModuleItem 
                        label="文档" 
                        description="相关业务文档资料" 
                        active={knowledgeSubModules.docs} 
                        onClick={() => setKnowledgeSubModules({...knowledgeSubModules, docs: !knowledgeSubModules.docs})} 
                      />
                    </>
                  ) : (
                    <>
                      <SubModuleItem 
                        label="智能填单" 
                        description="自动识别业务信息填单" 
                        active={subModules.smartFill} 
                        onClick={() => setSubModules({...subModules, smartFill: !subModules.smartFill})} 
                      />
                      <SubModuleItem 
                        label="智能话务小结" 
                        description="通话内容自动总结摘要" 
                        active={subModules.callSummary} 
                        onClick={() => setSubModules({...subModules, callSummary: !subModules.callSummary})} 
                      />
                      <SubModuleItem 
                        label="历史工单" 
                        description="查看客户历史办理记录" 
                        active={subModules.historyOrder} 
                        onClick={() => setSubModules({...subModules, historyOrder: !subModules.historyOrder})} 
                      />
                      <SubModuleItem 
                        label="发送短信" 
                        description="快速发送业务确认短信" 
                        active={subModules.sms} 
                        onClick={() => setSubModules({...subModules, sms: !subModules.sms})} 
                      />
                      <SubModuleItem 
                        label="客户画像" 
                        description="全方位了解客户背景信息" 
                        active={subModules.profile} 
                        onClick={() => setSubModules({...subModules, profile: !subModules.profile})} 
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setActiveConfig(null)} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  确认
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Call Monitor Preview */}
          <PreviewCard title="通话监测" active={modules.callMonitor}>
            <div className="bg-white h-[600px] border border-slate-100 rounded shadow-sm overflow-hidden flex flex-col scale-[0.98]">
               <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-white">
                  <div className="flex items-center text-[12px] font-bold text-slate-800">
                    <span className="w-1 h-3 bg-blue-500 rounded-full mr-2"></span>
                    通话监测
                  </div>
                  <span className="text-emerald-500 text-[11px] font-medium">通话中: 00:00:23</span>
               </div>
               <div className="bg-rose-50 border-b border-rose-100 p-2 text-[10px] text-rose-500 flex items-center justify-around font-medium">
                  <span>客户情绪触发次数: 1</span>
                  <span>坐席违禁告警数: 1</span>
                  <span>服务投诉数: 1</span>
               </div>
               <div className="flex-1 p-3 space-y-4 overflow-y-auto bg-white custom-scrollbar">
                  <div className="flex flex-col space-y-3">
                    <ChatBubble side="left" sender="张三" time="12:23:42" text="你好，我想转账给我朋友，但是提示说超过限额了，这是怎么回事啊？" />
                    <div className="flex justify-center">
                        <div className="bg-blue-50 text-blue-600 text-[9px] px-2 py-0.5 rounded-full border border-blue-100">AI 识别意图：转账查询 | 转账限额</div>
                    </div>
                    <ChatBubble side="right" sender="坐席" time="12:23:44" text="感谢配合！查询到您这张卡是一类储蓄卡，默认单日转账限额 5 万元。请问您本次需要转账的金额是多少呢？" />
                    <ChatBubble side="left" sender="张三" time="12:23:45" text="我要转 8 万，那现在转不了吗？" />
                  </div>
               </div>
               <div className="h-10 bg-slate-50 border-t border-slate-100 flex items-center px-4">
                 <div className="text-[11px] text-slate-400">从工号：10003 转入</div>
               </div>
            </div>
          </PreviewCard>

          {/* Knowledge Preview */}
          <PreviewCard title="智能流程导航" active={modules.processNav}>
            <div className="bg-white h-[600px] border border-slate-100 rounded shadow-sm overflow-hidden flex flex-col scale-[0.98]">
               <div className="px-4 py-3 border-b border-slate-50 flex items-center bg-white">
                  <span className="w-1 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-[12px] font-bold text-slate-800">智能流程导航</span>
               </div>
               <div className="p-3 bg-white border-b border-slate-50">
                  <div className="flex space-x-2">
                     <button className="bg-blue-600 text-white text-[11px] px-3 py-1 rounded">自动推荐</button>
                     <button className="border border-slate-200 text-slate-500 text-[11px] px-3 py-1 rounded">手动查询</button>
                  </div>
               </div>
               <div className="flex-1 p-3 space-y-4 overflow-y-auto bg-slate-50/20 custom-scrollbar">
                  <div className="bg-white border border-slate-100 rounded p-4 space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                    <div className="flex justify-between items-center">
                       <div className="text-[12px] font-bold text-slate-800">APP转账限额操作流程 V1.0</div>
                       <div className="text-[9px] text-slate-400">发布时间: 2022-01-01</div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                       <span className="bg-blue-50 text-blue-500 text-[9px] px-1.5 py-0.5 rounded">知识管理</span>
                       <span className="bg-slate-50 text-slate-500 text-[9px] px-1.5 py-0.5 rounded">借记卡/业务介绍</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed bg-slate-50/50 p-2 rounded">
                      您打开 APP 后，先点击首页右下角“我的”，然后找到带盾牌图标的“安全中心”，进入后向下滑动就能看到“转账限额管理”选项，点击进入后选择“储蓄卡转账限额”，输入您想调整的 10 万元，再完成人脸识别验证就可以了。
                    </p>
                    <div className="flex justify-end space-x-2 pt-2 border-t border-slate-50">
                       <button className="text-[10px] text-blue-600 border border-blue-100 px-2 py-0.5 rounded">打开全文</button>
                       <button className="text-[10px] text-blue-600 border border-blue-100 px-2 py-0.5 rounded">复制</button>
                       <button className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded">发送文本</button>
                       <button className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded">发送PDF</button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded p-4 space-y-3 shadow-sm">
                    <div className="flex justify-between items-center">
                       <div className="text-[12px] font-bold text-slate-800">线下网点转账限额操作流程 V1.0</div>
                       <div className="text-[9px] text-slate-400">发布时间: 2022-01-01</div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                       <span className="bg-blue-50 text-blue-500 text-[9px] px-1.5 py-0.5 rounded">问答专区</span>
                       <span className="bg-slate-50 text-slate-500 text-[9px] px-1.5 py-0.5 rounded">关键字/标签</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium">携带身份证和银行卡到您就近的网点办理，最高可调整至 50 万元</p>
                    <div className="flex justify-end space-x-2 pt-2 border-t border-slate-50">
                       <button className="text-[10px] text-slate-400 border border-slate-100 px-2 py-0.5 rounded">复制</button>
                       <button className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">一键发送</button>
                    </div>
                  </div>
               </div>
            </div>
          </PreviewCard>

          {/* Knowledge Recommendation Preview */}
          <PreviewCard title="知识推荐" active={modules.knowledge}>
            <div className="bg-white h-[600px] border border-slate-100 rounded shadow-sm overflow-hidden flex flex-col scale-[0.98]">
               <div className="px-4 py-3 border-b border-slate-50 flex items-center bg-white">
                  <span className="w-1 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-[12px] font-bold text-slate-800">知识推荐</span>
               </div>
               <div className="p-3 bg-white">
                  <div className="relative">
                    <input type="text" placeholder="搜索指引消息..." className="w-full bg-slate-50 border border-slate-100 rounded px-8 py-1.5 text-[11px]" />
                    <Compass size={12} className="absolute left-2.5 top-2.5 text-slate-300" />
                  </div>
                  <div className="flex space-x-2 mt-3">
                     <div className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 flex justify-between items-center text-[10px] text-slate-500">
                        <span>全部类型</span>
                        <ChevronLeft size={10} className="rotate-[-90deg]" />
                     </div>
                     <div className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 flex justify-between items-center text-[10px] text-slate-500">
                        <span>全部状态</span>
                        <ChevronLeft size={10} className="rotate-[-90deg]" />
                     </div>
                  </div>
               </div>
               <div className="flex-1 p-3 bg-white flex flex-col items-center">
                  <div className="w-full relative h-[180px] rounded-lg overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1557683316-973673baf926?w=400&auto=format&fit=crop&q=60" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-blue-900/60 p-4 flex flex-col justify-between">
                       <div className="text-white">
                          <div className="text-[13px] font-bold">信用卡挂失</div>
                          <div className="text-[9px] opacity-70 mt-1">2025-12-31 15:59:20 · 触发依据：信用卡挂失-补办卡</div>
                          <div className="text-[10px] mt-2 opacity-90 leading-relaxed">为客户办理信用卡挂失、补办业务</div>
                       </div>
                       <div className="flex justify-end">
                          <button className="bg-white text-blue-600 px-3 py-1 rounded text-[10px] font-bold">立即启动流程</button>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </PreviewCard>

          {/* Other Modules Preview */}
          <PreviewCard title="其他模块" active={modules.other}>
            <div className="bg-white h-[600px] border border-slate-100 rounded shadow-sm overflow-hidden flex flex-col scale-[0.98]">
               <div className="px-4 py-3 border-b border-slate-50 flex items-center bg-white">
                  <span className="w-1 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-[12px] font-bold text-slate-800">其他模块</span>
               </div>
               <div className="flex-1 p-4 space-y-1.5 bg-white">
                  {subModules.smartFill && <div className="bg-[#f0f7ff] border border-transparent rounded py-2 px-4 text-[12px] text-slate-600 text-center hover:bg-blue-50 cursor-default">智能填单</div>}
                  {subModules.callSummary && <div className="bg-[#f0f7ff] border border-transparent rounded py-2 px-4 text-[12px] text-slate-600 text-center hover:bg-blue-50 cursor-default">智能话务小结</div>}
                  {subModules.sms && <div className="bg-[#f0f7ff] border border-transparent rounded py-2 px-4 text-[12px] text-slate-600 text-center hover:bg-blue-50 cursor-default">发送短信</div>}
                  {subModules.profile && <div className="bg-[#f0f7ff] border border-transparent rounded py-2 px-4 text-[12px] text-slate-600 text-center hover:bg-blue-50 cursor-default">客户画像</div>}
                  {subModules.historyOrder && <div className="bg-[#f0f7ff] border border-transparent rounded py-2 px-4 text-[12px] text-slate-600 text-center hover:bg-blue-50 cursor-default">历史工单</div>}
               </div>
            </div>
          </PreviewCard>
        </div>
      </div>
    </div>
  );
};

// Internal sub-components
const ModuleToggle: React.FC<{ 
  label: string; 
  icon: any; 
  active: boolean; 
  onChange: (v: boolean) => void;
  onConfigure?: () => void;
  version?: number;
}> = ({ label, icon: Icon, active, onChange, onConfigure, version }) => (
  <div 
    onClick={() => {
      if (version === 2 && active && onConfigure) {
        onConfigure();
      } else {
        onChange(!active);
      }
    }}
    className={`flex items-center border rounded-lg px-4 py-2 transition-all cursor-pointer select-none ${active ? 'bg-white border-blue-500 shadow-sm' : 'bg-white border-slate-200 grayscale opacity-60 hover:opacity-80'}`}
  >
    <Icon size={18} className={`mr-3 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
    <span className={`text-[14px] font-medium mr-4 ${active ? 'text-slate-800' : 'text-slate-500'}`}>{label}</span>
    
    <div className="flex items-center space-x-3">
      {version === 2 && active && onConfigure && (
        <div 
          onClick={(e) => { e.stopPropagation(); onConfigure(); }}
          className="p-1.5 hover:bg-blue-50 rounded-md text-blue-600 bg-blue-50/50"
        >
          <Settings size={14} />
        </div>
      )}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onChange(!active);
        }}
        className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-blue-600' : 'bg-slate-300'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${active ? 'left-[22px]' : 'left-1'}`}></div>
      </button>
    </div>
  </div>
);

const SubModuleItem: React.FC<{ label: string; description: string; active: boolean; onClick: () => void }> = ({ label, description, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
      active 
        ? 'border-blue-500 bg-blue-50/30' 
        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className={`text-[14px] font-bold ${active ? 'text-blue-700' : 'text-slate-700'}`}>{label}</span>
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${active ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
        {active && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
      </div>
    </div>
    <p className="text-[11px] text-slate-400 leading-tight">{description}</p>
  </div>
);

const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-2 cursor-pointer group">
    <div 
      onClick={() => onChange(!checked)}
      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}
    >
      {checked && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
    </div>
    <span className={`text-[13px] ${checked ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>{label}</span>
  </label>
);

const PreviewCard: React.FC<{ title: string; active: boolean; children: React.ReactNode }> = ({ title, active, children }) => (
  <div className={`flex flex-col space-y-3 transition-opacity ${active ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
    <div className="text-[13px] font-bold text-slate-700 ml-1">{title}</div>
    <div className="flex-1 bg-[#f0f2f5] rounded-xl p-4 border border-slate-200/50">
      {children}
    </div>
  </div>
);

const ChatBubble: React.FC<{ side: 'left' | 'right'; sender: string; time: string; text: string }> = ({ side, sender, time, text }) => (
  <div className={`flex flex-col ${side === 'right' ? 'items-end' : 'items-start'} space-y-1`}>
    <div className="flex items-center space-x-2 text-[9px] text-slate-400 px-1">
      {side === 'left' && <span className="font-bold text-slate-600">{sender}</span>}
      <span>{time}</span>
      {side === 'right' && <span className="font-bold text-slate-600">{sender}</span>}
    </div>
    <div className={`max-w-[90%] px-3 py-2 text-[10px] leading-relaxed relative ${
      side === 'right' ? 'bg-white border border-slate-100 text-slate-800 rounded-l-lg rounded-tr-lg' : 'bg-white border border-slate-100 text-slate-800 rounded-r-lg rounded-tl-lg'
    }`}>
      {side === 'left' && <div className="absolute top-2 -left-2 w-4 h-4 bg-white rounded-full -z-10 shadow-sm border border-slate-100"></div>}
      <div className="flex items-start">
         <div className="w-6 h-6 rounded-full bg-slate-200 mr-2 shrink-0"></div>
         {text}
      </div>
    </div>
  </div>
);

export default DualScreenConfig;
