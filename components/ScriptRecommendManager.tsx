import React, { useState, useMemo } from 'react';
import { ScriptRecommend, Emotion } from '../types';
import { RECOMMEND_CATEGORIES } from '../constants';
import { Search, Plus, Trash2, Edit, X, MoreVertical, FileText, ChevronLeft, ChevronRight, Download, Upload } from 'lucide-react';

const MOCK_INTENTS = ['信用卡挂失', '账单查询', '额度调整', '服务投诉', '人工服务', '操作指导', '活动咨询'];

interface ScriptRecommendManagerProps {
  scripts: ScriptRecommend[];
  setScripts: React.Dispatch<React.SetStateAction<ScriptRecommend[]>>;
  emotions: Emotion[];
}

const ScriptRecommendManager: React.FC<ScriptRecommendManagerProps> = ({
  scripts,
  setScripts,
  emotions
}) => {
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [searchIntent, setSearchIntent] = useState('');
  
  const [categories, setCategories] = useState<string[]>(RECOMMEND_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');

  const [formData, setFormData] = useState<Partial<ScriptRecommend>>({
    name: '',
    categoryId: '',
    content: '',
    linkName: '',
    linkUrl: '',
    intentIds: [],
    emotionScripts: []
  });

  const [intentSearch, setIntentSearch] = useState('');
  const [showIntentDropdown, setShowIntentDropdown] = useState(false);

  const filteredIntents = MOCK_INTENTS.filter(i => i.toLowerCase().includes(intentSearch.toLowerCase()) && !formData.intentIds?.includes(i));

  const handleAddEmotionScript = () => {
    setFormData(prev => ({
      ...prev,
      emotionScripts: [...(prev.emotionScripts || []), { emotionId: '', script: '' }]
    }));
  };

  const handleEmotionScriptChange = (index: number, field: 'emotionId' | 'script', value: string) => {
    setFormData(prev => {
      const newEmotionScripts = [...(prev.emotionScripts || [])];
      newEmotionScripts[index] = { ...newEmotionScripts[index], [field]: value };
      return { ...prev, emotionScripts: newEmotionScripts };
    });
  };

  const handleRemoveEmotionScript = (index: number) => {
    setFormData(prev => {
      const newEmotionScripts = [...(prev.emotionScripts || [])];
      newEmotionScripts.splice(index, 1);
      return { ...prev, emotionScripts: newEmotionScripts };
    });
  };

  const filteredScripts = useMemo(() => {
    return scripts.filter(s => {
      const matchName = s.name.toLowerCase().includes(searchName.toLowerCase());
      const matchStatus = searchStatus === 'ALL' || s.status === searchStatus;
      const matchCategory = !selectedCategory || s.categoryId === selectedCategory;
      const matchIntent = !searchIntent || (s.intentIds && s.intentIds.some(i => i.toLowerCase().includes(searchIntent.toLowerCase())));
      return matchName && matchStatus && matchCategory && matchIntent;
    });
  }, [scripts, searchName, searchStatus, selectedCategory, searchIntent]);

  const totalPages = Math.ceil(filteredScripts.length / pageSize);
  const paginatedScripts = filteredScripts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = () => setCurrentPage(1);

  const handleReset = () => {
    setSearchName('');
    setSearchStatus('ALL');
    setSelectedCategory(null);
    setSearchIntent('');
    setCurrentPage(1);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      categoryId: selectedCategory || '',
      content: '',
      intentIds: [],
      emotionScripts: []
    });
    setModalMode('CREATE');
    setShowModal(true);
  };

  const handleEdit = (script: ScriptRecommend) => {
    setFormData({ ...script });
    setModalMode('EDIT');
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该推荐话术吗？')) {
      setScripts(scripts.filter(s => s.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setScripts(scripts.map(s => 
      s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : s
    ));
  };

  const handleSave = () => {
    if (!formData.name || !formData.categoryId || !formData.content) {
      alert('请填写所有必填项（话术名称、分类、内容）');
      return;
    }

    if (modalMode === 'CREATE') {
      const newId = `HS_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const newScript: ScriptRecommend = {
        ...formData as ScriptRecommend,
        id: `rec_${Date.now()}`,
        displayId: newId,
        creator: '系统管理员', // Mock creator
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'ACTIVE'
      };
      setScripts([newScript, ...scripts]);
    } else {
      setScripts(scripts.map(s => 
        s.id === formData.id ? { 
          ...s, 
          ...formData as ScriptRecommend, 
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19) 
        } : s
      ));
    }
    setShowModal(false);
  };

  const renderTree = () => {
    return (
      <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col h-full">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-medium text-slate-800">话术分类</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <div 
            className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm mb-1 ${selectedCategory === null ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <div className="flex items-center" onClick={() => setSelectedCategory(null)}>
              <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center mr-2 opacity-50">
                <div className="w-2.5 h-0.5 bg-current rounded-full"></div>
              </div>
              <span className="flex-1">全部分类</span>
            </div>
            <button className="text-green-500 hover:text-green-600 flex items-center text-xs" title="添加分类">
              <Plus size={12} className="mr-0.5" /> 添加
            </button>
          </div>
          <div className="pl-6 space-y-1">
            {categories.map(cat => (
              <div 
                key={cat}
                className={`flex items-center px-3 py-1.5 rounded-md cursor-pointer text-sm group ${selectedCategory === cat ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <div className="flex-1 truncate" onClick={() => setSelectedCategory(cat)}>
                  {cat}
                </div>
                <div className="hidden group-hover:flex items-center">
                  <MoreVertical size={14} className="text-slate-400 hover:text-slate-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-slate-50/50">
      {renderTree()}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Search Area */}
        <div className="p-6 border-b border-slate-100 bg-white flex-shrink-0">
          <div className="flex justify-between items-center bg-slate-50/50 p-2 border border-slate-100 rounded-md">
            <div>
              <span className="text-slate-800 font-bold px-4">{selectedCategory || '全部分类'}</span>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center">
                <label className="text-sm font-medium text-slate-700 mr-2 whitespace-nowrap">话术名称</label>
                <input 
                  type="text" 
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="话术名称" 
                  className="w-40 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <label className="text-sm font-medium text-slate-700 mr-2 whitespace-nowrap">关联意图</label>
                <input 
                  type="text" 
                  value={searchIntent}
                  onChange={(e) => setSearchIntent(e.target.value)}
                  placeholder="关联意图" 
                  className="w-40 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <label className="text-sm font-medium text-slate-700 mr-2 whitespace-nowrap">状态</label>
                <select 
                  value={searchStatus}
                  onChange={(e) => setSearchStatus(e.target.value as any)}
                  className="w-32 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-500"
                >
                  <option value="ALL">状态</option>
                  <option value="ACTIVE">启用</option>
                  <option value="INACTIVE">停用</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button onClick={handleSearch} className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">查询</button>
                <button onClick={handleReset} className="px-4 py-1.5 bg-white border border-slate-300 text-slate-600 rounded text-sm hover:bg-slate-50 transition-colors">重置</button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white flex justify-start items-center flex-shrink-0 border-b border-slate-100">
          <div className="flex space-x-2">
            <button onClick={handleCreate} className="px-4 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors shadow-sm flex items-center">
              <Plus size={14} className="mr-1" /> 新建话术
            </button>
            <button onClick={() => setShowImportModal(true)} className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-50 transition-colors shadow-sm flex items-center">
              <Download size={14} className="mr-1" /> 导入话术
            </button>
            <button className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-50 transition-colors shadow-sm flex items-center">
              <Upload size={14} className="mr-1" /> 导出话术
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-4 pb-4 bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100/50 text-slate-700 text-sm border-b border-blue-100">
                <th className="py-3 px-4 font-medium text-center">话术名称</th>
                <th className="py-3 px-4 font-medium text-center">关联意图</th>
                <th className="py-3 px-4 font-medium text-center">话术分类</th>
                <th className="py-3 px-4 font-medium text-center">创建者</th>
                <th className="py-3 px-4 font-medium text-center">修改时间</th>
                <th className="py-3 px-4 font-medium text-center w-24">状态</th>
                <th className="py-3 px-4 font-medium text-center w-48">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedScripts.length > 0 ? (
                paginatedScripts.map((script) => (
                  <tr key={script.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="py-3 px-4 text-center text-slate-800">{script.name}</td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {script.intentIds && script.intentIds.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-1">
                          {script.intentIds.map((intent, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs border border-blue-100">{intent}</span>
                          ))}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">{script.categoryId}</td>
                    <td className="py-3 px-4 text-center text-slate-600">{script.creator}</td>
                    <td className="py-3 px-4 text-center text-slate-600 font-mono text-xs">{script.updateTime}</td>
                    <td className="py-3 px-4 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={script.status === 'ACTIVE'}
                          onChange={() => handleToggleStatus(script.id)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-3 text-blue-600">
                        <button className="hover:underline">查看</button>
                        <button onClick={() => handleEdit(script)} className="hover:underline">修改</button>
                        <button onClick={() => handleDelete(script.id)} className="hover:underline">删除</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white flex justify-end items-center flex-shrink-0 space-x-4">
          <div className="text-sm text-slate-500">
            共 {filteredScripts.length} 条
          </div>
          <div className="flex items-center space-x-2">
            <select 
              value={pageSize} 
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none bg-white text-slate-600"
            >
              <option value={5}>5条/页</option>
              <option value={10}>10条/页</option>
              <option value={20}>20条/页</option>
            </select>
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 px-2 rounded border border-slate-300 text-slate-600 disabled:opacity-50 hover:bg-slate-50 text-sm"
            >
               <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">{currentPage}</span>
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 px-2 rounded border border-slate-300 text-slate-600 disabled:opacity-50 hover:bg-slate-50 text-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span>前往</span>
            <input 
              type="number" 
              min={1} 
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Number(e.target.value);
                if (page >= 1 && page <= totalPages) setCurrentPage(page);
              }}
              className="w-12 border border-slate-300 rounded px-2 py-1 text-center focus:outline-none"
            />
            <span>页</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[800px] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="text-lg font-medium text-slate-800">
                {modalMode === 'CREATE' ? '新建话术推荐' : '编辑话术推荐'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50 space-y-6">
              
              <div className="bg-white shadow-sm p-4 border border-slate-100 relative">
                <div className="absolute left-0 top-4 bottom-4 w-1 bg-blue-600"></div>
                <h4 className="text-blue-600 font-bold mb-4 font-mono pl-3 text-sm">话术详情</h4>
                
                <div className="space-y-4 pl-3 pr-2">
                  <div className="flex items-center">
                    <label className="w-24 text-sm font-medium text-slate-700 text-right pr-4 shrink-0">
                      <span className="text-red-500 mr-1">*</span>话术名称
                    </label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="flex-1 px-3 py-2 border border-blue-400 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="w-24 text-sm font-medium text-slate-700 text-right pr-4 shrink-0">
                      <span className="text-red-500 mr-1">*</span>话术分类
                    </label>
                    <div className="flex-1 flex space-x-2">
                      <select 
                        value={formData.categoryId || ''}
                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        <option value="" disabled>请选择</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors">
                        添加分类
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <label className="w-24 text-sm font-medium text-slate-700 text-right pr-4 pt-2 shrink-0">
                      关联意图
                    </label>
                    <div className="flex-1 relative">
                      <div 
                        className="min-h-[38px] p-1 border border-slate-300 rounded text-sm bg-white flex flex-wrap gap-1.5 cursor-text focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
                        onClick={() => setShowIntentDropdown(true)}
                      >
                        {formData.intentIds?.map(intent => (
                          <span key={intent} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center">
                            {intent}
                            <X size={14} className="ml-1 cursor-pointer hover:text-blue-900" onClick={(e) => {
                              e.stopPropagation();
                              setFormData({...formData, intentIds: formData.intentIds?.filter(i => i !== intent)});
                            }}/>
                          </span>
                        ))}
                        <input 
                          type="text"
                          className="flex-1 min-w-[120px] outline-none px-1 py-0.5 bg-transparent"
                          placeholder={formData.intentIds?.length ? '' : '搜索并选择意图...'}
                          value={intentSearch}
                          onChange={e => {
                            setIntentSearch(e.target.value);
                            setShowIntentDropdown(true);
                          }}
                          onFocus={() => setShowIntentDropdown(true)}
                          onBlur={() => setTimeout(() => setShowIntentDropdown(false), 200)}
                        />
                      </div>
                      {showIntentDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded shadow-lg z-10 custom-scrollbar">
                          {filteredIntents.length > 0 ? filteredIntents.map(intent => (
                            <div 
                              key={intent} 
                              className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                              onClick={() => {
                                setFormData({...formData, intentIds: [...(formData.intentIds || []), intent]});
                                setIntentSearch('');
                                setShowIntentDropdown(false);
                              }}
                            >
                              {intent}
                            </div>
                          )) : <div className="px-3 py-2 text-sm text-slate-500 text-center">无匹配意图</div>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <label className="w-24 text-sm font-medium text-slate-700 text-right pr-4 pt-2 shrink-0">
                      <span className="text-red-500 mr-1">*</span>话术内容
                    </label>
                    <textarea 
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows={4}
                      placeholder="请输入话术内容"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm p-4 border border-slate-100 relative mt-4">
                <div className="absolute left-0 top-4 bottom-4 w-1 bg-blue-600"></div>
                <div className="flex justify-between items-center mb-4 pl-3">
                  <h4 className="text-blue-600 font-bold font-mono text-sm">关联情绪话术</h4>
                  <button 
                    onClick={handleAddEmotionScript}
                    className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors flex items-center font-medium"
                  >
                    <Plus size={14} className="mr-1" /> 添加情绪话术
                  </button>
                </div>
                
                <div className="space-y-3 pl-3 pr-2">
                  {(!formData.emotionScripts || formData.emotionScripts.length === 0) && (
                    <div className="text-center py-8 text-slate-400 text-sm border border-dashed border-slate-200 rounded bg-slate-50/50">
                      暂未添加关联情绪话术
                    </div>
                  )}
                  {formData.emotionScripts?.map((es, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-slate-50 p-4 rounded border border-slate-100 shadow-sm relative">
                      <div className="w-48 shrink-0">
                        <select
                          value={es.emotionId}
                          onChange={e => handleEmotionScriptChange(index, 'emotionId', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        >
                          <option value="">请选择情绪</option>
                          {emotions.map(emo => {
                            const isSelectedElsewhere = formData.emotionScripts?.some((other, otherIdx) => other.emotionId === emo.id && otherIdx !== index);
                            return <option key={emo.id} value={emo.id} disabled={isSelectedElsewhere}>{emo.name}</option>
                          })}
                        </select>
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={es.script}
                          onChange={e => handleEmotionScriptChange(index, 'script', e.target.value)}
                          rows={2}
                          placeholder="请输入该情绪下对应的话术内容"
                          className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        />
                      </div>
                      <button 
                        onClick={() => handleRemoveEmotionScript(index)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded shrink-0 transition-colors"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-center space-x-6 bg-white">
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors w-24"
              >
                确认
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-50 transition-colors w-24"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[500px] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="text-lg font-medium text-slate-800">
                导入话术
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar bg-white space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer text-slate-600">
                <Upload size={36} className="text-blue-500 mb-4" />
                <span className="text-sm font-medium mb-1 text-slate-700">点击或将文件拖拽到这里上传</span>
                <span className="text-xs text-slate-400 mt-2">支持扩展名：.xlsx</span>
                <span className="text-xs text-slate-400">文件大小：≤ 10MB</span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-700 font-medium">还没有模版？</span>
                  <span className="text-xs text-slate-400">请下载并按照模版格式填写信息</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center px-4 py-2 bg-white border border-blue-200 rounded shadow-sm hover:shadow transition-all">
                  <Download size={14} className="mr-1.5" /> 下载模版
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-center space-x-6 bg-white">
              <button 
                onClick={() => setShowImportModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors w-24 shadow-sm"
              >
                确认导入
              </button>
              <button 
                onClick={() => setShowImportModal(false)} 
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-50 transition-colors w-24"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptRecommendManager;
