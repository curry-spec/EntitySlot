import React, { useState } from 'react';
import CallMonitoring from './simulator/CallMonitoring';
import ProcessNavigation from './simulator/ProcessNavigation';
import KnowledgeRecommendation from './simulator/KnowledgeRecommendation';
import RightPanelTabs from './simulator/RightPanelTabs';
import { ChevronLeft, User } from 'lucide-react';
import EventLogPanel from './simulator/EventLogPanel';
import CustomerListDrawer, { Customer } from './simulator/CustomerListDrawer';

const SimulatorWorkbench: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: '1', name: '张三', phone: '13812345678', status: 'pending_call' }
  ]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('1');
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);
  const [sessionKeys, setSessionKeys] = useState<Record<string, number>>({ '1': 0 });
  const [isEventLogOpen, setIsEventLogOpen] = useState(false);

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  const handleReset = (id: string) => {
    setSessionKeys(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleAddCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
    setSessionKeys(prev => ({ ...prev, [customer.id]: 0 }));
  };

  const handleUpdateStatus = (id: string, status: Customer['status']) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    if (status === 'calling') {
      setIsCustomerDrawerOpen(false);
    }
    if (status === 'pending_call') {
      handleReset(id);
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden text-slate-800 bg-white relative">
      {/* Header */}
      <div className="h-[48px] border-b border-slate-100 flex items-center justify-between px-4 shrink-0 bg-white z-20">
        <div className="flex items-center space-x-2 text-[13px]">
          <span className="text-slate-400">智能助手管理</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-medium">模拟控制台</span>
        </div>

      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left sidebar trigger */}
        <div 
          className="w-[32px] border-r border-slate-100 flex flex-col items-center pt-8 bg-white shrink-0 relative z-30 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => setIsCustomerDrawerOpen(true)}
        >
          <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center">
            <User size={14} className="text-blue-600 mb-2" />
            <div className="text-[11px] text-slate-500 font-medium [writing-mode:vertical-rl] tracking-widest">
              {activeCustomer.name} {activeCustomer.status === 'calling' ? '进线中' : activeCustomer.status === 'wrapping_up' ? '待小结' : '待连线'}
            </div>
          </div>
        </div>

        <div className="flex-1 relative z-10 w-full overflow-hidden flex flex-col">
          {customers.map(customer => (
            <div 
              key={customer.id} 
              className={`flex flex-1 gap-0.5 bg-slate-200 overflow-hidden ${customer.id === selectedCustomerId ? '' : 'hidden'}`}
            >
              {/* Left Column: Call Monitoring */}
              <div className="w-1/4 min-w-[280px] bg-white flex flex-col overflow-hidden">
                <CallMonitoring 
                  key={`call-${customer.id}-${sessionKeys[customer.id] || 0}`} 
                  isPristine={(sessionKeys[customer.id] || 0) === 0} 
                  onReset={() => handleReset(customer.id)} 
                  isDisabled={customer.status !== 'calling'}
                />
              </div>
              
              {/* Middle Column: Smart Process Navigation */}
              <div className="w-1/4 min-w-[280px] bg-white flex flex-col overflow-hidden">
                <ProcessNavigation 
                  key={`nav-${customer.id}-${sessionKeys[customer.id] || 0}`} 
                  isPristine={(sessionKeys[customer.id] || 0) === 0} 
                  customer={customer}
                />
              </div>

              {/* Third Column: Knowledge Recommendation */}
              <div className="w-1/4 min-w-[280px] bg-[#f0f2f5] flex flex-col overflow-hidden">
                <KnowledgeRecommendation 
                  key={`knowledge-${customer.id}-${sessionKeys[customer.id] || 0}`} 
                  isPristine={(sessionKeys[customer.id] || 0) === 0} 
                />
              </div>

              {/* Right Column: Tabs */}
              <div className="w-1/4 min-w-[280px] bg-white flex flex-col overflow-hidden relative">
                <RightPanelTabs 
                  key={`tabs-${customer.id}-${sessionKeys[customer.id] || 0}`} 
                  isPristine={(sessionKeys[customer.id] || 0) === 0} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 hover:translate-x-0 transition-transform z-30">
        <button 
          onClick={() => setIsEventLogOpen(true)}
          className="bg-white text-blue-600 shadow-[-4px_0_12px_rgba(0,0,0,0.1)] rounded-l-lg py-3 px-1 flex items-center justify-center hover:bg-slate-50 border border-slate-200 border-r-0"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <EventLogPanel isOpen={isEventLogOpen} onClose={() => setIsEventLogOpen(false)} />
      
      <CustomerListDrawer 
        isOpen={isCustomerDrawerOpen}
        onClose={() => setIsCustomerDrawerOpen(false)}
        customers={customers}
        onAddCustomer={handleAddCustomer}
        selectedCustomerId={selectedCustomerId}
        onSelectCustomer={setSelectedCustomerId}
        onUpdateStatus={handleUpdateStatus}
      />

      <div className="absolute bottom-4 right-4 z-50">
        <button className="bg-[#2e5ef4] text-white px-3 py-1.5 rounded flex items-center space-x-1.5 shadow-lg shadow-blue-500/30 font-bold text-[13px] hover:bg-blue-700 transition-all active:scale-95">
          <span>IM</span>
          <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">96</span>
        </button>
      </div>
    </div>
  );
};

export default SimulatorWorkbench;

