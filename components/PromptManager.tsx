import React, { useState } from 'react';
import { Prompt } from '../types';
import { MOCK_PROMPTS, MOCK_SCENARIO_VARIABLES, MOCK_PROMPT_SCENARIOS } from '../constants';
import { Search, Plus, Edit2, PlayCircle, Clock, Copy, Trash2, X, FileText, Monitor, CheckCircle2, Layers, ChevronDown, Check, Info, Sparkles } from 'lucide-react';

interface PromptManagerProps {
  prompts: Prompt[];
  setPrompts: React.Dispatch<React.SetStateAction<Prompt[]>>;
}

interface TestSet {
  id: string;
  name: string;
  description?: string;
  variables: Record<string, string>;
}

const PromptManager: React.FC<PromptManagerProps> = ({ prompts, setPrompts }) => {
  const [view, setView] = useState<'LIST' | 'DEBUG'>('LIST');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [editingPrompt, setEditingPrompt] = useState<Partial<Prompt> | null>(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [historyPrompt, setHistoryPrompt] = useState<Prompt | null>(null);
  const [currentDebugPrompt, setCurrentDebugPrompt] = useState<Prompt | null>(null);
  const [debugOutput, setDebugOutput] = useState('');
  const [debugInput, setDebugInput] = useState('');
  const [debugSystemInstruction, setDebugSystemInstruction] = useState('');
  const [isDebugging, setIsDebugging] = useState(false);

  // Testing set states
  const [testSets, setTestSets] = useState<TestSet[]>([
     { id: 'ts1', name: '多意图型', variables: { 'input': '我想查一下信用卡的额度，顺便问下怎么提升，另外你们那个分期怎么收手续费的？', 'timestamp': '2026-06-02 10:00:00' } },
     { id: 'ts2', name: '创建于 2026_05_11 14_21_14', variables: { 'input': '怎么可能利率这么高？', 'timestamp': '2026-06-02 10:00:00' } }
  ]);
  const [selectedTestSetId, setSelectedTestSetId] = useState<string>('');
  const [isTestSetDropdownOpen, setIsTestSetDropdownOpen] = useState(false);
  const [testSetMode, setTestSetMode] = useState<'CREATE'|'EDIT'|null>(null);
  const [editingTestSet, setEditingTestSet] = useState<Partial<TestSet> | null>(null);

  const [isJsonMode, setIsJsonMode] = useState(false);
  const [variableInputs, setVariableInputs] = useState<Record<string, string>>({});
  const [saveAsTestSet, setSaveAsTestSet] = useState(false);

  const filteredPrompts = prompts.filter(p => p.name.includes(searchQuery));

  const handleCreate = () => {
    setDrawerMode('CREATE');
    setEditingPrompt({
      name: '',
      model: '',
      businessScenario: '',
      content: '',
      description: '',
      status: 'INACTIVE',
    });
    setIsDrawerOpen(true);
  };

  const handleEdit = (p: Prompt) => {
    setDrawerMode('EDIT');
    setEditingPrompt({ ...p });
    setIsDrawerOpen(true);
  };

  const handleDebug = (p: Prompt) => {
    setCurrentDebugPrompt(p);
    setDebugSystemInstruction(p.content);
    setDebugInput('');
    setDebugOutput('');
    setVariableInputs({});
    setSaveAsTestSet(false);
    setIsJsonMode(false);
    setSelectedTestSetId('');
    setView('DEBUG');
  };

  const currentScenarioVars = currentDebugPrompt?.businessScenario ? (MOCK_SCENARIO_VARIABLES[currentDebugPrompt.businessScenario] || []) : [];

  const handleSelectTestSet = (id: string) => {
     setSelectedTestSetId(id);
     setIsTestSetDropdownOpen(false);
     const ts = testSets.find(t => t.id === id);
     if (ts) {
        setVariableInputs(ts.variables);
        setDebugInput(JSON.stringify({ "_input": ts.variables }, null, 2));
     } else {
        setVariableInputs({});
        setDebugInput('{\n  "_input": {}\n}');
     }
  };

  const toggleJsonMode = () => {
    setIsJsonMode(prev => {
       if (!prev) {
          const val = JSON.stringify({ "_input": variableInputs }, null, 2);
          setDebugInput(val);
          return true;
       } else {
          try {
             const parsed = JSON.parse(debugInput);
             if (parsed._input) {
                setVariableInputs(parsed._input);
             } else {
                setVariableInputs(parsed);
             }
          } catch (e) {
          }
          return false;
       }
    });
  };

  const handleRunDebugCustom = () => {
    let currentVars = variableInputs;
    if (isJsonMode) {
        try {
            const parsed = JSON.parse(debugInput);
            currentVars = parsed._input || parsed;
            setVariableInputs(currentVars);
        } catch(e) {}
    }

    if (saveAsTestSet) {
       const pad = (n: number) => n.toString().padStart(2, '0');
       const now = new Date();
       const nowStr = `${now.getFullYear()}_${pad(now.getMonth()+1)}_${pad(now.getDate())} ${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}`;
       const newTs = {
          id: `ts${Date.now()}`,
          name: `创建于 ${nowStr}`,
          variables: currentVars
       };
       setTestSets([newTs, ...testSets]);
       setSelectedTestSetId(newTs.id);
       setSaveAsTestSet(false);
    }
    
    setIsDebugging(true);
    setTimeout(() => {
      setDebugOutput('这是模型生成的模拟结果：\n根据客户诉求，已经办理相关业务。满意度良好。');
      setIsDebugging(false);
    }, 1500);
  };

  const handleHistory = (p: Prompt) => {
    setHistoryPrompt(p);
    setIsHistoryVisible(true);
  };

  const handleDelete = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveDrawer = () => {
    if (drawerMode === 'CREATE') {
      const newPrompt: Prompt = {
        id: `p${Date.now()}`,
        name: editingPrompt?.name || '未命名提示词',
        model: editingPrompt?.model || 'qwen3-30b-a3b',
        businessScenario: editingPrompt?.businessScenario || '工单摘要',
        content: editingPrompt?.content || '',
        description: editingPrompt?.description || '',
        status: 'ACTIVE',
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        creator: '当前用户',
        version: 'V1.0'
      };
      setPrompts(prev => [newPrompt, ...prev]);
    } else if (editingPrompt && editingPrompt.id) {
      setPrompts(prev => prev.map(p => p.id === editingPrompt.id ? { 
        ...p, 
        ...editingPrompt,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      } as Prompt : p));
    }
    setIsDrawerOpen(false);
  };
  
  const handleDebugConfirm = () => {
     if (currentDebugPrompt) {
         setPrompts(prev => prev.map(p => p.id === currentDebugPrompt.id ? { 
            ...p, 
            content: debugSystemInstruction,
            updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
         } : p));
     }
     setView('LIST');
  };

  const handleRunDebug = () => {
    if (!debugInput.trim()) return;
    setIsDebugging(true);
    setTimeout(() => {
      setDebugOutput('这是模型生成的模拟结果：\\n根据客户诉求，已经办理相关业务。满意度良好。');
      setIsDebugging(false);
    }, 1500);
  };

  if (view === 'DEBUG' && currentDebugPrompt) {
    return (
      <div className="flex flex-col h-full bg-[#f8fafc]">
         <div className="flex items-center justify-between bg-white px-6 py-3 border-b border-slate-200">
            <div className="flex items-center">
               <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                 <Monitor size={16} />
               </div>
               <div>
                  <div className="font-medium text-slate-800 text-[15px]">提示词调试实验室</div>
                  <div className="text-xs text-slate-500 mt-0.5">{currentDebugPrompt.name} <span className="ml-1 text-blue-500">{currentDebugPrompt.version}</span></div>
               </div>
            </div>
            <div className="flex items-center space-x-3">
               <select className="border border-slate-200 rounded px-3 py-1.5 text-sm bg-white focus:outline-none min-w-[140px]">
                 <option value="qwen3-30b-a3b">qwen3-30b-a3b</option>
                 <option value="qwen3-72b-a3b">qwen3-72b-a3b</option>
               </select>
               <button onClick={handleDebugConfirm} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition flex items-center">
                 <FileText size={14} className="mr-1.5" />
                 确认
               </button>
               <button onClick={() => setView('LIST')} className="text-slate-400 hover:text-slate-600 transition p-1">
                 <X size={20} />
               </button>
            </div>
         </div>
         <div className="flex flex-1 p-4 overflow-hidden space-x-4">
            {/* Left */}
            <div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
               <div className="px-4 py-3 border-b border-slate-100 font-medium text-slate-800 flex justify-between items-center text-[13px]">
                 系统提示词 <span className="text-slate-400 font-normal ml-2">(System Instruction)</span>
                 <button className="text-slate-400 hover:text-slate-600"><Copy size={14}/></button>
               </div>
               <div className="flex-1 p-4 bg-slate-50/50">
                  <textarea 
                    className="w-full h-full resize-none bg-transparent focus:outline-none text-[13px] text-slate-800 border rounded p-3 border-slate-200 bg-white"
                    value={debugSystemInstruction}
                    onChange={e => setDebugSystemInstruction(e.target.value)}
                  />
               </div>
               <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 text-[12px] flex items-center text-slate-600">
                  <span className="text-slate-400 mr-2">版本描述</span> {currentDebugPrompt.description || '无描述'}
               </div>
            </div>
            
            {/* Middle */}
            <div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
               <div className="px-4 py-3 bg-white border-b border-slate-100 font-medium text-slate-800 flex items-center text-[13px]">
                 <Monitor size={14} className="mr-2 text-slate-500" />
                 用户输入 <span className="text-slate-400 font-normal ml-2">(User Input)</span>
               </div>
               <div className="px-5 py-4 border-b border-slate-100 flex-none z-10 bg-white relative">
                 <div className="flex justify-between items-center mb-3">
                   <div className="flex items-center text-[13px] font-medium text-slate-700">
                     可用测试集 <Info size={14} className="ml-1 text-slate-400" />
                   </div>
                 </div>
                 
                 <div className="flex items-center space-x-2 relative">
                   <div className="flex-1 relative">
                     <div 
                        className="w-full border border-blue-400/60 rounded px-3 py-2 text-[13px] text-slate-700 cursor-pointer flex justify-between items-center bg-white shadow-[0_0_0_2px_rgba(59,130,246,0.1)] hover:border-blue-500 transition-colors"
                        onClick={() => setIsTestSetDropdownOpen(!isTestSetDropdownOpen)}
                     >
                        {selectedTestSetId ? testSets.find(t=>t.id === selectedTestSetId)?.name : '请选择测试集'}
                        <ChevronDown size={14} className="text-slate-400" />
                     </div>
                     
                     {isTestSetDropdownOpen && (
                       <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-xl overflow-hidden z-20">
                         <div className="min-h-[40px] max-h-60 overflow-y-auto py-1">
                            {testSets.map(ts => (
                              <div 
                                key={ts.id} 
                                className="px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 cursor-pointer group flex justify-between items-center"
                                onClick={() => handleSelectTestSet(ts.id)}
                              >
                                <div className="flex items-center flex-1 pr-2">
                                  <div className="w-5 flex-none">
                                    {selectedTestSetId === ts.id && <Check size={14} className="text-blue-600"/>}
                                  </div>
                                  <span className={`block truncate ${selectedTestSetId === ts.id ? 'font-medium' : ''}`}>{ts.name}</span>
                                </div>
                                <div className="hidden group-hover:flex flex-none items-center space-x-2 text-slate-400 pl-2">
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); setEditingTestSet(ts); setTestSetMode('EDIT'); setIsTestSetDropdownOpen(false); }} 
                                     className="hover:text-blue-600 p-0.5 rounded transition"
                                     title="编辑测试集"
                                   >
                                     <Edit2 size={13}/>
                                   </button>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); setTestSets(testSets.filter(t => t.id !== ts.id)); if (selectedTestSetId === ts.id) setSelectedTestSetId(''); }} 
                                     className="hover:text-red-500 p-0.5 rounded transition"
                                     title="删除测试集"
                                   >
                                     <Trash2 size={13}/>
                                   </button>
                                </div>
                              </div>
                            ))}
                            {testSets.length === 0 && <div className="px-4 py-3 text-center text-slate-400 text-[12px]">暂无测试集数据</div>}
                         </div>
                       </div>
                     )}
                   </div>
                   
                   <button 
                      onClick={() => { setEditingTestSet({name:'', variables:{}}); setTestSetMode('CREATE'); setIsTestSetDropdownOpen(false); }} 
                      className="w-[38px] h-[38px] flex flex-none items-center justify-center border border-slate-200 rounded hover:bg-slate-50 text-slate-500 transition-colors shadow-sm"
                      title="新建测试集"
                   >
                      <Plus size={16} />
                   </button>
                 </div>
               </div>
             
               <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-none z-0">
                  <div className="text-[13px] font-medium text-slate-700">运行输入</div>
                  <div className="flex items-center space-x-4">
                     <div className="flex items-center">
                        <span className="text-[12px] text-slate-500 mr-2">JSON模式</span>
                        <button 
                          className={`w-8 h-[18px] rounded-full relative transition-colors ${isJsonMode ? 'bg-blue-600' : 'bg-slate-200 hover:bg-slate-300'}`}
                          onClick={toggleJsonMode}
                        >
                           <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform ${isJsonMode ? 'left-[16px]' : 'left-[2px]'}`}></div>
                        </button>
                     </div>
                  </div>
               </div>
             
               <div className="flex-1 p-5 overflow-y-auto bg-white z-0 relative">
                  {isJsonMode ? (
                     <div className="h-full border border-slate-200 rounded-lg bg-slate-50 flex flex-col font-mono text-[13px] overflow-hidden shadow-inner">
                        <div className="flex-none h-8 bg-white border-b border-slate-200 flex justify-between items-center px-4 py-1 text-[11px] font-medium text-slate-400">
                           JSON
                           <div className="flex space-x-2">
                             <Copy size={13} className="cursor-pointer hover:text-slate-600 transition" />
                           </div>
                        </div>
                        <textarea 
                           className="flex-1 w-full p-4 bg-transparent focus:outline-none resize-none leading-relaxed text-slate-700"
                           value={debugInput}
                           onChange={e => setDebugInput(e.target.value)}
                           spellCheck={false}
                        />
                     </div>
                  ) : (
                     <div className="space-y-5 pb-6">
                        {currentScenarioVars.map(v => (
                           <div key={v.name} className="flex flex-col">
                              <div className="flex items-center mb-2">
                                 <span className="text-[13px] font-medium text-slate-800 font-mono">{v.name} ({v.value.replace(/[{}]/g, '')})</span>
                                 <span className="text-red-500 ml-1 opacity-80">*</span>
                              </div>
                              <textarea 
                                 className="w-full border border-slate-200 rounded-lg p-3 text-[13px] text-slate-700 focus:outline-none focus:border-blue-400 min-h-[70px] resize-y shadow-sm leading-relaxed bg-slate-50 focus:bg-white transition-colors"
                                 value={variableInputs[v.value.replace(/[{}]/g, '')] || ''}
                                 onChange={(e) => setVariableInputs({...variableInputs, [v.value.replace(/[{}]/g, '')]: e.target.value})}
                                 placeholder={`请输入 ${v.value.replace(/[{}]/g, '')}...`}
                              />
                           </div>
                        ))}
                        
                        {currentScenarioVars.length === 0 && (
                           <div className="text-[13px] text-slate-400 text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                              该业务场景暂无变量字段
                           </div>
                        )}
                     </div>
                  )}
               </div>
             
               <div className="p-4 border-t border-slate-100 bg-white flex-none z-0">
                  <label className="flex items-center text-[12px] text-slate-600 mb-3 cursor-pointer group w-max">
                    <input type="checkbox" checked={saveAsTestSet} onChange={e => setSaveAsTestSet(e.target.checked)} className="mr-2 w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition cursor-pointer" />
                    将本次运行输入保存为测试集
                  </label>
                  <button onClick={handleRunDebugCustom} disabled={isDebugging} className="w-full bg-[#8bafff] hover:bg-blue-500 text-white py-2.5 rounded text-sm font-medium transition disabled:bg-blue-300 flex justify-center items-center shadow-sm">
                     <PlayCircle size={16} className="mr-2"/>
                     {isDebugging ? '运行中...' : '开始运行 (Run)'}
                  </button>
               </div>
            </div>

            {/* Right */}
            <div className="flex-1 flex flex-col bg-slate-50 rounded-lg border border-slate-200 shadow-sm overflow-hidden relative">
               <div className="px-4 py-3 bg-white border-b border-slate-100 font-medium text-emerald-600 flex items-center text-[13px]">
                 <Monitor size={14} className="mr-2"/>
                 模型输出结果 <span className="text-slate-400 font-normal ml-2">(Output)</span>
               </div>
               <div className="flex-1 p-6 flex flex-col overflow-y-auto">
                 {debugOutput ? (
                   <div className="bg-white border border-emerald-100 shadow-sm rounded-lg p-4 text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                     {debugOutput}
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center flex-1 text-slate-400 text-center opacity-70">
                     <div className="w-16 h-16 mb-4 flex items-center justify-center">
                        <Monitor size={48} strokeWidth={1} />
                     </div>
                     <p className="font-medium text-slate-600 mb-1">准备就绪</p>
                     <p className="text-[12px]">提示词调试器已准备好。</p>
                     <p className="text-[12px]">在中间栏选择输入方式并点击“开始调试”按钮，模型生成的结果将显示在这里。</p>
                   </div>
                 )}
               </div>
            </div>
         </div>
         
         {/* Test Set Create/Edit Modal */}
         {testSetMode && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden flex flex-col border border-slate-200 animate-in zoom-in-95 duration-200">
               <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center text-[15px] font-bold text-slate-800 bg-slate-50/50">
                  {testSetMode === 'CREATE' ? '新建测试集' : '编辑测试集'}
                  <button onClick={() => setTestSetMode(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded transition"><X size={16}/></button>
               </div>
               <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">测试集名称 <span className="text-red-500 opacity-80">*</span></label>
                    <input 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] focus:border-blue-500 focus:outline-none transition shadow-sm text-slate-800" 
                      value={editingTestSet?.name || ''}
                      onChange={e => setEditingTestSet({...editingTestSet, name: e.target.value})}
                      placeholder="请输入测试集名称"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">描述</label>
                    <textarea 
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] focus:border-blue-500 focus:outline-none resize-none h-20 transition shadow-sm text-slate-700" 
                      value={editingTestSet?.description || ''}
                      onChange={e => setEditingTestSet({...editingTestSet, description: e.target.value})}
                      placeholder="请输入描述信息"
                    />
                  </div>
                  <div>
                     <label className="block text-[13px] font-medium text-slate-700 mb-2 mt-2">场景变量字段 ({currentScenarioVars.length})</label>
                     <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-3 max-h-48 overflow-y-auto custom-scrollbar shadow-inner">
                        {currentScenarioVars.map(v => (
                           <div key={v.name} className="flex flex-col">
                              <span className="text-[12px] font-medium text-slate-700 mb-1.5 font-mono">{v.name} ({v.value.replace(/[{}]/g, '')})</span>
                              <textarea 
                                className="w-full border border-slate-200 rounded flex-1 px-3 py-2 text-[12px] focus:border-blue-500 focus:outline-none text-slate-700 resize-none h-16 shadow-sm"
                                value={editingTestSet?.variables?.[v.value.replace(/[{}]/g, '')] || ''}
                                onChange={(e) => {
                                   setEditingTestSet({
                                      ...editingTestSet,
                                      variables: { ...(editingTestSet?.variables || {}), [v.value.replace(/[{}]/g, '')]: e.target.value }
                                   })
                                }}
                                placeholder={`请输入 ${v.value.replace(/[{}]/g, '')}`}
                              />
                           </div>
                        ))}
                        {currentScenarioVars.length === 0 && <div className="text-[12px] text-slate-400 text-center py-4">无变量字段配置</div>}
                     </div>
                  </div>
               </div>
               <div className="px-5 py-3 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50/80">
                  <button onClick={() => setTestSetMode(null)} className="px-5 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition shadow-sm">取消</button>
                  <button 
                     onClick={() => {
                        if (!editingTestSet?.name?.trim()) return;
                        if (testSetMode === 'CREATE') {
                           const newTs = { ...editingTestSet, id: `ts${Date.now()}` } as TestSet;
                           setTestSets([newTs, ...testSets]);
                           setSelectedTestSetId(newTs.id);
                           setVariableInputs(newTs.variables || {});
                        } else if (testSetMode === 'EDIT' && editingTestSet.id) {
                           setTestSets(testSets.map(t => t.id === editingTestSet.id ? (editingTestSet as TestSet) : t));
                           setVariableInputs(editingTestSet.variables || {});
                        }
                        setDebugInput(JSON.stringify({ "_input": editingTestSet?.variables || {} }, null, 2));
                        setTestSetMode(null);
                     }}
                     className="px-5 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
                     disabled={!editingTestSet?.name?.trim()}
                  >
                     确定
                  </button>
               </div>
            </div>
         </div>
         )}
      </div>
    );
  }

  return (
    <div className="p-6 h-full w-full">
      <div className="h-full flex flex-col relative w-full bg-slate-50 rounded-xl overflow-hidden shadow-sm border border-slate-200">
         <div className="bg-white border-b border-slate-200 px-6 py-5">
           <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-xl font-bold text-slate-800 flex items-center mb-1">提示词管理</h1>
                <p className="text-slate-500 text-[13px]">管理和调试您的 AI Agent 核心指令</p>
              </div>
            <div className="flex items-center space-x-3">
               <div className="relative">
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="pl-3 pr-10 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-blue-400 text-sm w-64 bg-slate-50"
                   placeholder="请输入提示词名称"
                 />
                 <button className="absolute right-0 top-0 bottom-0 px-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition">
                   查询
                 </button>
               </div>
               <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center">
                 <Plus size={16} className="mr-1.5" />
                 新建提示词
               </button>
            </div>
         </div>
         
         <div className="grid grid-cols-4 gap-5 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar pb-6">
            {filteredPrompts.map(prompt => (
              <div key={prompt.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition flex flex-col min-h-[220px]">
                 <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-slate-800 text-[15px] line-clamp-1 flex-1 pr-3" title={prompt.name}>{prompt.name}</h3>
                       <span className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 flex-shrink-0">已启用</span>
                    </div>
                 </div>
                 <div className="p-4 flex-1">
                    <p className="text-[12px] text-slate-500 line-clamp-4 leading-relaxed font-mono bg-slate-50 rounded p-2 border border-slate-100">
                      {prompt.content}
                    </p>
                 </div>
                 <div className="px-4 py-2 border-t border-slate-100 flex items-center text-[11px] justify-between text-slate-400 bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                       <span className="flex items-center"><Monitor size={10} className="mr-1"/> {prompt.model.split('-')[0]}...</span>
                       <span className="flex items-center"><Clock size={10} className="mr-1"/> {prompt.updateTime}</span>
                    </div>
                 </div>
                 <div className="px-4 py-3 border-t border-slate-100 bg-white flex justify-between items-center text-slate-400">
                    <div className="flex space-x-4">
                       <button onClick={() => handleEdit(prompt)} className="hover:text-blue-600 transition" title="编辑"><Edit2 size={15} /></button>
                       <button onClick={() => handleDebug(prompt)} className="hover:text-amber-500 transition" title="调试"><PlayCircle size={15} /></button>
                    </div>
                    <div className="flex space-x-4">
                       <button onClick={() => handleHistory(prompt)} className="hover:text-slate-600 transition" title="历史版本"><Clock size={15} /></button>
                       <button className="hover:text-slate-600 transition" title="复制提示词"><Copy size={15} /></button>
                       <button onClick={() => handleDelete(prompt.id)} className="hover:text-red-500 transition" title="删除"><Trash2 size={15} /></button>
                    </div>
                 </div>
              </div>
            ))}
         </div>
         {filteredPrompts.length === 0 && (
           <div className="text-center py-20 text-slate-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>暂无提示词数据</p>
           </div>
         )}
         <div className="mt-6 flex justify-end items-center text-[12px] text-slate-500">
            <span className="mr-4">共 30 条</span>
            <div className="flex items-center space-x-1 mr-4">
               <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-400">&lt;</button>
               <button className="w-6 h-6 flex items-center justify-center bg-blue-50 text-blue-600 rounded font-medium">1</button>
               <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded">2</button>
               <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded">3</button>
               <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded">4</button>
               <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-400">&gt;</button>
            </div>
            <div className="flex items-center">
               前往
               <input type="text" className="w-10 h-6 border border-slate-200 rounded mx-2 text-center focus:outline-none focus:border-blue-400" defaultValue="1" />
               页
            </div>
         </div>
       </div>

       {/* Drawer for Create/Edit */}
       <div className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsDrawerOpen(false)}></div>
       <div className={`fixed top-0 right-0 bottom-0 w-[600px] bg-slate-50 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-800">{drawerMode === 'CREATE' ? '新建提示词' : '编辑提示词'}</h2>
              <p className="text-[12px] text-slate-500">{drawerMode === 'CREATE' ? '创建一个新的 Agent 提示词配置' : `编辑: ${editingPrompt?.name}`}</p>
            </div>
            <div className="flex items-center space-x-3">
               {drawerMode === 'CREATE' ? (
                 <>
                   <button className="px-4 py-1.5 border border-blue-600 text-blue-600 bg-blue-50 rounded text-sm hover:bg-blue-100 transition">暂存 (草稿)</button>
                   <button onClick={handleSaveDrawer} className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm shadow-sm hover:bg-blue-700 transition">保存并发布</button>
                 </>
               ) : (
                 <>
                   <button onClick={() => { setIsDrawerOpen(false); handleDebug(editingPrompt as Prompt); }} className="px-4 py-1.5 border border-blue-600 text-blue-600 bg-blue-50 rounded text-sm hover:bg-blue-100 transition flex items-center"><PlayCircle size={14} className="mr-1.5"/>调试</button>
                   <button onClick={handleSaveDrawer} className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm shadow-sm hover:bg-blue-700 transition flex items-center"><FileText size={14} className="mr-1.5"/>保存</button>
                 </>
               )}
               <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 pl-2 border-l border-slate-200 ml-2"><X size={20}/></button>
            </div>
         </div>
         <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
               <label className="flex items-center text-sm font-medium text-slate-700 mb-3 ml-1"><Edit2 size={14} className="mr-2 text-blue-500" />提示词名称</label>
               <input 
                 className="w-full border-b border-slate-200 focus:border-blue-500 pb-2 bg-transparent text-[15px] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed text-slate-800"
                 placeholder="请输入提示词名称..."
                 value={editingPrompt?.name || ''}
                 onChange={e => setEditingPrompt({...editingPrompt, name: e.target.value})}
                 disabled={drawerMode === 'EDIT'}
               />
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
               <label className="flex items-center text-sm font-medium text-slate-700 mb-3 ml-1"><Monitor size={14} className="mr-2 text-blue-500" />运行模型</label>
               <select 
                 className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm bg-white focus:border-blue-500 focus:outline-none"
                 value={editingPrompt?.model || ''}
                 onChange={e => setEditingPrompt({...editingPrompt, model: e.target.value})}
               >
                 <option value="" disabled>请选择运行模型</option>
                 <option value="qwen3-30b-a3b">qwen3-30b-a3b</option>
                 <option value="qwen3-72b-a3b">qwen3-72b-a3b</option>
               </select>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm z-10">
               <label className="flex items-center text-sm font-medium text-slate-700 mb-3 ml-1"><Layers size={14} className="mr-2 text-blue-500" />业务场景</label>
               <select 
                 className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm bg-white focus:border-blue-500 focus:outline-none"
                 value={editingPrompt?.businessScenario || ''}
                 onChange={e => setEditingPrompt({...editingPrompt, businessScenario: e.target.value})}
               >
                 <option value="" disabled>请选择业务场景</option>
                 {MOCK_PROMPT_SCENARIOS.map(sc => <option key={sc} value={sc}>{sc}</option>)}
               </select>
            </div>
            
            {(editingPrompt?.businessScenario && MOCK_SCENARIO_VARIABLES[editingPrompt.businessScenario]) && (
               <div className="bg-white rounded-lg border border-slate-200 p-0 shadow-sm overflow-hidden">
                 <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 text-sm font-medium text-slate-700 flex items-center">
                    <CheckCircle2 size={14} className="mr-2 text-blue-500" />场景变量
                 </div>
                 <table className="w-full text-left text-sm text-slate-600">
                    <thead className="text-[12px] text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-2 font-medium">变量名称</th>
                        <th className="px-5 py-2 font-medium">变量类型</th>
                        <th className="px-5 py-2 font-medium">变量值</th>
                        <th className="px-5 py-2 font-medium">变量描述</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_SCENARIO_VARIABLES[editingPrompt.businessScenario].map((v, idx) => (
                        <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                           <td className="px-5 py-3">{v.name}</td>
                           <td className="px-5 py-3">
                             {v.type && <span className="inline-flex px-1.5 py-0.5 text-[11px] rounded border bg-slate-50 border-slate-200 text-slate-500">{v.type}</span>}
                           </td>
                           <td className="px-5 py-3">
                             <span className="font-mono text-[12px] bg-slate-100 rounded px-1.5 py-0.5">{v.value}</span>
                           </td>
                           <td className="px-5 py-3">{v.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            )}

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
               <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center text-sm font-medium text-slate-700">
                  <span className="flex items-center"><FileText size={14} className="mr-2 text-blue-500" />提示词内容</span>
                  <button className="text-slate-400 hover:text-slate-600"><Copy size={14}/></button>
               </div>
               <textarea 
                 className="w-full h-48 resize-none focus:outline-none p-5 text-[13px] text-slate-800 font-mono"
                 placeholder="请输入提示词内容..."
                 value={editingPrompt?.content || ''}
                 onChange={e => setEditingPrompt({...editingPrompt, content: e.target.value})}
               />
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
               <label className="flex items-center text-sm font-medium text-slate-700 mb-3 ml-1"><FileText size={14} className="mr-2 text-slate-400" />描述 (可选)</label>
               <textarea 
                 className="w-full h-20 resize-none border border-slate-200 rounded p-3 text-[13px] text-slate-800 focus:border-blue-500 focus:outline-none bg-slate-50/50"
                 placeholder="请输入描述信息..."
                 value={editingPrompt?.description || ''}
                 onChange={e => setEditingPrompt({...editingPrompt, description: e.target.value})}
               />
            </div>
         </div>
       </div>

       {/* History Modal */}
       {isHistoryVisible && historyPrompt && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-slate-50 rounded-xl shadow-2xl w-[900px] h-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">历史版本管理</h2>
                    <p className="text-[13px] text-slate-500 mt-0.5">{historyPrompt.name}</p>
                  </div>
                  <button onClick={() => setIsHistoryVisible(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded p-1 transition"><X size={18}/></button>
               </div>
               <div className="flex flex-1 overflow-hidden">
                  <div className="w-64 border-r border-slate-200 bg-white overflow-y-auto">
                     <div className="px-4 py-3 text-[12px] font-medium text-slate-500 bg-slate-50/80 border-b border-slate-100">版本列表 (9)</div>
                     {[
                       {v: 'V2.4', st: '已启用', cur: true, t: '2026/1/12 09:46:20'},
                       {v: 'V2.3', st: '已停用', t: '2026/6/1 14:51:04'},
                       {v: 'V2.2', st: '已停用', t: '2026/6/1 14:50:57'},
                       {v: 'V2.1', st: '已停用', t: '2026/4/14 15:34:57'},
                       {v: 'V2.0', st: '已停用', t: '2026/4/14 15:31:46'},
                       {v: 'V1.3', st: '已停用', t: '2026/1/15 16:59:13'},
                       {v: 'V1.2', st: '已停用', t: '2026/1/12 14:42:50'}
                     ].map(item => (
                       <div key={item.v} className={`px-5 py-4 border-b border-slate-100 cursor-pointer transition ${item.cur ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50'}`}>
                          <div className="flex justify-between items-center mb-1">
                             <div className={`font-bold ${item.cur ? 'text-blue-600' : 'text-slate-700'}`}>{item.v}</div>
                             <div className={`text-[11px] px-1.5 py-0.5 rounded border ${item.cur ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>{item.st}</div>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center"><Clock size={10} className="mr-1"/>{item.t}</div>
                       </div>
                     ))}
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                     <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                        <div className="flex">
                           <div className="flex-1">
                              <div className="text-[12px] text-slate-500 mb-1">版本号</div>
                              <div className="font-bold text-[16px] text-slate-800">V2.4</div>
                           </div>
                           <div className="flex-1">
                              <div className="text-[12px] text-slate-500 mb-1">模型 <span className="ml-2 px-2 py-0.5 border border-blue-200 bg-blue-50 text-blue-600 text-[10px] rounded-full inline-flex items-center"><CheckCircle2 size={10} className="mr-1"/>当前启用版本</span></div>
                              <div className="font-medium text-slate-800 flex items-center"><Monitor size={14} className="mr-1.5 text-blue-500"/>qwen3-30b-a3b</div>
                           </div>
                        </div>
                        <div className="flex mt-4 pt-4 border-t border-slate-100">
                           <div className="flex-1">
                              <div className="text-[12px] text-slate-500 mb-1">创建人</div>
                              <div className="text-slate-800 text-[14px] flex items-center">
                                <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center mr-1.5"><Search size={10} className="text-slate-500"/></div>
                                xiaohei
                              </div>
                           </div>
                           <div className="flex-1">
                              <div className="text-[12px] text-slate-500 mb-1">创建时间</div>
                              <div className="text-slate-800 text-[14px] flex items-center"><Clock size={14} className="mr-1.5 text-slate-400"/>2026-01-12 09:46:20</div>
                           </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                           <div className="text-[12px] text-slate-500 mb-2">版本描述</div>
                           <div className="bg-slate-50 border border-slate-200 rounded p-3 text-[13px] text-slate-700">根据湖南反馈意见调整的版本</div>
                        </div>
                     </div>
                     <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-64">
                        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center text-[13px] font-medium text-slate-700 bg-slate-50/50">
                           <span className="flex items-center"><FileText size={14} className="mr-1.5 text-blue-500"/>提示词内容</span>
                           <button className="text-slate-500 hover:text-slate-700 flex items-center text-[12px]"><Copy size={12} className="mr-1"/>复制内容</button>
                        </div>
                        <div className="flex-1 p-5 overflow-y-auto text-[13px] text-slate-700 font-mono whitespace-pre-wrap leading-relaxed relative">
                           <div className="absolute top-5 right-5 w-1 h-32 bg-slate-300/30 rounded"></div>
                           {`# 任务目标
将通话记录转化为符合行业规范的通话小结段落，要求为纯文本叙述。

# 通话记录

{{input}}

# 当前时间
{{timestamp}}

# 输出规则`}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
       )}
    </div>
    </div>
  );
};

export default PromptManager;
