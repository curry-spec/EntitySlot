import React, { useState } from 'react';
import { Search, AlertCircle, ChevronRight, Copy, CheckCircle2, ThumbsUp, X, Mail, Edit, MessageSquare, Headset, Circle, Maximize2, Minimize2 } from 'lucide-react';

const AgentAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState('推荐回答');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showFlowCard, setShowFlowCard] = useState(false);
  const [showKnowledgeCard, setShowKnowledgeCard] = useState(false);
  const [readScripts, setReadScripts] = useState<Record<string, boolean>>({});
  const [isKnowledgeExpanded, setIsKnowledgeExpanded] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setReadScripts(prev => ({ ...prev, [text]: true }));
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="flex h-full gap-4 overflow-hidden bg-slate-100 p-4 rounded-lg">
      {/* Column 1: 通话监测 */}
      <div className="w-1/4 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden transition-all duration-300">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
            <h3 className="font-bold text-slate-800">通话监测</h3>
          </div>
          <div className="text-sm font-mono text-slate-600">00:00:00</div>
        </div>
        <div className="p-3 shrink-0 border-b border-slate-50">
          <div className="bg-red-50 border border-red-100 rounded-md p-2 flex items-start space-x-3">
            <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
            <div className="flex-1 grid grid-cols-3 gap-2 text-xs text-center">
              <div>
                <div className="text-slate-500 mb-1">情绪触发</div>
                <div className="text-red-600 font-bold text-base">0</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">违禁警告</div>
                <div className="text-red-600 font-bold text-base">0</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">服务告警</div>
                <div className="text-red-600 font-bold text-base">0</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white">
           {/* 对话列表 */}
           <div className="flex justify-center mb-2">
             <span className="text-slate-400 bg-slate-50 px-3 py-1 rounded-full text-xs">从自助语音转入</span>
           </div>

           {/* Customer Message 1 */}
           <div className="flex flex-col items-start w-full">
            <div className="flex ml-[52px] mb-1">
               <span className="text-slate-800 font-medium text-xs mr-2">张三</span>
               <span className="text-slate-400 text-xs">2024-02-20 12:12:16</span>
            </div>
            <div className="flex items-start w-full">
               <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Mia" alt="avatar" className="w-10 h-10 rounded-full mr-3 shrink-0 border border-slate-100 bg-slate-50" />
               <div className="flex flex-col max-w-[85%] relative">
                 <div className="absolute top-3 -left-1.5 w-0 h-0 border-t-[5px] border-t-transparent border-r-[6px] border-r-[#f4f5f9] border-b-[5px] border-b-transparent"></div>
                 <div className="bg-[#f4f5f9] rounded-lg rounded-tl-none p-3.5 text-[13px] text-slate-800 leading-relaxed">
                   <p className="mb-2">你好，我想办理挂失。</p>
                   <div className="my-2 border-t border-dashed border-slate-300"></div>
                   <div className="space-y-2 text-xs text-slate-600">
                     <div className="flex items-start gap-1.5">
                       <span className="text-slate-800 font-bold shrink-0 mt-0.5 flex">
                         <span className="text-slate-400 mr-1">•</span> 识别意图:
                       </span>
                       <div className="flex flex-wrap gap-1">
                         <span 
                           className="px-2.5 py-0.5 border border-blue-400 text-blue-500 rounded-full bg-white cursor-pointer hover:bg-blue-50 transition-colors"
                           onClick={() => { setShowFlowCard(true); setActiveTab('话术推荐'); }}
                         >
                           信用卡挂失
                         </span>
                       </div>
                     </div>
                     <div className="flex items-start gap-1.5">
                       <span className="text-slate-800 font-bold shrink-0 mt-0.5 flex">
                         <span className="text-slate-400 mr-1">•</span> 知识关联:
                       </span>
                       <div className="flex flex-wrap gap-2 text-blue-500 mt-0.5">
                         <span>信用卡挂失知识</span>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div className="flex items-center justify-end mt-1.5 text-xs">
                    <span className="text-slate-500">客户情绪：</span>
                    <span className="text-red-500">生气</span>
                    <div 
                      className="bg-blue-500 hover:bg-blue-600 rounded ml-1.5 flex items-center justify-center p-[3px] cursor-pointer shadow-sm transition-colors"
                      onClick={() => { setShowKnowledgeCard(true); setActiveTab('话术推荐'); }}
                      title="查看安抚话术"
                    >
                       <MessageSquare className="w-[10px] h-[10px] text-white" style={{ fill: 'white' }} />
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Agent Message 1 */}
          <div className="flex flex-col items-end w-full">
            <div className="flex mr-[52px] mb-1">
               <span className="text-slate-400 text-xs mr-2">2024-02-20 12:12:16</span>
               <span className="text-slate-800 font-bold text-xs">001</span>
            </div>
            <div className="flex items-start justify-end w-full">
               <div className="flex flex-col max-w-[85%] relative items-end">
                 <div className="absolute top-3 -right-1.5 w-0 h-0 border-t-[5px] border-t-transparent border-l-[6px] border-l-[#e8efff] border-b-[5px] border-b-transparent"></div>
                 <div className="bg-[#e8efff] rounded-lg rounded-tr-none p-3 text-[13px] text-slate-800 leading-relaxed shadow-sm">
                   <p>是实体卡丢失还是密码忘记，需要先帮您看一下吗？</p>
                 </div>
               </div>
               <div className="w-10 h-10 rounded-full bg-[#1b64f2] flex items-center justify-center ml-3 shrink-0 shadow-sm border border-blue-600">
                  <Headset className="w-5 h-5 text-white" />
               </div>
            </div>
          </div>

          {/* Customer Message 2 */}
           <div className="flex flex-col items-start w-full">
            <div className="flex ml-[52px] mb-1">
               <span className="text-slate-800 font-medium text-xs mr-2">张三</span>
               <span className="text-slate-400 text-xs">2024-02-20 12:12:16</span>
            </div>
            <div className="flex items-start w-full">
               <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Mia" alt="avatar" className="w-10 h-10 rounded-full mr-3 shrink-0 border border-slate-100 bg-slate-50" />
               <div className="flex flex-col max-w-[85%] relative">
                 <div className="absolute top-3 -left-1.5 w-0 h-0 border-t-[5px] border-t-transparent border-r-[6px] border-r-[#f4f5f9] border-b-[5px] border-b-transparent"></div>
                 <div className="bg-[#f4f5f9] rounded-lg rounded-tl-none p-3.5 text-[13px] text-slate-800 leading-relaxed">
                   <p className="mb-2">实体卡丢了，我现在在手机银行上操作挂失，一直提示失败。另外，我还想查一下我的账户限额是多少，最近可能要转账。</p>
                   <div className="my-2 border-t border-dashed border-slate-300"></div>
                   <div className="space-y-2 text-xs text-slate-600">
                     <div className="flex items-start gap-1.5">
                       <span className="text-slate-800 font-bold shrink-0 mt-0.5 flex">
                         <span className="text-slate-400 mr-1">•</span> 识别意图:
                       </span>
                       <div className="flex flex-wrap gap-1">
                         <span 
                           className="px-2.5 py-0.5 border border-blue-400 text-blue-500 rounded-full bg-white cursor-pointer hover:bg-blue-50 transition-colors"
                           onClick={() => { setShowFlowCard(true); setActiveTab('话术推荐'); }}
                         >
                           信用卡挂失
                         </span>
                         <span className="px-2.5 py-0.5 border border-slate-300 text-slate-500 rounded-full bg-slate-50 cursor-default">
                           转账限额
                         </span>
                       </div>
                     </div>
                     <div className="flex items-start gap-1.5">
                       <span className="text-slate-800 font-bold shrink-0 mt-0.5 flex">
                         <span className="text-slate-400 mr-1">•</span> 知识关联:
                       </span>
                       <div className="flex flex-wrap gap-3 text-blue-500 mt-0.5">
                         <span>信用卡挂失知识</span>
                         <span>转账限额知识</span>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div className="flex items-center justify-end mt-1.5 text-xs">
                    <span className="text-slate-500">客户情绪：</span>
                    <span className="text-red-500">生气</span>
                    <div 
                      className="bg-blue-500 hover:bg-blue-600 rounded ml-1.5 flex items-center justify-center p-[3px] cursor-pointer shadow-sm transition-colors"
                      onClick={() => { setShowKnowledgeCard(true); setActiveTab('话术推荐'); }}
                      title="查看安抚话术"
                    >
                       <MessageSquare className="w-[10px] h-[10px] text-white" style={{ fill: 'white' }} />
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Agent Message 2 */}
          <div className="flex flex-col items-end w-full">
            <div className="flex mr-[52px] mb-1">
               <span className="text-slate-400 text-xs mr-2">2024-02-20 12:12:16</span>
               <span className="text-slate-800 font-bold text-xs">001</span>
            </div>
            <div className="flex items-start justify-end w-full">
               <div className="flex flex-col max-w-[85%] relative items-end">
                 <div className="absolute top-3 -right-1.5 w-0 h-0 border-t-[5px] border-t-transparent border-l-[6px] border-l-[#e8efff] border-b-[5px] border-b-transparent"></div>
                 <div className="bg-[#e8efff] rounded-lg rounded-tr-none p-3 text-[13px] text-slate-800 leading-relaxed shadow-sm">
                   <p>好的，请问您想要办理什么业务？</p>
                 </div>
               </div>
               <div className="w-10 h-10 rounded-full bg-[#1b64f2] flex items-center justify-center ml-3 shrink-0 shadow-sm border border-blue-600">
                  <Headset className="w-5 h-5 text-white" />
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* Column 2: 智能流程导航 */}
      <div className="w-1/4 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden transition-all duration-300">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
            <h3 className="font-bold text-slate-800">智能流程导航</h3>
          </div>
        </div>
        <div className="p-3 border-b border-slate-100 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input type="text" placeholder="搜索指引消息..." className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex space-x-2">
            <select className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm text-slate-600 focus:outline-none">
              <option>全部类型</option>
            </select>
            <select className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm text-slate-600 focus:outline-none">
              <option>全部状态</option>
            </select>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <Search size={32} className="opacity-20" />
            <p className="text-sm">暂无指引消息</p>
          </div>
        </div>
      </div>

      {/* Column 3: 知识推荐 */}
      <div className={`${isKnowledgeExpanded ? 'w-2/4' : 'w-1/4'} bg-white rounded-lg shadow-sm flex flex-col overflow-hidden transition-all duration-300`}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
            <h3 className="font-bold text-slate-800">知识推荐</h3>
          </div>
          <button 
            onClick={() => setIsKnowledgeExpanded(!isKnowledgeExpanded)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100"
          >
            {isKnowledgeExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
        <div className="flex border-b border-slate-100 px-2 shrink-0">
          {['自动推荐', '手动查询', '推荐回答', '话术推荐'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-3 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
          {activeTab === '话术推荐' ? (
            <>
              {showFlowCard ? (
                <div className="bg-white border text-sm rounded shadow-sm relative group overflow-hidden">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-[#f7f9fc]">
                    <div className="flex items-center space-x-2 text-slate-700 font-medium">
                      <Mail size={16} className="text-slate-500" />
                      <span>话术推荐(信用卡挂失)</span>
                      <span className="text-xs text-slate-400 font-normal ml-1">(2026/4/20 14:31:29)</span>
                    </div>
                    <button onClick={() => setShowFlowCard(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-3">
                    <div className="space-y-2.5">
                      {[
                        "针对您的情况，我目前可以为您提供两种处理方式：一种是为您办理临时冻结；另一种是直接办理挂失。您看哪种更方便？",
                        "为了您的资金安全，建议先办理挂失。挂失后旧卡将立即失效，我们会为您立刻安排寄送新卡。",
                        "先生/女士，办理挂失补卡需要收取一定的工本费，预计3-5个工作日内可以寄达到您预留的地址，请问需要现在为您办理吗？"
                      ].map((script, idx) => {
                        const isRead = readScripts[script];
                        return (
                          <div 
                            key={idx}
                            className="border border-slate-200 rounded p-2.5 flex items-start group/item hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer relative"
                            onClick={() => {
                              setReadScripts(prev => ({ ...prev, [script]: true }));
                              handleCopy(script);
                            }}
                            title="点击复制"
                          >
                            {isRead ? (
                              <CheckCircle2 size={14} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            ) : (
                              <Circle size={14} className="text-slate-300 mt-0.5 mr-2 flex-shrink-0" />
                            )}
                            <p className={`text-[13px] leading-relaxed flex-1 ${isRead ? 'text-slate-500' : 'text-slate-700'}`}>{script}</p>
                            <button 
                              className="opacity-0 group-hover/item:opacity-100 absolute top-2 right-2 text-blue-500 bg-blue-50 p-1 rounded transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(script);
                              }}
                            >
                               {copiedText === script ? <CheckCircle2 size={12} className="text-green-500" /> : <Copy size={12} />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}

              {showKnowledgeCard && (
                <div className="bg-white border border-blue-200 rounded-lg shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <div className="p-3 border-b border-slate-50 flex justify-between items-center bg-blue-50/50">
                    <div className="flex items-center space-x-1.5">
                      <ThumbsUp size={14} className="text-blue-600" />
                      <span className="text-sm font-bold text-blue-800">安抚话术（着急-转账异常）</span>
                      <span className="text-xs text-slate-400 font-normal ml-1">(2026/4/20 14:31:29)</span>
                    </div>
                    <button onClick={() => setShowKnowledgeCard(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-4 space-y-4">
                    {[
                      "王先生/女士，非常抱歉，这次转账没能成功，给您儿子用钱造成了麻烦，这是我们系统设置的问题，真的对不起。",
                      "我完全理解您现在的心情，给儿子转饭钱却转不出去，换谁都会着急上火，孩子等着吃饭呢，这份着急我特别能体会。",
                      "请您先别着急，我们这边马上为您核查具体的限额原因，一定会尽快排查问题帮助您的。"
                    ].map((script, idx) => {
                      const isRead = readScripts[script];
                      return (
                        <React.Fragment key={idx}>
                          <div 
                            className={`relative group/item flex items-start p-2 rounded transition-colors cursor-pointer ${isRead ? 'bg-slate-50/50' : 'hover:bg-blue-50/30'}`}
                            onClick={() => {
                              setReadScripts(prev => ({ ...prev, [script]: true }));
                              handleCopy(script);
                            }}
                          >
                            {isRead ? (
                              <CheckCircle2 size={14} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            ) : (
                              <Circle size={14} className="text-slate-300 mt-0.5 mr-2 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className={`text-sm leading-relaxed pr-6 ${isRead ? 'text-slate-500' : 'text-slate-700'}`}>
                                "{script}"
                              </p>
                              <div className="absolute top-2 right-2 flex items-center justify-end">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(script);
                                  }} 
                                  className="text-slate-400 hover:text-blue-600 opacity-0 group-hover/item:opacity-100 transition-opacity bg-white/80 rounded p-0.5"
                                >
                                  {copiedText === script ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                                </button>
                              </div>
                            </div>
                          </div>
                          {idx < 2 && <div className="border-t border-slate-100 my-2"></div>}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {!showFlowCard && !showKnowledgeCard && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                  <Search size={32} className="opacity-20" />
                  <p className="text-sm">暂无内容</p>
                </div>
              )}
            </>
          ) : activeTab === '推荐回答' ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
              <Search size={32} className="opacity-20" />
              <p className="text-sm">暂无推荐回答</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
              <Search size={32} className="opacity-20" />
              <p className="text-sm">暂无内容</p>
            </div>
          )}
        </div>
      </div>

      {/* Column 4: 信息提取 */}
      <div className={`${isKnowledgeExpanded ? 'hidden' : 'w-1/4'} bg-white rounded-lg shadow-sm flex flex-col overflow-hidden transition-all duration-300`}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
            <h3 className="font-bold text-slate-800">信息提取</h3>
          </div>
        </div>
        <div className="flex border-b border-slate-100 px-2 overflow-x-auto custom-scrollbar">
          {['智能填单', '智能话务小结', '历史工单'].map((tab, i) => (
            <button 
              key={tab}
              className={`px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${i === 0 ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-4">
          <h4 className="font-bold text-slate-800 text-sm">智能填单</h4>
          <div className="flex space-x-2">
            <select className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm text-slate-600 focus:outline-none">
              <option>请选择</option>
            </select>
            <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
              <span className="italic font-serif mr-1 font-bold">AI</span> 一键摘要
            </button>
            <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
              获取推荐工单
            </button>
          </div>
          
          <div>
            <h4 className="text-sm text-slate-700 mb-2">工单摘要</h4>
            <textarea 
              className="w-full h-48 border border-slate-200 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none bg-slate-50"
              placeholder="工单摘要内容"
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button className="bg-blue-400 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-500 transition-colors">
              创建工单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAssistant;
