import React, { useState, useMemo } from 'react';
import { Emotion, FormMode } from '../types';
import { Plus, Search, ChevronLeft, Edit2, Trash2, HelpCircle, X } from 'lucide-react';

interface Props {
  emotions: Emotion[];
  setEmotions: React.Dispatch<React.SetStateAction<Emotion[]>>;
}

const EmotionManager: React.FC<Props> = ({ emotions, setEmotions }) => {
  const [mode, setMode] = useState<FormMode>('LIST');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search State
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState<'ALL' | 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE'>('ALL');

  // Form State
  const [formData, setFormData] = useState<Partial<Emotion>>({
    name: '',
    type: 'NEGATIVE',
    description: '',
    comfortScript: ''
  });

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Pagination (mock)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtering
  const filteredEmotions = useMemo(() => {
    return emotions.filter(e => {
      const matchName = e.name.toLowerCase().includes(searchName.toLowerCase());
      const matchType = searchType === 'ALL' || e.type === searchType;
      return matchName && matchType;
    });
  }, [emotions, searchName, searchType]);

  const paginatedEmotions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmotions.slice(start, start + itemsPerPage);
  }, [filteredEmotions, currentPage]);

  const totalPages = Math.ceil(filteredEmotions.length / itemsPerPage);

  // Actions
  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchName('');
    setSearchType('ALL');
    setCurrentPage(1);
  };

  const handleEdit = (emotion: Emotion) => {
    setEditingId(emotion.id);
    setFormData(emotion);
    setMode('EDIT');
  };

  const handleSave = () => {
    if (!formData.name || !formData.description || !formData.type) {
      alert('请填写必填项');
      return;
    }

    if (mode === 'CREATE') {
      const newEmotion: Emotion = {
        id: `EMO${Date.now().toString().slice(-6)}`,
        name: formData.name!,
        type: formData.type as 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE',
        description: formData.description!,
        status: 'ACTIVE', // default status
        comfortScript: formData.comfortScript || '',
        createTime: new Date().toLocaleString()
      };
      setEmotions([newEmotion, ...emotions]);
    } else if (mode === 'EDIT' && editingId) {
      setEmotions(prev => prev.map(e => e.id === editingId ? { ...e, ...formData } as Emotion : e));
    }

    setMode('LIST');
    setEditingId(null);
    setFormData({ name: '', type: 'NEGATIVE', description: '', comfortScript: '' });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedEmotions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedEmotions.map(e => e.id)));
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden relative">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
         <div className="flex items-center">
              <h2 className="text-xl font-bold text-slate-800 mr-2">情绪管理</h2>
         </div>
      </div>

      {/* Search Area */}
      <div className="p-6 border-b border-slate-100 bg-white flex-shrink-0">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center">
            <label className="text-sm font-medium text-slate-700 mr-3 whitespace-nowrap">情绪名称</label>
            <input 
              type="text" 
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="请输入情绪名称" 
              className="w-48 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <label className="text-sm font-medium text-slate-700 mr-3 whitespace-nowrap">情绪类型</label>
            <select 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              className="w-40 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">全部</option>
              <option value="NEGATIVE">负面</option>
              <option value="NEUTRAL">中性</option>
              <option value="POSITIVE">正面</option>
            </select>
          </div>
          <div className="flex space-x-2 ml-auto">
            <button onClick={handleSearch} className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">查询</button>
            <button onClick={handleReset} className="px-4 py-1.5 bg-white border border-slate-300 text-slate-600 rounded text-sm hover:bg-slate-50 transition-colors">重置</button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
        <div className="flex space-x-2">
          {/* Create button removed as per requirements */}
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto bg-white relative">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="bg-[#f8fafc] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                  checked={paginatedEmotions.length > 0 && selectedIds.size === paginatedEmotions.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-3">情绪名称</th>
              <th className="px-6 py-3 w-32">情绪类型</th>
              <th className="px-6 py-3">情绪描述</th>
              <th className="px-6 py-3">安抚话术</th>
              <th className="px-6 py-3 text-right w-48">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedEmotions.map(emotion => (
              <tr key={emotion.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    checked={selectedIds.has(emotion.id)}
                    onChange={() => toggleSelect(emotion.id)}
                  />
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">{emotion.name}</td>
                <td className="px-6 py-4">
                  {emotion.type === 'NEGATIVE' ? (
                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs border border-red-100">负面</span>
                  ) : emotion.type === 'NEUTRAL' ? (
                    <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">中性</span>
                  ) : (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs border border-green-100">正面</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500 truncate max-w-sm" title={emotion.description}>
                  {emotion.description}
                </td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]" title={emotion.comfortScript || '-'}>
                  {emotion.comfortScript || '-'}
                </td>
                <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                  <button onClick={() => handleEdit(emotion)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">编辑</button>
                </td>
              </tr>
            ))}
            {paginatedEmotions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white flex-shrink-0 text-sm text-slate-500">
        <div>共 {filteredEmotions.length} 条记录</div>
        <div className="flex space-x-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span className="px-3 py-1">
            {currentPage} / {totalPages || 1}
          </span>
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {mode !== 'LIST' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-[600px] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {mode === 'CREATE' ? '新建情绪' : '编辑情绪'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mode === 'CREATE' ? '配置新的情绪标签' : '修改情绪标签的基础信息'}
                </p>
              </div>
              <button 
                onClick={() => setMode('LIST')} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    情绪名称 <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="如：烦躁、满意"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    情绪类型 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-3">
                    <label className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-md cursor-pointer transition-all text-sm ${formData.type === 'NEGATIVE' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                      <input 
                        type="radio" 
                        name="emotionType" 
                        value="NEGATIVE" 
                        checked={formData.type === 'NEGATIVE'}
                        onChange={() => setFormData({...formData, type: 'NEGATIVE'})}
                        className="sr-only"
                      />
                      <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                      负面
                    </label>
                    <label className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-md cursor-pointer transition-all text-sm ${formData.type === 'NEUTRAL' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                      <input 
                        type="radio" 
                        name="emotionType" 
                        value="NEUTRAL" 
                        checked={formData.type === 'NEUTRAL'}
                        onChange={() => setFormData({...formData, type: 'NEUTRAL'})}
                        className="sr-only"
                      />
                      <span className="w-2 h-2 rounded-full bg-slate-400 mr-2"></span>
                      中性
                    </label>
                    <label className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-md cursor-pointer transition-all text-sm ${formData.type === 'POSITIVE' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                      <input 
                        type="radio" 
                        name="emotionType" 
                        value="POSITIVE" 
                        checked={formData.type === 'POSITIVE'}
                        onChange={() => setFormData({...formData, type: 'POSITIVE'})}
                        className="sr-only"
                      />
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      正面
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    情绪描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="描述该情绪的具体表现和触发场景，帮助系统更准确地识别..."
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    安抚话术
                  </label>
                  <textarea 
                    value={formData.comfortScript}
                    onChange={(e) => setFormData({...formData, comfortScript: e.target.value})}
                    placeholder="输入针对该情绪的安抚话术配置..."
                    rows={4}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50/50 rounded-b-xl">
              <button 
                onClick={() => setMode('LIST')}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionManager;

