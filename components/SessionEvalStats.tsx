import React, { useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Calendar, Download, RefreshCw, Trash2 } from 'lucide-react';

interface EvalBatch {
  id: string;
  batchId: string;
  version: string;
  model: string;
  sessionCount: number;
  creator: string;
  evalTime: string;
  status: 'EVALUATING' | 'EVALUATED';
  // Filter metrics
  filterModel: string;
  filterJudge: string;
  // Rewrite metrics
  rewriteModel: string;
  rewriteJudge: string;
  // Intent metrics
  intentModel: string;
  intentJudge: string;
  // Emotion metrics
  emotionModel: string;
  emotionJudge: string;
  // Knowledge metrics
  knowledgeModel: string;
  knowledgeJudge: string;
}

export default function SessionEvalStats({ onNavigateToDetail }: { onNavigateToDetail: (id: string) => void }) {
  const [batches, setBatches] = useState<EvalBatch[]>([
    { 
      id: '1', batchId: 'session_eval_20260728_batch1', version: 'v1', model: 'Qwen3-30B-A3B', sessionCount: 100, creator: '10001', evalTime: 'null-null', status: 'EVALUATING',
      filterModel: '-', filterJudge: '-', rewriteModel: '-', rewriteJudge: '-', intentModel: '-', intentJudge: '-', emotionModel: '-', emotionJudge: '-', knowledgeModel: '-', knowledgeJudge: '-'
    },
    { 
      id: '2', batchId: 'session_eval_20260728_batch2', version: 'v1', model: 'Qwen3-30B-A3B', sessionCount: 100, creator: '10001', evalTime: 'null-null', status: 'EVALUATING',
      filterModel: '-', filterJudge: '-', rewriteModel: '-', rewriteJudge: '-', intentModel: '-', intentJudge: '-', emotionModel: '-', emotionJudge: '-', knowledgeModel: '-', knowledgeJudge: '-'
    },
    { 
      id: '3', batchId: 'session_eval_20260728_batch3', version: 'v1', model: 'deepseek-v4-pro', sessionCount: 51, creator: '10001', evalTime: '2026-07-28 11:43:03-2026-07-28 11:55:22', status: 'EVALUATED',
      filterModel: '88.2%', filterJudge: '85.0%', rewriteModel: '91.0%', rewriteJudge: '88.5%', intentModel: '85.5%', intentJudge: '72.1%', emotionModel: '95.0%', emotionJudge: '92.1%', knowledgeModel: '90.2%', knowledgeJudge: '88.0%'
    },
    { 
      id: '5', batchId: 'session_eval_20260727_batch4', version: 'v1', model: 'Qwen3-30B-A3B', sessionCount: 10, creator: '10001', evalTime: '2026-07-27 15:20:55-2026-07-27 15:22:12', status: 'EVALUATED',
      filterModel: '82.0%', filterJudge: '78.5%', rewriteModel: '85.5%', rewriteJudge: '82.0%', intentModel: '82.2%', intentJudge: '75.0%', emotionModel: '88.2%', emotionJudge: '80.0%', knowledgeModel: '78.5%', knowledgeJudge: '65.0%'
    },
  ]);

  const INITIAL_BATCHES = [
    { 
      id: '1', batchId: 'session_eval_20260728_batch1', version: 'v1', model: 'Qwen3-30B-A3B', sessionCount: 100, creator: '10001', evalTime: 'null-null', status: 'EVALUATING',
      filterModel: '-', filterJudge: '-', rewriteModel: '-', rewriteJudge: '-', intentModel: '-', intentJudge: '-', emotionModel: '-', emotionJudge: '-', knowledgeModel: '-', knowledgeJudge: '-'
    },
    { 
      id: '2', batchId: 'session_eval_20260728_batch2', version: 'v1', model: 'Qwen3-30B-A3B', sessionCount: 100, creator: '10001', evalTime: 'null-null', status: 'EVALUATING',
      filterModel: '-', filterJudge: '-', rewriteModel: '-', rewriteJudge: '-', intentModel: '-', intentJudge: '-', emotionModel: '-', emotionJudge: '-', knowledgeModel: '-', knowledgeJudge: '-'
    },
    { 
      id: '3', batchId: 'session_eval_20260728_batch3', version: 'v1', model: 'deepseek-v4-pro', sessionCount: 51, creator: '10001', evalTime: '2026-07-28 11:43:03-2026-07-28 11:55:22', status: 'EVALUATED',
      filterModel: '88.2%', filterJudge: '85.0%', rewriteModel: '91.0%', rewriteJudge: '88.5%', intentModel: '85.5%', intentJudge: '72.1%', emotionModel: '95.0%', emotionJudge: '92.1%', knowledgeModel: '90.2%', knowledgeJudge: '88.0%'
    },
    { 
      id: '5', batchId: 'session_eval_20260727_batch4', version: 'v1', model: 'Qwen3-30B-A3B', sessionCount: 10, creator: '10001', evalTime: '2026-07-27 15:20:55-2026-07-27 15:22:12', status: 'EVALUATED',
      filterModel: '82.0%', filterJudge: '78.5%', rewriteModel: '85.5%', rewriteJudge: '82.0%', intentModel: '82.2%', intentJudge: '75.0%', emotionModel: '88.2%', emotionJudge: '80.0%', knowledgeModel: '78.5%', knowledgeJudge: '65.0%'
    },
  ];

  const [searchBatchId, setSearchBatchId] = useState('');
  const [searchCreator, setSearchCreator] = useState('');

  const handleSearch = () => {
    let filtered = [...INITIAL_BATCHES];
    if (searchBatchId) {
      filtered = filtered.filter(b => b.batchId.includes(searchBatchId));
    }
    if (searchCreator) {
      filtered = filtered.filter(b => b.creator.includes(searchCreator));
    }
    setBatches(filtered);
  };

  const handleReset = () => {
    setSearchBatchId('');
    setSearchCreator('');
    setBatches(INITIAL_BATCHES);
  };

  const summaryCards = [
    {
      title: '过滤评估',
      modelAcc: 85,
      concordance: 78,
    },
    {
      title: '改写评估',
      modelAcc: 92,
      concordance: 85,
    },
    {
      title: '意图评估',
      modelAcc: 88,
      concordance: 82,
    },
    {
      title: '情绪评估',
      modelAcc: 95,
      concordance: 90,
    },
    {
      title: '知识评估',
      modelAcc: 90,
      concordance: 82,
    }
  ];

  const renderStatus = (status: EvalBatch['status']) => {
    if (status === 'EVALUATING') {
      return <span className="px-2 py-1 bg-orange-50 text-orange-400 border border-orange-100 rounded text-[11px]">评估中</span>;
    }
    return <span className="px-2 py-1 bg-green-50 text-green-500 border border-green-100 rounded text-[11px]">已评估</span>;
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden">
      <div className="p-4 flex-shrink-0 flex items-center justify-between bg-white border-b border-slate-200">
         <h2 className="text-[16px] font-bold text-slate-800">会话评估</h2>
      </div>

      {/* Summary Cards Grid */}
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

      {/* Filters Section */}
      <div className="m-4 p-4 bg-white rounded-lg border border-slate-200 flex-shrink-0 space-y-4 shadow-sm">
        <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
          <div className="flex items-center">
            <span className="text-[13px] text-slate-600 mr-2 font-medium w-16">批次编号</span>
            <input 
              type="text" 
              placeholder="请输入" 
              className="w-48 border border-slate-200 rounded px-3 py-1.5 text-[13px] outline-none focus:border-blue-500 transition-colors" 
              value={searchBatchId}
              onChange={(e) => setSearchBatchId(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <span className="text-[13px] text-slate-600 mr-2 font-medium w-12">创建人</span>
            <input 
              type="text" 
              placeholder="请输入" 
              className="w-48 border border-slate-200 rounded px-3 py-1.5 text-[13px] outline-none focus:border-blue-500 transition-colors" 
              value={searchCreator}
              onChange={(e) => setSearchCreator(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <span className="text-[13px] text-slate-600 mr-2 font-medium w-8">状态</span>
            <div className="w-48 border border-slate-200 rounded px-3 py-1.5 text-[13px] text-slate-400 bg-white flex justify-between items-center cursor-pointer">
              全部 <ChevronDown size={14} />
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-[13px] text-slate-600 mr-2 font-medium w-16">评估时间</span>
            <div className="flex items-center border border-slate-200 bg-white rounded overflow-hidden px-2">
              <Calendar size={14} className="text-slate-400 mr-2" />
              <input type="text" placeholder="开始时间" className="w-24 text-[13px] outline-none py-1.5" />
              <span className="text-slate-400 px-2 text-[12px]">至</span>
              <input type="text" placeholder="结束时间" className="w-24 text-[13px] outline-none py-1.5" />
            </div>
          </div>

          <div className="flex space-x-2 ml-auto">
             <button 
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded text-[13px] font-medium transition-colors shadow-sm"
             >查询</button>
             <button 
              onClick={handleReset}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-1.5 rounded text-[13px] font-medium transition-colors"
             >重置</button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 flex-shrink-0 flex items-center space-x-3 mb-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-[12px] flex items-center shadow-sm transition-all active:scale-95">
          <Download size={14} className="mr-1.5" /> 导出
        </button>
        <div className="relative group/btn">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-[12px] flex items-center shadow-sm transition-all active:scale-95">
            <RefreshCw size={14} className="mr-1.5" /> 重复评估
          </button>
          <div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-slate-800 text-white text-[11px] rounded shadow-xl opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity z-20">
            重新执行Judge自动评测，不改动人工打标金标数据。
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 flex flex-col overflow-hidden px-4 pb-4">
        <div className="flex-1 overflow-auto bg-white rounded-lg border border-slate-200 shadow-sm custom-scrollbar">
           <table className="w-full text-center border-collapse text-[12px] min-w-[1400px]">
              <thead className="sticky top-0 z-10 bg-[#e7eefe]">
                  <tr>
                    <th rowSpan={2} className="py-3 px-3 border-b border-white border-r w-10">
                       <input type="checkbox" className="rounded border-slate-300" />
                    </th>
                    <th rowSpan={2} className="py-3 px-2 font-medium text-slate-700 border-b border-white border-r">批次编号</th>
                    <th rowSpan={2} className="py-3 px-2 font-medium text-slate-700 border-b border-white border-r">批次版本</th>
                    <th rowSpan={2} className="py-3 px-2 font-medium text-slate-700 border-b border-white border-r">运行模型</th>
                    <th rowSpan={2} className="py-3 px-2 font-medium text-slate-700 border-b border-white border-r">会话数</th>
                    <th rowSpan={2} className="py-3 px-2 font-medium text-slate-700 border-b border-white border-r">创建人</th>
                    <th rowSpan={2} className="py-3 px-2 font-medium text-slate-700 border-b border-white border-r">评估时间</th>
                    <th rowSpan={2} className="py-3 px-2 font-medium text-slate-700 border-b border-white border-r">状态</th>
                    
                    <th colSpan={2} className="py-2 px-2 font-bold text-slate-800 border-b border-white border-r">过滤模块</th>
                    <th colSpan={2} className="py-2 px-2 font-bold text-slate-800 border-b border-white border-r">改写模块</th>
                    <th colSpan={2} className="py-2 px-2 font-bold text-slate-800 border-b border-white border-r">意图模块</th>
                    <th colSpan={2} className="py-2 px-2 font-bold text-slate-800 border-b border-white border-r">情绪模块</th>
                    <th colSpan={2} className="py-2 px-2 font-bold text-slate-800 border-b border-white border-r">知识模块</th>
                    
                    <th rowSpan={2} className="py-3 px-2 font-medium text-slate-700 border-b border-white">操作</th>
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
                 {batches.map(batch => (
                    <tr key={batch.id} className="bg-white border-b border-slate-50 hover:bg-slate-50 transition-colors">
                       <td className="py-3 px-3 text-center border-r border-slate-50">
                           <input type="checkbox" className="rounded border-slate-300" />
                       </td>
                       <td className="py-3 px-2 text-slate-600 border-r border-slate-50">{batch.batchId}</td>
                       <td className="py-3 px-2 text-slate-600 border-r border-slate-50">{batch.version}</td>
                       <td className="py-3 px-2 text-slate-600 border-r border-slate-50">{batch.model}</td>
                       <td className="py-3 px-2 text-slate-600 border-r border-slate-50">{batch.sessionCount}</td>
                       <td className="py-3 px-2 text-slate-600 border-r border-slate-50">{batch.creator}</td>
                       <td className="py-3 px-2 text-slate-500 border-r border-slate-50 max-w-[150px] truncate whitespace-nowrap" title={batch.evalTime}>{batch.evalTime}</td>
                       <td className="py-3 px-2 border-r border-slate-50">{renderStatus(batch.status)}</td>
                       {/* Filter Cells */}
                       <td className="py-3 px-2 border-r border-slate-50 text-blue-600 font-medium">{batch.filterModel}</td>
                       <td className="py-3 px-2 border-r border-slate-50 text-orange-500 font-medium">{batch.filterJudge}</td>
                       {/* Rewrite Cells */}
                       <td className="py-3 px-2 border-r border-slate-50 text-blue-600 font-medium">{batch.rewriteModel}</td>
                       <td className="py-3 px-2 border-r border-slate-50 text-orange-500 font-medium">{batch.rewriteJudge}</td>
                       {/* Intent Cells */}
                       <td className="py-3 px-2 border-r border-slate-50 text-blue-600 font-medium">{batch.intentModel}</td>
                       <td className="py-3 px-2 border-r border-slate-50 text-orange-500 font-medium">{batch.intentJudge}</td>
                       {/* Emotion Cells */}
                       <td className="py-3 px-2 border-r border-slate-50 text-blue-600 font-medium">{batch.emotionModel}</td>
                       <td className="py-3 px-2 border-r border-slate-50 text-orange-500 font-medium">{batch.emotionJudge}</td>
                       {/* Knowledge Cells */}
                       <td className="py-3 px-2 border-r border-slate-50 text-blue-600 font-medium">{batch.knowledgeModel}</td>
                       <td className="py-3 px-2 border-r border-slate-50 text-orange-500 font-medium">{batch.knowledgeJudge}</td>
                       <td className="py-3 px-2">
                          {batch.status === 'EVALUATING' ? (
                            <button className="text-rose-500 hover:text-rose-700 font-medium">删除</button>
                          ) : (
                            <button 
                              className="text-blue-500 hover:text-blue-700 font-medium"
                              onClick={() => onNavigateToDetail(batch.batchId)}
                            >详情</button>
                          )}
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-end text-[12px] text-slate-500 space-x-4 shrink-0 bg-white p-2 rounded border border-slate-100 shadow-sm">
           <span>共 29 条</span>
           <div className="flex items-center border border-slate-200 rounded px-2 py-1 bg-white cursor-pointer hover:border-blue-300 transition-colors">
              10条/页 <ChevronDown size={14} className="ml-2" />
           </div>
           <div className="flex items-center space-x-1">
               <button className="p-1 rounded text-slate-400 hover:bg-slate-100"><ChevronLeft size={14} /></button>
               <button className="w-6 h-6 flex items-center justify-center rounded bg-blue-600 text-white font-medium shadow-sm">1</button>
               <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 transition-colors">2</button>
               <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 transition-colors">3</button>
               <button className="p-1 rounded text-slate-600 hover:bg-slate-100"><ChevronRight size={14} /></button>
           </div>
           <div className="flex items-center">
              <span className="mr-2">前往</span>
              <input type="text" className="w-10 border border-slate-200 rounded text-center py-1 outline-none focus:border-blue-400 mr-2" defaultValue="1" />
              <span>页</span>
           </div>
        </div>
      </div>
    </div>
  );
}
