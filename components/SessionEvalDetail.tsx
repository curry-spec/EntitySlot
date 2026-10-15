import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar, Download } from 'lucide-react';

interface SessionDetailLog {
  id: string;
  sessionId: string;
  channel: string;
  time: string;
  // Filter
  filterModel: string;
  filterGold: string;
  filterJudge: string;
  // Rewrite
  rewriteModel: string;
  rewriteGold: string;
  rewriteJudge: string;
  // Intent
  intentModel: string;
  intentGold: string;
  intentJudge: string;
  // Emotion
  emotionModel: string;
  emotionGold: string;
  emotionJudge: string;
  // Knowledge
  knowledgeModel: string;
  knowledgeGold: string;
  knowledgeJudge: string;
}

const MOCK_SESSION_LOGS: SessionDetailLog[] = [
  {
    id: '1',
    sessionId: 'tg_eval_5_4bcfb338fd3c',
    channel: '呼入渠道',
    time: '2026-07-27 15:09:44',
    filterModel: '通过', filterGold: '通过', filterJudge: '通过',
    rewriteModel: '需转人工', rewriteGold: '需转人工', rewriteJudge: '需转人工',
    intentModel: '信用卡挂失', intentGold: '信用卡挂失', intentJudge: '信用卡挂失',
    emotionModel: '平静', emotionGold: '平静', emotionJudge: '平静',
    knowledgeModel: '挂失流程规范', knowledgeGold: '挂失流程规范', knowledgeJudge: '挂失流程规范',
  },
  {
    id: '2',
    sessionId: 'tg_eval_4_c647711d6330',
    channel: '在线客服',
    time: '2026-07-27 15:09:43',
    filterModel: '拦截', filterGold: '拦截', filterJudge: '拦截',
    rewriteModel: '查询账单', rewriteGold: '查询账单', rewriteJudge: '查询账单',
    intentModel: '账单查询', intentGold: '账单查询', intentJudge: '账单查询',
    emotionModel: '焦虑', emotionGold: '焦虑', emotionJudge: '焦虑',
    knowledgeModel: '账单说明', knowledgeGold: '账单说明', knowledgeJudge: '账单说明',
  },
  {
    id: '3',
    sessionId: 'tg_eval_3_b9ddda19df52',
    channel: '电话渠道',
    time: '2026-07-27 15:09:32',
    filterModel: '通过', filterGold: '通过', filterJudge: '通过',
    rewriteModel: '激活卡片', rewriteGold: '激活卡片', rewriteJudge: '激活卡片',
    intentModel: '进度查询', intentGold: '卡片激活', intentJudge: '卡片激活',
    emotionModel: '平静', emotionGold: '平静', emotionJudge: '平静',
    knowledgeModel: '激活教程', knowledgeGold: '激活教程', knowledgeJudge: '激活教程',
  },
  {
    id: '4',
    sessionId: 'tg_eval_1_82b43180b230',
    channel: 'APP渠道',
    time: '2026-07-27 15:09:26',
    filterModel: '通过', filterGold: '通过', filterJudge: '通过',
    rewriteModel: '人工服务', rewriteGold: '人工服务', rewriteJudge: '人工服务',
    intentModel: '人工服务', intentGold: '人工服务', intentJudge: '人工服务',
    emotionModel: '愤怒', emotionGold: '愤怒', emotionJudge: '平静',
    knowledgeModel: '-', knowledgeGold: '-', knowledgeJudge: '-',
  },
  {
    id: '5',
    sessionId: 'tg_eval_2_99c9a71ac6e5',
    channel: '微信渠道',
    time: '2026-07-27 15:09:26',
    filterModel: '通过', filterGold: '通过', filterJudge: '拦截',
    rewriteModel: '注销', rewriteGold: '注销', rewriteJudge: '-',
    intentModel: '注销卡片', intentGold: '注销卡片', intentJudge: '信息咨询',
    emotionModel: '平静', emotionGold: '平静', emotionJudge: '平静',
    knowledgeModel: '注销须知', knowledgeGold: '注销须知', knowledgeJudge: '-',
  },
];

export default function SessionEvalDetail({ sessionId: batchId, onBack }: { sessionId: string; onBack: () => void }) {
  const [showOnlyDeviations, setShowOnlyDeviations] = useState(false);
  
  const batchInfo = {
    batchId: 'session_eval_20260727150925466_9a58f99f_v1',
    version: 'v1',
    model: 'deepseek-v4-pro',
    evalTime: '2026-07-27 15:09:54 - 2026-07-27 15:12:56',
    creator: '10001',
    totalSessions: 5
  };

  const summaryCards = [
    { title: '过滤评估', modelAcc: 85, concordance: 78 },
    { title: '改写评估', modelAcc: 92, concordance: 85 },
    { title: '意图评估', modelAcc: 88, concordance: 82 },
    { title: '情绪评估', modelAcc: 95, concordance: 90 },
    { title: '知识评估', modelAcc: 90, concordance: 82 }
  ];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header section with Batch Info */}
      <div className="p-4 border-b border-slate-200 flex flex-col flex-shrink-0 bg-white">
        <div className="flex items-center mb-4">
          <button onClick={onBack} className="mr-3 text-slate-500 hover:text-slate-800 transition-colors">
             <ChevronLeft size={20} />
          </button>
          <h2 className="text-[16px] font-bold text-slate-800">批次详情</h2>
        </div>
        
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[12px] text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
          <div className="flex items-center"><span className="text-slate-400 mr-2">批次编号:</span> <span className="font-medium text-slate-800">{batchInfo.batchId}</span></div>
          <div className="flex items-center"><span className="text-slate-400 mr-2">批次版本:</span> <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">{batchInfo.version}</span></div>
          <div className="flex items-center"><span className="text-slate-400 mr-2">运行模型:</span> <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">{batchInfo.model}</span></div>
          <div className="flex items-center"><span className="text-slate-400 mr-2">评估时间:</span> <span className="font-medium text-slate-800">{batchInfo.evalTime}</span></div>
          <div className="flex items-center"><span className="text-slate-400 mr-2">创建人:</span> <span className="font-medium text-slate-800">{batchInfo.creator}</span></div>
          <div className="flex items-center"><span className="text-slate-400 mr-2">总会话数:</span> <span className="font-bold text-slate-800">{batchInfo.totalSessions}</span></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search Bar Section */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-x-8 gap-y-4 items-center bg-white flex-shrink-0">
          <div className="flex items-center">
            <span className="text-[13px] text-slate-700 mr-2 font-medium">会话ID</span>
            <input type="text" placeholder="请输入" className="w-48 border border-slate-200 rounded px-3 py-1.5 text-[13px] outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div className="flex items-center">
            <span className="text-[13px] text-slate-700 mr-2 font-medium">渠道分类</span>
            <div className="w-48 border border-slate-200 rounded px-3 py-1.5 text-[13px] text-slate-400 bg-white flex justify-between items-center cursor-pointer">
              请选择 <ChevronDown size={14} />
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-[13px] text-slate-700 mr-2 font-medium">会话时间</span>
            <div className="flex items-center border border-slate-200 bg-white rounded overflow-hidden px-2">
              <Calendar size={14} className="text-slate-400 mr-2" />
              <input type="text" placeholder="开始时间" className="w-24 text-[13px] outline-none py-1.5" />
              <span className="text-slate-400 px-2 text-[12px]">至</span>
              <input type="text" placeholder="结束时间" className="w-24 text-[13px] outline-none py-1.5" />
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded cursor-pointer hover:bg-rose-100 transition-colors" onClick={() => setShowOnlyDeviations(!showOnlyDeviations)}>
            <input type="checkbox" checked={showOnlyDeviations} onChange={() => {}} className="rounded border-rose-300 text-rose-500 focus:ring-rose-500" />
            <span className="text-[12px] text-rose-700 font-bold">仅看存在偏差</span>
          </div>

          <div className="flex space-x-2 ml-auto">
             <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded text-[13px] font-medium transition-colors shadow-sm">查询</button>
             <button className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-6 py-1.5 rounded text-[13px] font-medium transition-colors">重置</button>
          </div>
        </div>

        {/* Evaluation Summary View */}
        <div className="p-4 grid grid-cols-5 gap-4 shrink-0 bg-slate-50/50 border-b border-slate-200">
          {summaryCards.map((card, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group flex flex-col justify-center h-[100px] relative overflow-visible">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-bold text-slate-800 tracking-tight">{card.title}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-[12px] group/item relative cursor-help">
                  <span className="text-slate-400 w-28 shrink-0">业务模型准确率</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-600 font-bold">{card.modelAcc}%</span>
                  </div>
                  <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-800 text-white text-[11px] rounded shadow-xl opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity z-20">
                    业务模型输出结果和人工打标金标的匹配占比，代表业务模型真实效果。
                  </div>
                </div>

                <div className="flex items-center text-[12px] group/item relative cursor-help">
                  <span className="text-slate-400 w-28 shrink-0">Judge评测吻合率</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-orange-500 font-bold">{card.concordance}%</span>
                  </div>
                  <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-800 text-white text-[11px] rounded shadow-xl opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity z-20">
                    Judge自动评测输出结果与人工金标的匹配占比，衡量Judge评测工具本身的准确性。
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-white flex-shrink-0">
             <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start space-x-2">
               <div className="text-amber-500 mt-0.5">💡</div>
               <div className="text-[12px] text-amber-700 leading-relaxed">
                 提示：会话详情展示各模块的评测结果。悬停在具体单元格可查看<span className="font-bold underline">人工金标</span>详情；背景红色代表与金标不符。
               </div>
             </div>
          </div>

          <div className="px-4 py-3 flex-shrink-0 flex items-center justify-between">
             <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-[13px] font-medium shadow-sm flex items-center transition-all active:scale-95">
                <Download size={14} className="mr-1.5" /> 导出结果
             </button>
             <div className="text-[12px] text-slate-400">
               注：数据行中的颜色代表匹配状态：<span className="text-blue-600">蓝色(模型输出)</span> / <span className="text-orange-500 text-opacity-80">橙色(Judge评测)</span> / <span className="text-rose-500">红色背景(存在偏差)</span>
             </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col px-4 pb-4">
             <div className="flex-1 overflow-auto bg-white rounded-lg border border-slate-200 shadow-sm custom-scrollbar">
                 <table className="w-full text-center border-collapse text-[12px] min-w-[1400px]">
                    <thead className="sticky top-0 z-10 bg-[#e7eefe]">
                       <tr>
                          <th rowSpan={2} className="py-3 px-3 border-b border-white border-r whitespace-nowrap">会话ID</th>
                          <th rowSpan={2} className="py-3 px-3 border-b border-white border-r whitespace-nowrap">渠道分类</th>
                          <th rowSpan={2} className="py-3 px-3 border-b border-white border-r whitespace-nowrap">会话时间</th>
                          
                          <th colSpan={2} className="py-2 px-2 font-bold text-slate-800 border-b border-white border-r">过滤模块</th>
                          <th colSpan={2} className="py-2 px-2 font-bold text-slate-800 border-b border-white border-r">改写模块</th>
                          <th colSpan={2} className="py-2 px-2 font-bold text-slate-800 border-b border-white border-r">意图模块</th>
                          <th colSpan={2} className="py-2 px-2 font-bold text-slate-800 border-b border-white border-r">情绪模块</th>
                          <th colSpan={2} className="py-2 px-2 font-bold text-slate-800 border-b border-white border-r">知识模块</th>
                          
                          <th rowSpan={2} className="py-3 px-3 border-b border-white">匹配状态</th>
                       </tr>
                       <tr>
                          <th className="py-1.5 px-2 font-medium text-blue-600 border-b border-white border-r">业务模型</th>
                          <th className="py-1.5 px-2 font-medium text-orange-500 border-b border-white border-r">Judge评测</th>
                          
                          <th className="py-1.5 px-2 font-medium text-blue-600 border-b border-white border-r">业务模型</th>
                          <th className="py-1.5 px-2 font-medium text-orange-500 border-b border-white border-r">Judge评测</th>
                          
                          <th className="py-1.5 px-2 font-medium text-blue-600 border-b border-white border-r">业务模型</th>
                          <th className="py-1.5 px-2 font-medium text-orange-500 border-b border-white border-r">Judge评测</th>
                          
                          <th className="py-1.5 px-2 font-medium text-blue-600 border-b border-white border-r">业务模型</th>
                          <th className="py-1.5 px-2 font-medium text-orange-500 border-b border-white border-r">Judge评测</th>
                          
                          <th className="py-1.5 px-2 font-medium text-blue-600 border-b border-white border-r">业务模型</th>
                          <th className="py-1.5 px-2 font-medium text-orange-500 border-b border-white border-r">Judge评测</th>
                       </tr>
                    </thead>
                    <tbody>
                        {MOCK_SESSION_LOGS.filter(log => {
                           if (!showOnlyDeviations) return true;
                           const anyMismatch = 
                             log.filterModel !== log.filterGold || log.filterJudge !== log.filterGold ||
                             log.rewriteModel !== log.rewriteGold || log.rewriteJudge !== log.rewriteGold ||
                             log.intentModel !== log.intentGold || log.intentJudge !== log.intentGold ||
                             log.emotionModel !== log.emotionGold || log.emotionJudge !== log.emotionGold ||
                             log.knowledgeModel !== log.knowledgeGold || log.knowledgeJudge !== log.knowledgeGold;
                           return anyMismatch;
                        }).map(log => {
                           const renderCell = (modelVal: string, judgeVal: string, goldVal: string) => {
                             const isModelMatch = modelVal === goldVal;
                             const isJudgeMatch = judgeVal === goldVal;
                             return (
                               <>
                                 <td className={`py-3 px-2 border-r border-slate-50 ${isModelMatch ? 'text-blue-600' : 'text-rose-500 font-bold bg-rose-50/30'}`} title={`金标: ${goldVal}`}>
                                   {modelVal}
                                 </td>
                                 <td className={`py-3 px-2 border-r border-slate-50 ${isJudgeMatch ? 'text-orange-500' : 'text-rose-600 font-bold bg-rose-100/30'}`} title={`金标: ${goldVal}`}>
                                   {judgeVal}
                                 </td>
                               </>
                             );
                           };

                           const allMatch = 
                             log.filterModel === log.filterGold && log.filterJudge === log.filterGold &&
                             log.rewriteModel === log.rewriteGold && log.rewriteJudge === log.rewriteGold &&
                             log.intentModel === log.intentGold && log.intentJudge === log.intentGold &&
                             log.emotionModel === log.emotionGold && log.emotionJudge === log.emotionGold &&
                             log.knowledgeModel === log.knowledgeGold && log.knowledgeJudge === log.knowledgeGold;

                           return (
                              <tr key={log.id} className="bg-white border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                 <td className="py-3 px-3 text-slate-600 border-r border-slate-50 font-medium">{log.sessionId}</td>
                                 <td className="py-3 px-3 text-slate-500 border-r border-slate-50">{log.channel}</td>
                                 <td className="py-3 px-3 text-slate-500 border-r border-slate-50">{log.time}</td>
                                 
                                 {renderCell(log.filterModel, log.filterJudge, log.filterGold)}
                                 {renderCell(log.rewriteModel, log.rewriteJudge, log.rewriteGold)}
                                 {renderCell(log.intentModel, log.intentJudge, log.intentGold)}
                                 {renderCell(log.emotionModel, log.emotionJudge, log.emotionGold)}
                                 {renderCell(log.knowledgeModel, log.knowledgeJudge, log.knowledgeGold)}

                                 <td className="py-3 px-3">
                                    {allMatch ? (
                                       <span className="text-[11px] text-green-500 bg-green-50 px-2 py-0.5 rounded border border-green-100">完全一致</span>
                                    ) : (
                                       <span className="text-[11px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">存在偏差</span>
                                    )}
                                 </td>
                              </tr>
                           );
                        })}
                    </tbody>
                 </table>
             </div>

             <div className="mt-4 flex items-center justify-end text-[12px] text-slate-500 space-x-4 bg-white p-2 rounded border border-slate-100 shadow-sm">
                 <span>共 5 条</span>
                 <div className="flex items-center border border-slate-200 rounded px-2 py-1 bg-white">
                    10条/页 <ChevronDown size={14} className="ml-2" />
                 </div>
                 <div className="flex items-center space-x-1">
                     <button className="p-1 rounded text-slate-400 hover:bg-slate-100"><ChevronLeft size={14} /></button>
                     <button className="w-6 h-6 flex items-center justify-center rounded bg-blue-600 text-white font-medium">1</button>
                     <button className="p-1 rounded text-slate-400 cursor-not-allowed"><ChevronRight size={14} /></button>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
