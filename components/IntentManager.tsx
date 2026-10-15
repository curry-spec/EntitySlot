import React, { useState, useMemo, useEffect } from 'react';
import { Intent, FormMode, Entity } from '../types';
import { INTENT_CATEGORIES } from '../constants';
import { Plus, Download, Upload, ChevronLeft, ChevronRight, ChevronDown, Folder, X, Search, Sparkles } from 'lucide-react';
import Editor from 'react-simple-code-editor';

const highlightMarkdown = (code: string) => {
   return code.split('\n').map(line => {
      const escaped = line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if (escaped.trim() === '') return escaped; // preserve empty lines
      if (escaped.startsWith('# ')) return `<span style="color: #e11d48; font-weight: 700; font-size: 1.1em">${escaped}</span>`;
      if (escaped.startsWith('## ')) return `<span style="color: #d946ef; font-weight: 700; font-size: 1.05em">${escaped}</span>`;
      if (escaped.startsWith('### ')) return `<span style="color: #0ea5e9; font-weight: 600; font-size: 1.05em">${escaped}</span>`;
      if (escaped.startsWith('#### ')) return `<span style="color: #10b981; font-weight: 600">${escaped}</span>`;
      if (escaped.trim().startsWith('- ')) return `<span style="color: #f97316;">${escaped}</span>`;
      return escaped;
   }).join('\n');
};

interface IntentManagerProps {
  intents: Intent[];
  setIntents: React.Dispatch<React.SetStateAction<Intent[]>>;
  entities: Entity[];
  setEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
}

const IntentManager: React.FC<IntentManagerProps> = ({ intents, setIntents, entities, setEntities }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部意图');
  const [searchName, setSearchName] = useState('');
  const [searchCreator, setSearchCreator] = useState('');
  const [searchType, setSearchType] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [mode, setMode] = useState<FormMode>('LIST');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Intent>>({
    name: '',
    categoryId: '信用卡',
    description: '',
    intentType: '直接输出',
    keywords: [],
    cases: [],
    slots: [],
    thoughtProcess: '',
    status: 'ACTIVE'
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [caseInput, setCaseInput] = useState('');
  const [slotName, setSlotName] = useState('');
  const [slotDesc, setSlotDesc] = useState('');
  const [slotEntity, setSlotEntity] = useState('');

  const [caseCurrentPage, setCaseCurrentPage] = useState(1);
  const [generateCount, setGenerateCount] = useState<number>(5);

  const handleQuickCreateEntity = (entityId: string, name: string) => {
    const newEntity: Entity = {
      id: entityId,
      name: name,
      code: name.toLowerCase().replace(/\s+/g, '_'),
      categoryId: '业务实体',
      description: `自动生成的实体: ${name}`,
      entityType: '词库',
      values: [],
      synonyms: [],
      creator: '系统生成',
      status: 'ACTIVE',
      createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      thesaurusItems: [
        { id: Math.random().toString().slice(2, 10), content: '示例内容1', aliases: ['别名1'], updater: '系统', updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19) }
      ]
    };
    setEntities(prev => [...prev, newEntity]);
    alert(`已为您创建实体: ${name}`);
  };

  useEffect(() => {
    if (mode === 'CREATE' || mode === 'EDIT') {
      const currentText = formData.thoughtProcess || '';
      const slotsText = formData.slots && formData.slots.length > 0
        ? formData.slots.map((s, i) => `- [参数${i + 1}] ${s.name}`).join('\n')
        : '- 无';
      const nameText = formData.name || '待填写';

      if (!currentText) {
         // Auto template is left empty initially. User must generate it.
      } else {
        let newText = currentText;
        const nameRegex = /(### 意图名称\n)[\s\S]*?(?=\n### |$)/;
        if (nameRegex.test(newText)) {
           newText = newText.replace(nameRegex, `$1${nameText}\n`);
        }
        const slotRegex = /(### 槽位参数\n)[\s\S]*?(?=\n### |$)/;
        if (slotRegex.test(newText)) {
           newText = newText.replace(slotRegex, `$1${slotsText}\n`);
        }
        if (newText !== currentText) {
           setFormData(prev => ({ ...prev, thoughtProcess: newText }));
        }
      }
    }
  }, [formData.name, formData.slots, mode]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchName('');
    setSearchCreator('');
    setSearchType('');
    setStartTime('');
    setEndTime('');
    setSelectedCategory('全部意图');
    setCurrentPage(1);
  };

  const filteredIntents = useMemo(() => {
    return intents.filter(item => {
      const matchCat = selectedCategory === '全部意图' || item.categoryId === selectedCategory;
      const matchName = !searchName || item.name.toLowerCase().includes(searchName.toLowerCase());
      const matchCreator = !searchCreator || (item.creator && item.creator.includes(searchCreator));
      const matchType = !searchType || item.intentType === searchType;
      
      let matchTime = true;
      if (startTime || endTime) {
        const itemDate = item.createTime.split(' ')[0]; // Basic date check
        if (startTime && itemDate < startTime) matchTime = false;
        if (endTime && itemDate > endTime) matchTime = false;
      }
      return matchCat && matchName && matchCreator && matchType && matchTime;
    });
  }, [intents, selectedCategory, searchName, searchCreator, searchType, startTime, endTime]);

  const totalPages = Math.ceil(filteredIntents.length / pageSize);
  const paginatedIntents = filteredIntents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleToggleStatus = (id: string) => {
    setIntents(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : item
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除该意图吗？')) {
      setIntents(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedIntents.length && paginatedIntents.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedIntents.map(e => e.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      categoryId: '信用卡',
      description: '',
      intentType: '直接输出',
      keywords: [],
      cases: [],
      slots: [],
      thoughtProcess: '',
      status: 'ACTIVE'
    });
    setMode('CREATE');
  };

  const handleEdit = (intent: Intent) => {
    setEditingId(intent.id);
    setFormData({ ...intent });
    setMode('EDIT');
  };

  const handleSave = () => {
    if (!formData.name || !formData.categoryId || !formData.description || !formData.intentType || formData.cases?.length === 0) {
      alert('请填写所有必填项');
      return;
    }

    if (mode === 'CREATE') {
      const isDuplicate = intents.some(i => i.name === formData.name);
      if (isDuplicate) {
        alert('意图名称不可重复');
        return;
      }
      const newIntent: Intent = {
        ...(formData as Intent),
        id: Math.random().toString().slice(2, 15),
        createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        creator: '当前用户', // Mock user
      };
      setIntents([newIntent, ...intents]);
      setCaseCurrentPage(1);
    } else if (mode === 'EDIT' && editingId) {
      setIntents(intents.map(i => i.id === editingId ? { ...formData as Intent, id: editingId } : i));
      setCaseCurrentPage(1);
    }
    setMode('LIST');
  };

  const handleGenerate = () => {
    if (!formData.name || !formData.description || !formData.intentType) {
      alert('请先填写意图名称、描述和类型，以便模型生成更准确的内容。');
      return;
    }
    
    const name = formData.name || '';
    const desc = formData.description || '';
    
    let newCases: string[] = [];
    const templates = [
      `你好，我想咨询一下关于“${name}”的业务`,
      `请问办理${name}需要什么材料或满足什么条件吗？`,
      `按照你们说的“${desc.slice(0, 12)}...”，我该怎么去操作呢？`,
      `我对${name}的流程还有些疑问，能帮我解答吗？`,
      `手机APP上怎么弄${name}？`,
      `我想了解一下${name}的具体流程`,
      `最近我要办${name}，有什么要注意的吗？`,
      `帮我查查${name}进度好吗？`,
      `怎么老是办不好${name}，能帮我看看吗？`,
      `如果不办${name}有什么损失啊？`
    ];
    
    const totalToGenerate = Math.min(Math.max(1, generateCount), 50); // limit to max 50 for safety
    for (let i = 0; i < totalToGenerate; i++) {
       newCases.push(templates[i % templates.length] + (i >= templates.length ? ` (${i + 1})` : ''));
    }

    setFormData(prev => {
      const prevCases = prev.cases || [];
      return {
        ...prev,
        cases: Array.from(new Set([...newCases, ...prevCases]))
      };
    });
    setCaseCurrentPage(1);
  };

  const addSlot = () => {
    if (!slotName.trim() || !slotEntity) {
      alert('请输入槽位名称并选择实体');
      return;
    }
    const newSlot = {
      name: slotName.trim(),
      description: slotDesc.trim(),
      entityId: slotEntity
    };
    setFormData(prev => ({
      ...prev,
      slots: [...(prev.slots || []), newSlot]
    }));
    setSlotName('');
    setSlotDesc('');
    setSlotEntity('');
  };

  const removeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      slots: (prev.slots || []).filter((_, i) => i !== index)
    }));
  };

  const addArrayItem = (field: 'keywords' | 'cases', value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (!value.trim()) return;
    if (field === 'keywords' && value.length > 20) {
      alert('每个关键词限20字内');
      return;
    }
    setFormData(prev => ({
      ...prev,
      [field]: field === 'cases' ? [value.trim(), ...(prev[field] as string[] || [])] : [...(prev[field] as string[] || []), value.trim()]
    }));
    setter('');
  };

  const removeArrayItem = (field: 'keywords' | 'cases', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter((_, i) => i !== index)
    }));
  };

  const casePageSize = 5;
  const currentCases = formData.cases || [];
  const totalCasePages = Math.ceil(currentCases.length / casePageSize) || 1;
  const paginatedCases = currentCases.slice((caseCurrentPage - 1) * casePageSize, caseCurrentPage * casePageSize);

  const isGenerateEnabled = !!(formData.name && formData.description && formData.intentType);
  const isThoughtGenerateEnabled = !!(formData.name && formData.description && formData.intentType && formData.keywords?.length && formData.cases?.length);

  const handleGenerateThoughtProcess = () => {
    if (!isThoughtGenerateEnabled) return;
    
    const slotsText = formData.slots && formData.slots.length > 0
      ? formData.slots.map((s, i) => `- [参数${i + 1}] ${s.name}`).join('\n')
      : '- 无';
    const nameText = formData.name || '待填写';
    const keywordText = formData.keywords?.join('，') || '无';
    
    // Auto generate a structured markdown based on the inputs
    const generatedMD = `### 历史提问
- 客户之前是否咨询过相关类别？(此处由大模型自动概括)
- 是否有${keywordText}等高频词汇的咨询记录？

### 最新提问
- 客户当前正在询问关于“${nameText}”的问题。
- 提取到的口语化表述涉及：${formData.cases?.[0] || '无'}...

### 过程示例
- 步骤一: 确认客户意图属于分类[${formData.categoryId}]
- 步骤二: 根据最新提问提取关键特征信息
- 步骤三: 检查是否需要调用${formData.intentType}

### 处理方式
- [AI执行] 根据知识库与客户信息进行精准匹配，若匹配成功则返回对应的执行路径或结果。

### 意图名称
${nameText}

### 槽位参数
${slotsText}

### 标准回答
- 尊敬的客户，关于您的“${nameText}”请求，我们已经为您处理。`;

    setFormData(prev => ({ ...prev, thoughtProcess: generatedMD }));
  };

  return (
    <div className="flex h-full bg-transparent">
      {/* Sidebar Tree */}
      <div className="w-56 bg-white shadow-sm flex-shrink-0 flex flex-col h-full rounded mr-4">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-medium text-slate-800 text-sm">意图分类</h3>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <div className="space-y-1">
            {INTENT_CATEGORIES.map(category => {
              const isSelected = selectedCategory === category.name;
              const isAll = category.name === '全部意图';
              return (
                <div 
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer text-sm transition-colors ${isSelected ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center">
                    {isAll ? (
                      <div className="mr-2 grid grid-cols-2 gap-[1px]">
                         <div className="w-1.5 h-1.5 bg-current"></div>
                         <div className="w-1.5 h-1.5 bg-current"></div>
                         <div className="w-1.5 h-1.5 bg-current"></div>
                         <div className="w-1.5 h-1.5 bg-current"></div>
                      </div>
                    ) : (
                      <Folder size={14} className="mr-2 opacity-60" />
                    )}
                    <span className={isSelected ? 'font-medium' : ''}>{category.name}</span>
                  </div>
                  <span className={`text-xs ${isSelected ? 'text-blue-500' : 'text-slate-400'}`}>
                    {category.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white shadow-sm rounded">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800 mb-1">意图管理</h2>
          <p className="text-sm text-slate-500">关联实体，定义用户的核心需求，完成业务流程的入口配置</p>
        </div>

          {/* Search */}
          <div className="p-6 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center">
                <label className="text-sm font-medium text-slate-700 mr-3 shrink-0">意图名称</label>
                <input 
                  type="text" 
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="请输入意图名称" 
                  className="w-40 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <label className="text-sm font-medium text-slate-700 mr-3 shrink-0">创建人</label>
                <input 
                  type="text" 
                  value={searchCreator}
                  onChange={(e) => setSearchCreator(e.target.value)}
                  placeholder="创建人" 
                  className="w-32 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <label className="text-sm font-medium text-slate-700 mr-3 shrink-0">意图类型</label>
                <select 
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-32 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 bg-white"
                >
                  <option value="">全部</option>
                  <option value="直接输出">直接输出</option>
                  <option value="意图路由">意图路由</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="text-sm font-medium text-slate-700 mr-3 shrink-0">创建时间</label>
                <input 
                  type="date"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-36 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-500"
                />
                <span className="mx-2 text-slate-400">-</span>
                <input 
                  type="date"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-36 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-500"
                />
              </div>
              <div className="flex items-center mb-0 xl:mb-0 lg:mb-4 md:mb-4">
                <label className="text-sm font-medium text-slate-700 mr-3 shrink-0">意图分类</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-32 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 bg-white"
                >
                  {INTENT_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2 ml-auto shrink-0">
                <button onClick={handleSearch} className="px-5 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">查询</button>
                <button onClick={handleReset} className="px-5 py-1.5 bg-white border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50 transition-colors">重置</button>
              </div>
            </div>
          </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white flex justify-start items-center flex-shrink-0">
          <div className="flex space-x-3">
            <button onClick={handleCreate} className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center">
              <Plus size={14} className="mr-1" /> 新建意图
            </button>
            <button className="px-4 py-1.5 border border-blue-500 text-blue-600 rounded text-sm hover:bg-blue-50 transition-colors shadow-sm">
              <Download size={14} className="inline mr-1" /> 下载模版
            </button>
            <button className="px-4 py-1.5 border border-blue-500 text-blue-600 rounded text-sm hover:bg-blue-50 transition-colors shadow-sm">
              <Upload size={14} className="inline mr-1" /> 导出
            </button>
            <button className="px-4 py-1.5 border border-blue-500 text-blue-600 rounded text-sm hover:bg-blue-50 transition-colors shadow-sm">
              <Download size={14} className="inline mr-1" /> 导入意图
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto bg-white px-4 pb-4">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-100/50 text-slate-700 font-medium">
              <tr>
                <th className="px-4 py-3 w-12 text-center border border-white">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    checked={paginatedIntents.length > 0 && selectedIds.size === paginatedIntents.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left border border-white">意图名称</th>
                <th className="px-4 py-3 text-center border border-white">意图分类</th>
                <th className="px-4 py-3 text-center border border-white">意图类型</th>
                <th className="px-4 py-3 text-center border border-white">意图case数</th>
                <th className="px-4 py-3 text-center border border-white">槽位数</th>
                <th className="px-4 py-3 text-center border border-white">状态</th>
                <th className="px-4 py-3 text-center border border-white">创建人</th>
                <th className="px-4 py-3 text-center border border-white">创建时间</th>
                <th className="px-4 py-3 text-center border border-white w-32">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedIntents.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                  <td className="px-4 py-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600" 
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  <td className="px-4 py-4 text-left text-slate-800 font-medium">{item.name}</td>
                  <td className="px-4 py-4 text-center text-slate-600">{item.categoryId}</td>
                  <td className="px-4 py-4 text-center text-slate-600">{item.intentType}</td>

                  <td className="px-4 py-4 text-center text-slate-600">
                    <div className="group relative inline-flex justify-center items-center">
                      <span className="cursor-help text-blue-600 font-medium underline decoration-dashed decoration-blue-300 decoration-1 underline-offset-4">
                        {item.cases?.length || 0}
                      </span>
                      {item.cases && item.cases.length > 0 && (
                        <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-sm p-2.5 bg-slate-800 text-slate-100 text-xs rounded shadow-lg z-50 text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-pre-wrap leading-relaxed">
                          {item.cases.map((c, i) => <div key={i} className="mb-1.5 last:mb-0 break-words line-clamp-3">• {c}</div>)}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-slate-600">
                    <div className="group relative inline-flex justify-center items-center">
                      <span className="cursor-help text-blue-600 font-medium underline decoration-dashed decoration-blue-300 decoration-1 underline-offset-4">
                        {item.slots?.length || 0}
                      </span>
                      {item.slots && item.slots.length > 0 && (
                        <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2.5 bg-slate-800 text-slate-100 text-xs rounded shadow-lg z-50 text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-pre-wrap leading-relaxed">
                          {item.slots.map((s, i) => <div key={i} className="mb-0.5 last:mb-0 break-words">• {s.name}</div>)}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer justify-center">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={item.status === 'ACTIVE'}
                        onChange={() => handleToggleStatus(item.id)}
                      />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="px-4 py-4 text-center text-slate-600">{item.creator}</td>
                  <td className="px-4 py-4 text-center text-slate-600 font-mono text-xs">{item.createTime}</td>
                  <td className="px-4 py-4 text-center space-x-2 text-blue-600 whitespace-nowrap">
                    <button onClick={() => handleEdit(item)} className="hover:text-blue-800 transition-colors">编辑</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 transition-colors">删除</button>
                  </td>
                </tr>
              ))}
              {paginatedIntents.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-400">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center flex-shrink-0 space-x-4">
          <div className="text-sm text-slate-500">
            共 {filteredIntents.length} 条
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
             <select 
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none"
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
              className="p-1 px-2 border border-slate-300 rounded text-slate-600 disabled:opacity-50 hover:bg-slate-100 transition-colors bg-white text-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">{currentPage}</span>
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 px-2 border border-slate-300 rounded text-slate-600 disabled:opacity-50 hover:bg-slate-100 transition-colors bg-white text-sm"
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
               className="w-12 px-2 py-1 border border-slate-300 rounded text-center focus:outline-none"
             />
             <span>页</span>
          </div>
        </div>
      </div>

      {/* Modal Form Overlay */}
      {mode !== 'LIST' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[900px] max-h-[95vh] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="h-14 bg-white flex items-center px-6 justify-between border-b border-slate-100 shrink-0">
              <span className="text-lg font-bold text-slate-800">{mode === 'CREATE' ? '新建意图' : '编辑意图'}</span>
              <button onClick={() => setMode('LIST')} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* 基本信息 Card */}
                <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
                  <div className="flex items-center space-x-2 mb-8">
                     <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                     <h3 className="text-lg font-bold text-slate-800">基本信息</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                      <div className="flex items-center">
                        <label className="w-24 text-sm font-medium text-slate-700 shrink-0 text-right mr-4">
                          <span className="text-red-500 mr-1">*</span>意图名称
                        </label>
                        <input 
                          type="text"
                          value={formData.name || ''}
                          onChange={e => setFormData({...formData, name: e.target.value.slice(0, 20)})}
                          placeholder="最多20字, 不可重复, 如:信用卡补寄"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="w-24 text-sm font-medium text-slate-700 shrink-0 text-right mr-4">
                          <span className="text-red-500 mr-1">*</span>意图分类
                        </label>
                        <select
                          value={formData.categoryId || ''}
                          onChange={e => setFormData({...formData, categoryId: e.target.value})}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white text-slate-600"
                        >
                          <option value="">请选择</option>
                          {INTENT_CATEGORIES.filter(c => c.name !== '全部意图').map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-start">
                       <label className="w-24 text-sm font-medium text-slate-700 shrink-0 text-right mr-4 mt-2">
                          <span className="text-red-500 mr-1">*</span>意图描述
                       </label>
                       <textarea
                         value={formData.description || ''}
                         onChange={e => setFormData({...formData, description: e.target.value.slice(0, 500)})}
                         placeholder="最多500字, 用于描述这个意图, 如: 客户申请补寄信用卡相关物品或账单..."
                         rows={3}
                         className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm resize-none"
                       />
                    </div>

                    <div className="flex items-start">
                        <label className="w-24 text-sm font-medium text-slate-700 shrink-0 text-right mr-4 mt-1">
                          <span className="text-red-500 mr-1">*</span>意图类型
                        </label>
                        <div className="flex-1 space-y-3 pt-1">
                           <div className="flex space-x-10">
                             <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                                <input type="radio" className="w-4 h-4 mr-2 text-blue-600 focus:ring-blue-500 border-slate-300" checked={formData.intentType === '直接输出'} onChange={() => setFormData({...formData, intentType: '直接输出'})} />
                                直接输出 <span className="text-slate-400 ml-1">(通过混合算法识别该意图)</span>
                             </label>
                             <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                                <input type="radio" className="w-4 h-4 mr-2 text-blue-600 focus:ring-blue-500 border-slate-300" checked={formData.intentType === '意图路由'} onChange={() => setFormData({...formData, intentType: '意图路由'})} />
                                意图路由 <span className="text-slate-400 ml-1">(通过大模型辅助识别该意图)</span>
                             </label>
                           </div>
                           <div>
                             <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                                <input type="radio" className="w-4 h-4 mr-2 text-blue-600 focus:ring-blue-500 border-slate-300" checked={formData.intentType === '通用意图' as any} onChange={() => setFormData({...formData, intentType: '通用意图' as any})} />
                                通用意图
                             </label>
                           </div>
                        </div>
                    </div>
                  </div>
                </div>

                {/* 语料信息 Card */}
                <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
                  <div className="flex items-center space-x-2 mb-8">
                     <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                     <h3 className="text-lg font-bold text-slate-800">语料信息</h3>
                  </div>

                  <div className="space-y-8">
                    {/* 槽位设置 */}
                    <div className="flex items-start">
                       <label className="w-24 text-sm font-medium text-slate-700 shrink-0 text-right mr-4 mt-2">
                          槽位设置
                       </label>
                       <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={slotName}
                              onChange={e => setSlotName(e.target.value)}
                              placeholder="槽位名称"
                              className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            />
                            <input
                              type="text"
                              value={slotDesc}
                              onChange={e => setSlotDesc(e.target.value)}
                              placeholder="槽位描述"
                              className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            />
                            <select
                              value={slotEntity}
                              onChange={e => setSlotEntity(e.target.value)}
                              className="px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white text-slate-600"
                            >
                              <option value="">选择实体</option>
                              {entities.map(ent => (
                                <option key={ent.id} value={ent.id}>{ent.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex justify-end">
                            <button onClick={addSlot} className="px-6 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center">
                              <Plus size={14} className="mr-1" /> 添加
                            </button>
                          </div>

                          {formData.slots && formData.slots.length > 0 && (
                            <div className="border border-slate-200 rounded overflow-hidden shadow-sm">
                              <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                                  <tr>
                                    <th className="px-4 py-2 font-medium">槽位名称</th>
                                    <th className="px-4 py-2 font-medium border-l border-slate-200">槽位描述</th>
                                    <th className="px-4 py-2 font-medium border-l border-slate-200">关联实体</th>
                                    <th className="px-4 py-2 font-medium w-20 text-center border-l border-slate-200">操作</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {formData.slots.map((slot, idx) => (
                                    <tr key={idx} className="bg-white hover:bg-slate-50/50 transition-colors">
                                      <td className="px-4 py-2.5 text-slate-700">{slot.name}</td>
                                      <td className="px-4 py-2.5 text-slate-600 border-l border-slate-100">{slot.description}</td>
                                      <td className="px-4 py-2.5 text-slate-600 border-l border-slate-100">
                                        {entities.find(e => e.id === slot.entityId) ? (
                                          entities.find(e => e.id === slot.entityId)?.name
                                        ) : (
                                          <div className="flex items-center space-x-2">
                                            <span className="text-red-400">未知实体</span>
                                            <button 
                                              onClick={() => handleQuickCreateEntity(slot.entityId, slot.name)}
                                              className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs hover:bg-blue-100 transition-colors"
                                            >
                                              造数据
                                            </button>
                                          </div>
                                        )}
                                       </td>
                                      <td className="px-4 py-2.5 text-center border-l border-slate-100">
                                        <button onClick={() => removeSlot(idx)} className="text-red-500 hover:text-red-700 text-xs font-medium">
                                          删除
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="flex items-start">
                       <label className="w-24 text-sm font-medium text-slate-700 shrink-0 text-right mr-4 mt-2">
                          <span className="text-red-500 mr-1">*</span>泛化case
                       </label>
                       <div className="flex-1 space-y-6">
                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={caseInput}
                              onChange={e => setCaseInput(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && addArrayItem('cases', caseInput, setCaseInput)}
                              placeholder="如:我的信用卡寄丢了,能补寄一张吗?"
                              className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            />
                            <button onClick={() => addArrayItem('cases', caseInput, setCaseInput)} className="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">添加</button>
                            <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden">
                               <input 
                                  type="number"
                                  min={1}
                                  max={50}
                                  value={generateCount}
                                  onChange={(e) => setGenerateCount(Number(e.target.value))}
                                  className="w-12 px-2 py-2 text-sm text-center focus:outline-none"
                               />
                               <div className="flex flex-col border-l border-slate-200">
                                  <button onClick={() => setGenerateCount(Math.min(50, generateCount + 1))} className="px-1 text-slate-400 hover:text-blue-500 border-b border-slate-100 leading-[1]"><ChevronDown size={12} className="rotate-180" /></button>
                                  <button onClick={() => setGenerateCount(Math.max(1, generateCount - 1))} className="px-1 text-slate-400 hover:text-blue-500 leading-[1]"><ChevronDown size={12} /></button>
                               </div>
                            </div>
                            <button 
                               onClick={handleGenerate} 
                               disabled={!isGenerateEnabled}
                               className={`flex items-center px-4 py-2 rounded text-sm font-medium transition-colors ${isGenerateEnabled ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                            >
                               <Sparkles size={14} className="mr-2" />
                               模型生成
                            </button>
                          </div>

                          <div className="border border-slate-200 rounded overflow-hidden">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                                <tr>
                                  <th className="px-4 py-3 font-medium w-20 text-center">序号</th>
                                  <th className="px-4 py-3 font-medium border-l border-slate-200">泛化CASE</th>
                                  <th className="px-4 py-3 font-medium w-24 text-center border-l border-slate-200">操作</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {paginatedCases.length > 0 ? (
                                  paginatedCases.map((c, idx) => {
                                    const globalIndex = (caseCurrentPage - 1) * casePageSize + idx;
                                    return (
                                      <tr key={globalIndex} className="hover:bg-slate-50 transition-colors bg-white">
                                        <td className="px-4 py-3 text-center text-slate-500">{globalIndex + 1}</td>
                                        <td className="px-4 py-3 text-slate-700 border-l border-slate-100">{c}</td>
                                        <td className="px-4 py-3 text-center border-l border-slate-100">
                                          <button onClick={() => removeArrayItem('cases', globalIndex)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                                            删除
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr>
                                     <td colSpan={3} className="px-4 py-12 text-center text-slate-400 bg-white">暂无数据</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="flex justify-end items-center space-x-1.5">
                             <button 
                               onClick={() => setCaseCurrentPage(Math.max(1, caseCurrentPage - 1))}
                               disabled={caseCurrentPage === 1}
                               className="p-1.5 border border-slate-200 rounded text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-colors bg-slate-50"
                             >
                               <ChevronLeft size={16} />
                             </button>
                             <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded text-sm font-medium">{caseCurrentPage}</span>
                             <button 
                               onClick={() => setCaseCurrentPage(Math.min(totalCasePages, caseCurrentPage + 1))}
                               disabled={caseCurrentPage >= totalCasePages}
                               className="p-1.5 border border-slate-200 rounded text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-colors bg-slate-50"
                             >
                               <ChevronRight size={16} />
                             </button>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center">
                      <label className="w-24 text-sm font-medium text-slate-700 shrink-0 text-right mr-4">状态</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.status === 'ACTIVE'}
                          onChange={() => setFormData({...formData, status: formData.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'})}
                        />
                        <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm text-slate-600">{formData.status === 'ACTIVE' ? '已启用' : '已停用'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 px-8 border-t border-slate-100 bg-white flex justify-end space-x-3 shrink-0">
               <button onClick={handleSave} className="px-8 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors font-medium">确认</button>
               <button onClick={() => setMode('LIST')} className="px-8 py-2 border border-blue-600 text-blue-600 rounded-md text-sm hover:bg-blue-50 transition-colors font-medium bg-blue-50/50">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntentManager;
