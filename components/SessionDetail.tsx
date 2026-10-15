import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronRight, User, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  time: string;
  content: string;
  isHighlighted?: boolean;
}

const MOCK_CHAT_HISTORY: ChatMessage[] = [
  { id: '1', sender: 'user', time: '2026-07-30 10:12:22', content: '啊。' },
  { id: '2', sender: 'agent', time: '2026-07-30 10:12:22', content: '啊。' },
  { id: '3', sender: 'user', time: '2026-07-30 10:12:32', content: '公司这边的话也是。' },
  { id: '4', sender: 'user', time: '2026-07-30 10:12:35', content: '你的信用卡丢失了，我的信用卡也丢了。' },
  { id: '5', sender: 'user', time: '2026-07-30 10:12:38', content: '行。' },
  { id: '6', sender: 'user', time: '2026-07-30 10:12:42', content: '这这这也是挂失了吗？' },
  { id: '7', sender: 'agent', time: '2026-07-30 10:12:44', content: '去公司这边的词话也是你的信用卡挂失了，我的信用卡丢了，这演示挂失了嘛？挂失。' },
];

const MOCK_FILTER_DATA = [
   { time: '2026-07-30 10:12:22', type: '情绪识别', content: '啊。', result: '平和', reason: '' },
   { time: '2026-07-30 10:12:22', type: '知识推荐', content: '啊。', result: 'FILTERED', reason: '无效语句:未包含疑问/诉求词' },
   { time: '2026-07-30 10:12:32', type: '情绪识别', content: '公司这边的话也是。', result: '困惑', reason: '' },
   { time: '2026-07-30 10:12:32', type: '知识推荐', content: '公司这边的话也是。', result: 'FILTERED', reason: '无效语句:未包含疑问/诉求词' },
   { time: '2026-07-30 10:12:35', type: '意图识别', content: '公司这边的话也是。', result: 'PASS', reason: '' },
   { time: '2026-07-30 10:12:35', type: '情绪识别', content: '你的信用卡丢失了，我的信用卡也丢了。', result: '紧迫', reason: '' },
   { time: '2026-07-30 10:12:38', type: '知识推荐', content: '你的信用卡丢失了，我的信用卡也丢了。', result: 'PASS', reason: '' },
   { time: '2026-07-30 10:12:42', type: '意图识别', content: '你的信用卡丢失了，我的信用卡也丢了。', result: 'PASS', reason: '' },
   { time: '2026-07-30 10:12:42', type: '知识推荐', content: '行。', result: 'FILTERED', reason: '无效语句:未包含疑问/诉求词' },
   { time: '2026-07-30 10:12:44', type: '情绪识别', content: '行。', result: '满意', reason: '' },
];

const MOCK_KNOWLEDGE_CONTENT: Record<string, { title: string; subtitle?: string; rows?: { question: string; answer: string }[] }> = {
  'KB-2024-001': {
    title: '七、常见问题与处理话术',
    subtitle: '七、常见问题与处理话术',
    rows: [
      {
        question: '挂失后还能解除挂失，恢复原卡使用吗？',
        answer: '抱歉，信用卡挂失生效后无法解除挂失恢复使用，因为卡片遗失/被盗后存在信息泄露风险，为了您的资金安全，原卡会永久冻结，您如果需要用卡，可申请补卡，新卡激活后即可正常使用。'
      },
      {
        question: '挂失手续费可以减免吗？',
        answer: '挂失手续费是银行的统一规定，目前暂不支持减免，费用会直接计入您下期的信用卡账单，您在账单还款日按时还款即可，无额外利息。'
      },
      {
        question: '挂失后收到新卡还需要激活吗？',
        answer: '您收到新卡后，首先通过手机银行/客服热线/柜面激活新卡。新卡激活后即可正常使用。'
      }
    ]
  },
  'KB-2024-002': {
    title: '挂失手续费说明',
    rows: [
      {
        question: '挂失手续费可以减免吗？',
        answer: '挂失手续费是银行的统一规定，目前暂不支持减免，费用会直接计入您下期的信用卡账单。'
      }
    ]
  }
};

export default function SessionDetail({ sessionId, onBack }: { sessionId: string; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('INTENT');
  const [selectedKnowledgeId, setSelectedKnowledgeId] = useState<string | null>(null);
  
  // Default to the first user message
  const firstUserMessage = MOCK_CHAT_HISTORY.find(m => m.sender === 'user');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(firstUserMessage?.id || null);

  const selectedMessage = MOCK_CHAT_HISTORY.find(m => m.id === selectedMessageId);
  const isMeaningless = selectedMessage?.content === '啊。' || selectedMessage?.content === '行。';

  const INTENT_STAGES = [
    {
      id: 'pre-filter',
      name: '前置过滤',
      process: '检测输入文本的有效性，过滤表情包、无意义字符、敏感词等。通过模型评估语义完整性。',
      result: isMeaningless ? '拦截' : '通过',
      status: isMeaningless ? 'warning' : 'success'
    },
    {
      id: 'query-rewrite',
      name: 'Query改写',
      process: '结合上下文补全指代内容（如“它”、“这个”），纠正错别字，并将其转化为标准查询语句。',
      result: isMeaningless ? '跳过' : (selectedMessage?.content.includes('信用卡') ? '我的信用卡丢失了，我想办理挂失业务。' : selectedMessage?.content),
      status: isMeaningless ? 'pending' : 'success'
    },
    {
      id: 'hybrid-search',
      name: '混合检索',
      process: '同时利用向量空间模型进行语义匹配和 BM25 算法进行关键词匹配，并进行 Rerank 排序。',
      result: isMeaningless ? '跳过' : '',
      intents: isMeaningless ? [] : ['信用卡挂失', '账户查询'],
      status: isMeaningless ? 'pending' : 'success'
    },
    {
      id: 'intent-route',
      name: '意图路由',
      process: '根据检索反馈和意图分类器，将用户请求分发至特定的业务处理模块。',
      result: isMeaningless ? '跳过' : '',
      intent: isMeaningless ? null : (selectedMessage?.content.includes('信用卡') ? '信用卡挂失' : null),
      status: isMeaningless ? 'pending' : 'success'
    }
  ];

  const KNOWLEDGE_STAGES = [
    {
      id: 'pre-filter',
      name: '前置过滤',
      result: isMeaningless ? '拦截' : '通过',
      status: isMeaningless ? 'warning' : 'success'
    },
    {
      id: 'query-rewrite',
      name: 'Query改写',
      result: isMeaningless ? '跳过' : (selectedMessage?.content.includes('信用卡') ? '我的信用卡丢失了，我想办理挂失业务。' : selectedMessage?.content),
      status: isMeaningless ? 'pending' : 'success'
    },
    {
      id: 'knowledge-recommend',
      name: '知识推荐',
      result: isMeaningless ? '跳过' : ['KB-2024-001', 'KB-2024-002'],
      status: isMeaningless ? 'pending' : 'success'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden shadow-sm border border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white min-h-[64px]">
         <div className="flex items-center min-w-0 pr-4">
            <button onClick={onBack} className="mr-3 text-slate-500 hover:text-slate-800 transition-colors flex-shrink-0 text-[14px] flex items-center">
               <ChevronLeft size={20} />
            </button>
            <div className="min-w-0 ml-1">
               <h2 className="text-[16px] font-bold text-slate-800 flex items-center">
                  会话详情
               </h2>
               <div className="text-[12px] text-slate-400 truncate mt-1 tracking-wider">会话ID: {sessionId}</div>
            </div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat History */}
        <div className="w-[360px] border-r border-slate-100 flex flex-col bg-white flex-shrink-0">
          <div className="px-4 py-3 border-b border-slate-100 font-bold text-[15px] text-slate-800 flex-shrink-0">
            会话记录
          </div>
          <div className="flex-1 overflow-auto p-6 space-y-8 custom-scrollbar bg-slate-50/30">
            {MOCK_CHAT_HISTORY.map(msg => {
               const isAgent = msg.sender === 'agent';
               const isSelected = msg.id === selectedMessageId;
               return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'} cursor-pointer group`}
                    onClick={() => !isAgent && setSelectedMessageId(msg.id)}
                  >
                     <div className={`text-[11px] text-slate-400 mb-2 ${isAgent ? 'mr-12' : 'ml-12'}`}>{msg.time}</div>
                     <div className={`flex w-full ${isAgent ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105
                           ${isAgent ? 'bg-blue-600 text-white' : isSelected ? 'bg-blue-500 text-white ring-4 ring-blue-100' : 'bg-white border border-blue-200 text-blue-500'}`}>
                           <User size={20} />
                        </div>
                        <div className={`max-w-[75%] ${isAgent ? 'mr-3' : 'ml-3'}`}>
                           <div className={`text-[13px] px-4 py-2.5 rounded-xl border shadow-sm leading-relaxed transition-all
                              ${isAgent 
                                ? 'bg-[#e7f0ff] border-blue-100 text-slate-800 rounded-tr-none' 
                                : isSelected 
                                  ? 'bg-blue-50 border-blue-200 text-blue-900 rounded-tl-none shadow-md' 
                                  : 'bg-white border-slate-100 text-slate-700 rounded-tl-none hover:border-blue-200'}`}>
                              {msg.content}
                           </div>
                        </div>
                     </div>
                  </div>
               );
            })}
          </div>
        </div>

         {/* Right: Detail Tabs and Table */}
         <div className="flex-1 flex flex-col min-w-0 bg-white">
            <div className="border-b border-slate-100 px-6 flex items-center justify-between flex-shrink-0 h-[56px] bg-white">
               <div className="flex space-x-10 h-full">
                  {[
                    { id: 'INTENT', label: '意图识别' },
                    { id: 'EMOTION', label: '情绪识别' },
                    { id: 'KNOWLEDGE', label: '知识推荐' }
                  ].map(tab => {
                     const isActive = activeTab === tab.id;
                     return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`h-full text-[14px] font-medium transition-colors relative ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                           {tab.label}
                           {isActive && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full" />}
                        </button>
                     );
                  })}
               </div>
            </div>

          <div className="flex-1 overflow-auto custom-scrollbar p-6">
             {activeTab === 'INTENT' ? (
               <div className="space-y-6">
                 {/* Selection Context */}
                 <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-6 flex items-start">
                   <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mr-3 mt-1">
                      <User size={16} />
                   </div>
                   <div>
                     <div className="text-[12px] text-slate-400 mb-1">当前选中的客户语句：</div>
                     <div className="text-[14px] text-slate-700 font-medium">{selectedMessage?.content || '未选中语句'}</div>
                   </div>
                 </div>

                  {/* Stages */}
                 <div className="space-y-0 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                    {INTENT_STAGES.map((stage: any, index) => {
                      const isPreFilter = stage.id === 'pre-filter';
                      const isQueryRewrite = stage.id === 'query-rewrite';
                      const isHybridSearch = stage.id === 'hybrid-search';
                      const isIntentRoute = stage.id === 'intent-route';
                      
                      // If pre-filtering intercepted the query, hide all subsequent stages
                      if (isMeaningless && !isPreFilter) return null;
                      
                      // Simulate "sometimes not walking to intent routing"
                      const isNotReached = stage.id === 'intent-route' && selectedMessage?.content === '公司这边的话也是。';
                      if (isNotReached) return null;

                      return (
                        <div key={stage.id} className="relative pl-12 pb-8 last:pb-0">
                           {/* Dot */}
                           <div className={`absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white z-10 shadow-sm transition-colors
                             ${stage.status === 'success' || stage.status === 'warning' ? 'bg-blue-600' : 
                               'bg-blue-100'}`}>
                              <div className="text-[12px] font-bold text-white">{index + 1}</div>
                           </div>

                           <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-3">
                                 <h3 className="text-[15px] font-bold text-slate-800">{stage.name}</h3>
                              </div>
                              
                              <div className="grid grid-cols-1 gap-6">
                                 <div className={isPreFilter ? '' : 'flex gap-8'}>
                                    {isQueryRewrite && !isMeaningless ? (
                                      <>
                                        <div className="flex-1">
                                           <div className="text-[12px] text-slate-900 mb-2">原内容</div>
                                           <div className="text-[13px] p-2.5 px-3 rounded border bg-slate-50 border-slate-100 text-slate-900">
                                              {selectedMessage?.content}
                                           </div>
                                        </div>
                                        <div className="flex-1">
                                           <div className="text-[12px] text-slate-900 mb-2">改写结果</div>
                                           <div className="text-[13px] p-2.5 px-3 rounded border bg-blue-50/30 border-blue-50 text-slate-900 font-medium">
                                              {stage.result}
                                           </div>
                                        </div>
                                      </>
                                    ) : isHybridSearch && !isMeaningless ? (
                                      <div>
                                         <div className="text-[12px] text-slate-900 mb-2">匹配到的意图</div>
                                         <div className="flex flex-wrap gap-2">
                                            {stage.intents && stage.intents.length > 0 ? (
                                               stage.intents.map((it: string, idx: number) => (
                                                  <div key={idx} className="text-[13px] p-1.5 px-3 rounded border bg-blue-50/30 border-blue-50 text-slate-900 font-medium">
                                                     {it}
                                                  </div>
                                               ))
                                            ) : (
                                               <div className="text-[13px] p-1.5 px-3 rounded border bg-slate-50 border-slate-200 text-slate-400">
                                                  未匹配到意图
                                               </div>
                                            )}
                                         </div>
                                      </div>
                                    ) : isIntentRoute && !isMeaningless ? (
                                      <div>
                                         <div className="text-[12px] text-slate-900 mb-2">识别出的意图</div>
                                         <div className="flex flex-wrap gap-2">
                                            {stage.intent ? (
                                               <div className="text-[13px] p-1.5 px-3 rounded border bg-blue-50/30 border-blue-50 text-slate-900 font-medium">
                                                  {stage.intent}
                                               </div>
                                            ) : (
                                               <div className="text-[13px] p-1.5 px-3 rounded border bg-slate-50 border-slate-200 text-slate-400">
                                                  无识别结果
                                               </div>
                                            )}
                                         </div>
                                      </div>
                                    ) : (
                                      <div>
                                         <div className="text-[12px] text-slate-900 mb-2">处理结果</div>
                                         <div className={`text-[13px] p-1.5 px-3 rounded border w-fit ${
                                           (isPreFilter || stage.result === '跳过')
                                             ? 'text-slate-900 bg-slate-50 border-slate-200' 
                                             : (stage.result === '拦截' ? 'text-slate-900 bg-red-50/30 border-red-50 font-medium' : 'text-slate-900 bg-blue-50/30 border-blue-50 font-medium')
                                         }`}>
                                            {stage.result}
                                         </div>
                                      </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                      );
                    })}
                 </div>
               </div>
             ) : activeTab === 'EMOTION' ? (
               <div className="space-y-6">
                 {/* Selection Context */}
                 <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-6 flex items-start">
                   <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mr-3 mt-1">
                      <User size={16} />
                   </div>
                   <div>
                     <div className="text-[12px] text-slate-400 mb-1">当前选中的客户语句：</div>
                     <div className="text-[14px] text-slate-700 font-medium">{selectedMessage?.content || '未选中语句'}</div>
                   </div>
                 </div>

                 <div className="space-y-0 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                   <div className="relative pl-12">
                      {/* Dot */}
                      <div className="absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white z-10 shadow-sm bg-blue-600">
                         <div className="text-[12px] font-bold text-white">1</div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[15px] font-bold text-slate-800">情绪识别</h3>
                         </div>
                         
                         <div>
                            <div className="text-[12px] text-slate-900 mb-2">识别出的情绪</div>
                            <div className="text-[13px] p-2.5 px-4 rounded border bg-slate-50 border-slate-100 text-slate-900 font-medium w-fit">
                               {MOCK_FILTER_DATA.find(f => f.type === '情绪识别' && f.content === selectedMessage?.content)?.result || '平和'}
                            </div>
                         </div>
                      </div>
                   </div>
                 </div>
               </div>
             ) : (
                <div className="space-y-6">
                  {/* Selection Context */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-6 flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mr-3 mt-1">
                       <User size={16} />
                    </div>
                    <div>
                      <div className="text-[12px] text-slate-400 mb-1">当前选中的客户语句：</div>
                      <div className="text-[14px] text-slate-700 font-medium">{selectedMessage?.content || '未选中语句'}</div>
                    </div>
                  </div>

                  <div className="space-y-0 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                    {KNOWLEDGE_STAGES.map((stage: any, index) => {
                      const isPreFilter = stage.id === 'pre-filter';
                      const isQueryRewrite = stage.id === 'query-rewrite';
                      const isKnowledgeRecommend = stage.id === 'knowledge-recommend';
                      
                      if (isMeaningless && !isPreFilter) return null;

                      return (
                        <div key={stage.id} className="relative pl-12 pb-8 last:pb-0">
                           {/* Dot */}
                           <div className={`absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white z-10 shadow-sm transition-colors
                             ${stage.status === 'success' || stage.status === 'warning' ? 'bg-blue-600' : 
                               'bg-blue-100'}`}>
                              <div className="text-[12px] font-bold text-white">{index + 1}</div>
                           </div>

                           <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-3">
                                 <h3 className="text-[15px] font-bold text-slate-800">{stage.name}</h3>
                              </div>
                              
                              <div className="grid grid-cols-1 gap-6">
                                 <div className={isPreFilter ? '' : 'flex gap-8'}>
                                    {isQueryRewrite && !isMeaningless ? (
                                      <>
                                        <div className="flex-1">
                                           <div className="text-[12px] text-slate-900 mb-2">原内容</div>
                                           <div className="text-[13px] p-2.5 px-3 rounded border bg-slate-50 border-slate-100 text-slate-900">
                                              {selectedMessage?.content}
                                           </div>
                                        </div>
                                        <div className="flex-1">
                                           <div className="text-[12px] text-slate-900 mb-2">改写结果</div>
                                           <div className="text-[13px] p-2.5 px-3 rounded border bg-blue-50/30 border-blue-50 text-slate-900 font-medium">
                                              {stage.result}
                                           </div>
                                        </div>
                                      </>
                                    ) : isKnowledgeRecommend && !isMeaningless ? (
                                      <div>
                                         <div className="text-[12px] text-slate-900 mb-2">推荐知识块</div>
                                         <div className="flex flex-wrap gap-3">
                                            {Array.isArray(stage.result) ? stage.result.map((id: string) => (
                                              <button 
                                                key={id}
                                                onClick={() => setSelectedKnowledgeId(id)}
                                                className="text-[13px] p-2.5 px-4 rounded border bg-blue-50/30 border-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-colors cursor-pointer shadow-sm"
                                              >
                                                {id}
                                              </button>
                                            )) : (
                                              <button 
                                                onClick={() => setSelectedKnowledgeId(stage.result)}
                                                className="text-[13px] p-2.5 px-4 rounded border bg-blue-50/30 border-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-colors cursor-pointer shadow-sm"
                                              >
                                                {stage.result}
                                              </button>
                                            )}
                                         </div>
                                      </div>
                                    ) : (
                                      <div>
                                         <div className="text-[12px] text-slate-900 mb-2">处理结果</div>
                                         <div className={`text-[13px] p-1.5 px-3 rounded border w-fit ${
                                           (isPreFilter || stage.result === '跳过')
                                             ? 'text-slate-900 bg-slate-50 border-slate-200' 
                                             : (stage.result === '拦截' ? 'text-slate-900 bg-red-50/30 border-red-50 font-medium' : 'text-slate-900 bg-blue-50/30 border-blue-50 font-medium')
                                         }`}>
                                            {stage.result}
                                         </div>
                                      </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
             )}
          </div>

            <div className="flex items-center justify-end text-[13px] text-slate-500 space-x-4 bg-white p-4 border-t border-slate-100 flex-shrink-0">
                <span>共 13 条</span>
                <div className="flex items-center border border-slate-200 rounded px-2 py-1.5 bg-white cursor-pointer shadow-xs">
                   10条/页 <ChevronDown size={14} className="ml-2 text-slate-300" />
                </div>
                <div className="flex items-center space-x-1">
                    <button className="p-1 rounded text-slate-300 hover:bg-slate-100"><ChevronLeft size={16} /></button>
                    <button className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white font-bold text-[12px] shadow-sm">1</button>
                    <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 font-bold text-[12px] shadow-xs">2</button>
                    <button className="p-1 rounded text-slate-400 hover:bg-slate-100"><ChevronRight size={16} /></button>
                </div>
                <div className="flex items-center ml-2">
                   <span className="mr-2">前往</span>
                   <input type="text" className="w-10 border border-slate-200 rounded text-center py-1 outline-none mr-2 bg-white" defaultValue="1" />
                   <span>页</span>
                </div>
            </div>
         </div>
      </div>

      {/* Knowledge Content Modal */}
      {selectedKnowledgeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px]">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-slate-700 font-medium text-[18px]">
                {MOCK_KNOWLEDGE_CONTENT[selectedKnowledgeId]?.title || '知识详情'}
              </h3>
              <button 
                onClick={() => setSelectedKnowledgeId(null)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content Area with gray background box */}
            <div className="p-6 bg-slate-50">
              <div className="bg-white border border-slate-200 rounded p-10 min-h-[400px]">
                {MOCK_KNOWLEDGE_CONTENT[selectedKnowledgeId]?.subtitle && (
                   <div className="text-[16px] text-slate-600 mb-8">
                      {MOCK_KNOWLEDGE_CONTENT[selectedKnowledgeId]?.subtitle}
                   </div>
                )}

                <div className="border border-slate-100 rounded overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="w-1/4 px-6 py-4 text-left text-[15px] font-normal text-slate-500 border-r border-b border-slate-100">问题</th>
                        <th className="w-3/4 px-6 py-4 text-left text-[15px] font-normal text-slate-500 border-b border-slate-100">处理话术</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_KNOWLEDGE_CONTENT[selectedKnowledgeId]?.rows?.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-8 text-[15px] text-slate-600 border-r border-b border-slate-100 leading-relaxed align-top">
                            {row.question}
                          </td>
                          <td className="px-6 py-8 text-[15px] text-slate-600 border-b border-slate-100 leading-loose align-top">
                            {row.answer}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-white">
              <button 
                onClick={() => setSelectedKnowledgeId(null)}
                className="px-6 py-1.5 rounded border border-blue-200 bg-blue-50/50 text-blue-600 font-medium text-[14px] hover:bg-blue-100 transition-colors"
              >
                关 闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
