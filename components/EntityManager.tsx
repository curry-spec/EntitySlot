import React, { useState, useMemo } from 'react';
import { Entity, FormMode, ThesaurusItem } from '../types';
import { Plus, ChevronLeft, ChevronRight, X, Search, ArrowLeft } from 'lucide-react';

interface EntityManagerProps {
  entities: Entity[];
  setEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
  onSubViewChange?: (view: string | null) => void;
}

const EntityManager: React.FC<EntityManagerProps> = ({ entities, setEntities, onSubViewChange }) => {
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [mode, setMode] = useState<FormMode>('LIST');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Entity>>({
    name: '',
    code: '',
    categoryId: '业务实体',
    description: '',
    entityType: '词库',
    values: [],
    synonyms: [],
    status: 'ACTIVE'
  });

  // Thesaurus Detail View State
  const [viewingThesaurusEntity, setViewingThesaurusEntity] = useState<Entity | null>(null);
  const [thesaurusSearchText, setThesaurusSearchText] = useState('');
  const [thesaurusMode, setThesaurusMode] = useState<FormMode>('LIST');
  const [editingThesaurusId, setEditingThesaurusId] = useState<string | null>(null);
  const [thesaurusFormData, setThesaurusFormData] = useState({ content: '', aliases: '' });
  const [thesaurusCurrentPage, setThesaurusCurrentPage] = useState(1);
  const [thesaurusPageSize, setThesaurusPageSize] = useState(10);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchName('');
    setSearchType('');
    setCurrentPage(1);
  };

  const filteredEntities = useMemo(() => {
    return entities.filter(item => {
      const matchName = !searchName || item.name.toLowerCase().includes(searchName.toLowerCase());
      const matchType = !searchType || item.entityType === searchType;
      return matchName && matchType;
    });
  }, [entities, searchName, searchType]);

  const totalPages = Math.ceil(filteredEntities.length / pageSize);
  const paginatedEntities = filteredEntities.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = (id: string) => {
    if (confirm('确定删除该实体吗？')) {
      setEntities(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedEntities.length && paginatedEntities.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedEntities.map(e => e.id)));
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
      code: '',
      categoryId: '业务实体',
      description: '',
      entityType: '词库',
      values: [],
      synonyms: [],
      status: 'ACTIVE'
    });
    setMode('CREATE');
  };

  const handleEdit = (entity: Entity) => {
    setEditingId(entity.id);
    setFormData({ ...entity });
    setMode('EDIT');
  };

  const handleSave = () => {
    if (!formData.name || !formData.code) {
      alert('请填写所有必填项');
      return;
    }

    if (mode === 'CREATE') {
      const newEntity: Entity = {
        ...(formData as Entity),
        id: Math.random().toString().slice(2, 15),
        createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        creator: '当前用户',
        thesaurusItems: []
      };
      setEntities([newEntity, ...entities]);
    } else if (mode === 'EDIT' && editingId) {
      setEntities(entities.map(e => e.id === editingId ? { ...formData as Entity, id: editingId } : e));
    }
    setMode('LIST');
  };

  // Thesaurus Logic
  const handleOpenThesaurus = (entity: Entity) => {
    setViewingThesaurusEntity(entity);
    setThesaurusSearchText('');
    setThesaurusCurrentPage(1);
    setThesaurusMode('LIST');
    onSubViewChange?.('THESAURUS');
  };

  const handleCloseThesaurus = () => {
    setViewingThesaurusEntity(null);
    onSubViewChange?.(null);
  };

  const filteredThesaurusItems = useMemo(() => {
    if (!viewingThesaurusEntity) return [];
    const items = viewingThesaurusEntity.thesaurusItems || [];
    return items.filter(item => 
      !thesaurusSearchText || item.content.toLowerCase().includes(thesaurusSearchText.toLowerCase())
    );
  }, [viewingThesaurusEntity, thesaurusSearchText]);

  const totalThesaurusPages = Math.ceil(filteredThesaurusItems.length / thesaurusPageSize) || 1;
  const paginatedThesaurusItems = filteredThesaurusItems.slice(
    (thesaurusCurrentPage - 1) * thesaurusPageSize, 
    thesaurusCurrentPage * thesaurusPageSize
  );

  const handleSaveThesaurusItem = () => {
    if (!thesaurusFormData.content.trim()) {
      alert('请输入词库内容');
      return;
    }

    if (!viewingThesaurusEntity) return;

    let updatedItems = [...(viewingThesaurusEntity.thesaurusItems || [])];
    const newAliases = thesaurusFormData.aliases ? thesaurusFormData.aliases.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    if (thesaurusMode === 'CREATE') {
      const newItem: ThesaurusItem = {
        id: Math.random().toString().slice(2, 15),
        content: thesaurusFormData.content,
        aliases: newAliases,
        updater: 'xiaohei', // Mock user
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      updatedItems = [newItem, ...updatedItems];
    } else if (thesaurusMode === 'EDIT' && editingThesaurusId) {
      updatedItems = updatedItems.map(item => 
        item.id === editingThesaurusId 
          ? { 
              ...item, 
              content: thesaurusFormData.content, 
              aliases: newAliases,
              updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19) 
            } 
          : item
      );
    }

    const updatedEntity = { ...viewingThesaurusEntity, thesaurusItems: updatedItems };
    setEntities(entities.map(e => e.id === viewingThesaurusEntity.id ? updatedEntity : e));
    setViewingThesaurusEntity(updatedEntity);
    setThesaurusMode('LIST');
  };

  const handleDeleteThesaurusItem = (id: string) => {
    if (!viewingThesaurusEntity || !confirm('确定删除该词库内容吗？')) return;

    const updatedItems = (viewingThesaurusEntity.thesaurusItems || []).filter(item => item.id !== id);
    const updatedEntity = { ...viewingThesaurusEntity, thesaurusItems: updatedItems };
    
    setEntities(entities.map(e => e.id === viewingThesaurusEntity.id ? updatedEntity : e));
    setViewingThesaurusEntity(updatedEntity);
  };

  if (viewingThesaurusEntity) {
    return (
      <div className="flex flex-col h-full bg-white rounded shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-4">
             <h2 className="text-lg font-bold text-slate-800">词库</h2>
          </div>
          <button 
            onClick={handleCloseThesaurus}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col space-y-4">
           <div className="flex items-center justify-end space-x-4">
              <div className="flex items-center">
                 <label className="text-sm font-medium text-slate-700 mr-2">词库内容</label>
                 <input 
                   type="text"
                   value={thesaurusSearchText}
                   onChange={e => setThesaurusSearchText(e.target.value)}
                   placeholder="请输入词库内容"
                   className="w-64 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                 />
              </div>
              <button onClick={() => setThesaurusCurrentPage(1)} className="px-5 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">查询</button>
              <button onClick={() => setThesaurusSearchText('')} className="px-5 py-1.5 bg-white border border-slate-300 text-slate-600 rounded text-sm hover:bg-slate-50 transition-colors">重置</button>
           </div>
           <div>
              <button 
                onClick={() => { setThesaurusFormData({ content: '', aliases: '' }); setThesaurusMode('CREATE'); }}
                className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus size={14} className="mr-1" /> 新增
              </button>
           </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 pt-4 pb-6">
           <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-blue-100/50 text-slate-700 font-medium">
                 <tr>
                    <th className="px-4 py-3 border border-white">内容</th>
                    <th className="px-4 py-3 border border-white">别名</th>
                    <th className="px-4 py-3 border border-white text-center">更新人</th>
                    <th className="px-4 py-3 border border-white text-center">更新时间</th>
                    <th className="px-4 py-3 border border-white text-center w-32">操作</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {paginatedThesaurusItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors bg-white">
                       <td className="px-4 py-4 text-slate-800">{item.content}</td>
                       <td className="px-4 py-4 text-slate-600">
                         {item.aliases && item.aliases.length > 0 ? (
                           <div className="flex flex-wrap gap-1">
                             {item.aliases.map((a, i) => (
                               <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">{a}</span>
                             ))}
                           </div>
                         ) : '-'}
                       </td>
                       <td className="px-4 py-4 text-center text-slate-600">{item.updater}</td>
                       <td className="px-4 py-4 text-center text-slate-600 font-mono text-xs">{item.updateTime}</td>
                       <td className="px-4 py-4 text-center space-x-3 text-blue-600">
                          <button 
                            onClick={() => { 
                              setEditingThesaurusId(item.id); 
                              setThesaurusFormData({ content: item.content, aliases: item.aliases?.join(',') || '' }); 
                              setThesaurusMode('EDIT'); 
                            }} 
                            className="hover:text-blue-800 transition-colors"
                          >
                            编辑
                          </button>
                          <button onClick={() => handleDeleteThesaurusItem(item.id)} className="text-red-500 hover:text-red-700 transition-colors">删除</button>
                       </td>
                    </tr>
                 ))}
                 {paginatedThesaurusItems.length === 0 && (
                   <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-slate-400">暂无数据</td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center space-x-4">
          <div className="text-sm text-slate-500">共 {filteredThesaurusItems.length} 条</div>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
             <select 
                value={thesaurusPageSize}
                onChange={(e) => { setThesaurusPageSize(Number(e.target.value)); setThesaurusCurrentPage(1); }}
                className="border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none"
             >
                <option value={5}>5条/页</option>
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
             </select>
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setThesaurusCurrentPage(Math.max(1, thesaurusCurrentPage - 1))}
              disabled={thesaurusCurrentPage === 1}
              className="p-1 px-2 border border-slate-300 rounded text-slate-600 disabled:opacity-50 hover:bg-slate-100 bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">{thesaurusCurrentPage}</span>
            <button 
              onClick={() => setThesaurusCurrentPage(Math.min(totalThesaurusPages, thesaurusCurrentPage + 1))}
              disabled={thesaurusCurrentPage === totalThesaurusPages || totalThesaurusPages === 0}
              className="p-1 px-2 border border-slate-300 rounded text-slate-600 disabled:opacity-50 hover:bg-slate-100 bg-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
             <span>前往</span>
             <input 
               type="number"
               min={1}
               max={totalThesaurusPages}
               value={thesaurusCurrentPage}
               onChange={(e) => {
                 const page = Number(e.target.value);
                 if (page >= 1 && page <= totalThesaurusPages) setThesaurusCurrentPage(page);
               }}
               className="w-12 px-2 py-1 border border-slate-300 rounded text-center focus:outline-none"
             />
             <span>页</span>
          </div>
        </div>

        {/* Thesaurus Modal */}
        {thesaurusMode !== 'LIST' && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded shadow-xl w-full max-lg max-w-lg">
               <div className="h-12 border-b border-slate-100 px-6 flex items-center justify-between">
                  <span className="font-bold text-slate-800">{thesaurusMode === 'CREATE' ? '新增词库内容' : '编辑词库内容'}</span>
                  <button onClick={() => setThesaurusMode('LIST')} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
               </div>
               <div className="p-8 space-y-6">
                  <div className="flex items-center">
                     <label className="w-16 text-sm font-medium text-slate-700 shrink-0">
                        <span className="text-red-500 mr-1">*</span>内容
                     </label>
                     <input 
                       type="text"
                       autoFocus
                       value={thesaurusFormData.content}
                       onChange={e => setThesaurusFormData({ ...thesaurusFormData, content: e.target.value })}
                       placeholder="请输入词库内容"
                       className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                     />
                  </div>
                  <div className="flex items-center">
                     <label className="w-16 text-sm font-medium text-slate-700 shrink-0">
                        别名
                     </label>
                     <input 
                       type="text"
                       value={thesaurusFormData.aliases}
                       onChange={e => setThesaurusFormData({ ...thesaurusFormData, aliases: e.target.value })}
                       placeholder="请输入别名，多个别名用英文逗号隔开"
                       className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                     />
                  </div>
               </div>
               <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3 rounded-b">
                  <button onClick={() => setThesaurusMode('LIST')} className="px-6 py-1.5 border border-slate-300 rounded text-sm text-slate-600 bg-white hover:bg-slate-50">取消</button>
                  <button onClick={handleSaveThesaurusItem} className="px-6 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">确认</button>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full bg-transparent">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white shadow-sm rounded">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">实体管理</h2>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center">
              <label className="text-sm font-medium text-slate-700 mr-3 shrink-0">实体类型</label>
              <input 
                type="text" 
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="请输入实体类型" 
                className="w-48 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm font-medium text-slate-700 mr-3 shrink-0">匹配方式</label>
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-40 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 bg-white"
              >
                <option value="">全部</option>
                <option value="词库">词库</option>
                <option value="规则">规则</option>
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
              <Plus size={14} className="mr-1" /> 新建实体
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
                    checked={paginatedEntities.length > 0 && selectedIds.size === paginatedEntities.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left border border-white">实体类型</th>
                <th className="px-4 py-3 text-center border border-white">实体编码</th>
                <th className="px-4 py-3 text-center border border-white">匹配方式</th>
                <th className="px-4 py-3 text-center border border-white">创建人</th>
                <th className="px-4 py-3 text-center border border-white">创建时间</th>
                <th className="px-4 py-3 text-center border border-white w-48">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEntities.map((item) => (
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
                  <td className="px-4 py-4 text-center text-slate-600 font-mono text-xs">{item.code}</td>
                  <td className="px-4 py-4 text-center text-slate-600">
                    <span className={`px-2 py-0.5 rounded text-xs ${item.entityType === '规则' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                      {item.entityType}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-slate-600">{item.creator}</td>
                  <td className="px-4 py-4 text-center text-slate-600 font-mono text-xs">{item.createTime}</td>
                  <td className="px-4 py-4 text-center space-x-3 text-blue-600 whitespace-nowrap">
                    {item.entityType === '词库' && (
                       <button onClick={() => handleOpenThesaurus(item)} className="hover:text-blue-800 transition-colors">词库</button>
                    )}
                    <button onClick={() => handleEdit(item)} className="hover:text-blue-800 transition-colors">编辑</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 transition-colors">删除</button>
                  </td>
                </tr>
              ))}
              {paginatedEntities.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center flex-shrink-0 space-x-4">
          <div className="text-sm text-slate-500">
            共 {filteredEntities.length} 条
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

      {/* Modal Form */}
      {mode !== 'LIST' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded shadow-xl w-full max-w-lg flex flex-col relative">
            <div className="h-14 flex items-center px-6 justify-between border-b border-slate-100 shrink-0">
              <span className="text-lg font-bold text-slate-800">{mode === 'CREATE' ? '新建实体' : '编辑实体'}</span>
              <button onClick={() => setMode('LIST')} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>实体类型
                  </label>
                  <input 
                    type="text"
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="请输入实体类型"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>实体编码
                  </label>
                  <input 
                    type="text"
                    value={formData.code || ''}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                    placeholder="请输入实体编码"
                    disabled={mode === 'EDIT'}
                    className={`w-full px-3 py-2 border border-slate-300 rounded text-sm ${mode === 'EDIT' ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'focus:outline-none focus:ring-1 focus:ring-blue-500'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">匹配方式</label>
                  <div className="flex space-x-8">
                    <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                      <input type="radio" className="w-4 h-4 mr-2 text-blue-600 focus:ring-blue-500 border-slate-300" checked={formData.entityType === '词库'} onChange={() => setFormData({...formData, entityType: '词库'})} />
                      词库
                    </label>
                    <label className="flex items-center text-sm text-slate-700 cursor-pointer">
                      <input type="radio" className="w-4 h-4 mr-2 text-blue-600 focus:ring-blue-500 border-slate-300" checked={formData.entityType === '规则'} onChange={() => setFormData({...formData, entityType: '规则'})} />
                      规则
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end space-x-3 shrink-0 rounded-b-lg">
              <button onClick={() => setMode('LIST')} className="px-6 py-1.5 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 transition-colors">取消</button>
              <button onClick={handleSave} className="px-6 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors shadow-sm">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityManager;
