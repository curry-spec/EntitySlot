import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import EmotionManager from './components/EmotionManager';
import ScriptRecommendManager from './components/ScriptRecommendManager';
import AgentAssistant from './components/AgentAssistant';
import IntentManager from './components/IntentManager';
import SimulatorWorkbench from './components/SimulatorWorkbench';
import DualScreenConfig from './components/DualScreenConfig';
import IntentDashboard from './components/IntentDashboard';
import IntentDashboard1 from './components/IntentDashboard1';
import IntentDashboard2 from './components/IntentDashboard2';
import AssistantFunnelDashboard from './components/AssistantFunnelDashboard';
import AssistantFunnelDashboard2 from './components/AssistantFunnelDashboard2';
import AssistantFunnelDashboard3 from './components/AssistantFunnelDashboard3';
import VersionComparisonLab from './components/VersionComparisonLab';
import LogMonitor from './components/LogMonitor';
import SessionEvalStats from './components/SessionEvalStats';
import SessionEvalDetail from './components/SessionEvalDetail';
import SessionDetail from './components/SessionDetail';
import AgentMonitorList from './components/TeamMonitorDashboard';
import TeamMonitorStats from './components/TeamMonitorStats';
import RealtimeCallMonitor from './components/RealtimeCallMonitor';
import SessionMonitor from './components/SessionMonitor';
import CallMonitorDetail from './components/CallMonitorDetail';
import EntityManager from './components/EntityManager';
import { Emotion, ScriptRecommend, ViewState, Intent, Prompt, LogRecord, Entity } from './types';
import { MOCK_EMOTIONS, MOCK_RECOMMEND_SCRIPTS, MOCK_INTENT_RECORDS, MOCK_PROMPTS, MOCK_ENTITIES } from './constants';

import PromptManager from './components/PromptManager';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('INTENT');
  const [subView, setSubView] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<{ id: string; name: string } | null>(null);
  const [previousMonitorView, setPreviousMonitorView] = useState<ViewState>('TEAM_MONITOR_STATS');
  
  // Lifted state to manage dependencies between modules
  const [emotions, setEmotions] = useState<Emotion[]>(MOCK_EMOTIONS);
  const [recommendScripts, setRecommendScripts] = useState<ScriptRecommend[]>(MOCK_RECOMMEND_SCRIPTS);
  const [intents, setIntents] = useState<Intent[]>(MOCK_INTENT_RECORDS);
  const [entities, setEntities] = useState<Entity[]>(MOCK_ENTITIES);
  const [prompts, setPrompts] = useState<Prompt[]>(MOCK_PROMPTS);

  const renderContent = () => {
    switch (currentView) {
      case 'EMOTION':
        return <EmotionManager emotions={emotions} setEmotions={setEmotions} />;
      case 'SCRIPT':
        return (
          <ScriptRecommendManager 
            scripts={recommendScripts} 
            setScripts={setRecommendScripts} 
            emotions={emotions}
          />
        );
      case 'AGENT_ASSISTANT':
        return <AgentAssistant />;
      case 'INTENT':
        return <IntentManager intents={intents} setIntents={setIntents} entities={entities} setEntities={setEntities} />;
      case 'ENTITY':
        return <EntityManager entities={entities} setEntities={setEntities} onSubViewChange={setSubView} />;
      case 'SIMULATOR':
        return <SimulatorWorkbench />;
      case 'INTENT_DASHBOARD':
        return <IntentDashboard />;
      case 'INTENT_DASHBOARD_1':
        return <IntentDashboard1 />;
      case 'INTENT_DASHBOARD_2':
        return <IntentDashboard2 />;
      case 'ASSISTANT_FUNNEL_DASHBOARD':
        return <AssistantFunnelDashboard />;
      case 'ASSISTANT_FUNNEL_DASHBOARD_2':
        return <AssistantFunnelDashboard2 />;
      case 'ASSISTANT_FUNNEL_DASHBOARD_3':
        return <AssistantFunnelDashboard3 />;
      case 'VERSION_COMPARISON_LAB':
        return <VersionComparisonLab onPushGray={() => setCurrentView('ASSISTANT_FUNNEL_DASHBOARD_3')} />;
      case 'DUAL_SCREEN_CONFIG':
        return <DualScreenConfig version={1} />;
      case 'DUAL_SCREEN_CONFIG_2':
        return <DualScreenConfig version={2} />;
      case 'PROMPT':
        return <PromptManager prompts={prompts} setPrompts={setPrompts} />;
      case 'LOG_MONITOR':
        return <LogMonitor onNavigateToDetail={(id) => { setSelectedSessionId(id); setCurrentView('SESSION_DETAIL'); }} />;
      case 'SESSION_EVAL_STATS':
        return <SessionEvalStats onNavigateToDetail={(id) => { setSelectedSessionId(id); setCurrentView('SESSION_EVAL_DETAIL'); }} />;
      case 'SESSION_EVAL_DETAIL':
        return <SessionEvalDetail sessionId={selectedSessionId} onBack={() => setCurrentView('SESSION_EVAL_STATS')} />;
      case 'SESSION_DETAIL':
        return <SessionDetail sessionId={selectedSessionId} onBack={() => setCurrentView('LOG_MONITOR')} />;
      case 'TEAM_MONITOR_STATS':
        return <TeamMonitorStats />;
      case 'AGENT_MONITOR_LIST':
        return <AgentMonitorList onMonitorCall={(id, name) => {
          setSelectedAgent({ id, name });
          setPreviousMonitorView('AGENT_MONITOR_LIST');
          setCurrentView('CALL_MONITOR_DETAIL');
        }} />;
      case 'CALL_MONITOR_DETAIL':
        return selectedAgent ? (
          <CallMonitorDetail 
            agentId={selectedAgent.id} 
            agentName={selectedAgent.name} 
            onBack={() => setCurrentView(previousMonitorView)} 
          />
        ) : null;
      case 'REALTIME_CALL_MONITOR':
        return <RealtimeCallMonitor onMonitorCall={(id, name) => {
          setSelectedAgent({ id, name });
          setPreviousMonitorView('REALTIME_CALL_MONITOR');
          setCurrentView('CALL_MONITOR_DETAIL');
        }} />;
      case 'SESSION_MONITOR':
        return <SessionMonitor />;
      default:
        return <div className="p-10 text-slate-500">Feature coming soon...</div>;
    }
  };

  const getBreadcrumb = () => {
     if (subView === 'THESAURUS') {
         return <span className="text-blue-600 font-medium">词库</span>;
     }
     if (currentView === 'INTENT' || currentView === 'ENTITY') {
         return (
             <>
                <span>智能助手管理</span>
                <span>/</span>
                <span>内容管理</span>
                <span>/</span>
                <span className="text-blue-600 font-medium">{currentView === 'INTENT' ? '意图管理' : '实体管理'}</span>
             </>
         );
     }
     return <span>智能助手管理</span>;
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-sans text-slate-900 overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar currentView={currentView} onChangeView={(v) => { setCurrentView(v); setSubView(null); }} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />

        {/* Breadcrumb / Page Header Area (Simplified matches screenshot top white bar) */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 text-[13px] text-slate-600 flex items-center justify-between">
            <div className="flex items-center space-x-2">
               {getBreadcrumb()}
            </div>
            
            {currentView === 'PROMPT' && (
              <div className="flex items-center text-[12px]">
                 <span className="text-slate-500 mr-2">最近浏览 :</span>
                 <div className="flex items-center bg-blue-50/50 border border-blue-200 text-blue-600 px-2 py-0.5 rounded">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></div>
                    提示词管理
                    <span className="ml-2 text-blue-400 hover:text-blue-600 cursor-pointer">×</span>
                 </div>
              </div>
            )}
            {(currentView === 'LOG_MONITOR' || currentView === 'SESSION_EVAL_STATS' || currentView === 'SESSION_EVAL_DETAIL' || currentView === 'SESSION_DETAIL' || currentView === 'INTENT_DASHBOARD' || currentView === 'INTENT_DASHBOARD_1' || currentView === 'INTENT_DASHBOARD_2' || currentView === 'ASSISTANT_FUNNEL_DASHBOARD' || currentView === 'ASSISTANT_FUNNEL_DASHBOARD_2' || currentView === 'ASSISTANT_FUNNEL_DASHBOARD_3' || currentView === 'VERSION_COMPARISON_LAB') && (
              <div className="flex items-center text-[12px]">
                 <span className="text-slate-500 mr-2">最近浏览 :</span>
                 <div className={`flex items-center ${currentView === 'LOG_MONITOR' ? 'bg-blue-50/50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600'} border px-2 py-0.5 rounded mr-2`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${currentView === 'LOG_MONITOR' ? 'bg-blue-500' : 'bg-slate-400'} mr-1.5`}></div>
                    日志监测
                    <span className={`ml-2 cursor-pointer ${currentView === 'LOG_MONITOR' ? 'text-blue-400 hover:text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>×</span>
                 </div>
                 <div className={`flex items-center ${currentView === 'INTENT_DASHBOARD' || currentView === 'INTENT_DASHBOARD_1' || currentView === 'INTENT_DASHBOARD_2' || currentView === 'ASSISTANT_FUNNEL_DASHBOARD' || currentView === 'ASSISTANT_FUNNEL_DASHBOARD_2' || currentView === 'ASSISTANT_FUNNEL_DASHBOARD_3' || currentView === 'VERSION_COMPARISON_LAB' ? 'bg-blue-50/50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600'} border px-2 py-0.5 rounded mr-2`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${currentView === 'INTENT_DASHBOARD' || currentView === 'INTENT_DASHBOARD_1' || currentView === 'INTENT_DASHBOARD_2' || currentView === 'ASSISTANT_FUNNEL_DASHBOARD' || currentView === 'ASSISTANT_FUNNEL_DASHBOARD_2' || currentView === 'ASSISTANT_FUNNEL_DASHBOARD_3' || currentView === 'VERSION_COMPARISON_LAB' ? 'bg-blue-500' : 'bg-slate-400'} mr-1.5`}></div>
                    意图看板
                    <span className={`ml-2 cursor-pointer ${currentView === 'INTENT_DASHBOARD' || currentView === 'INTENT_DASHBOARD_1' || currentView === 'INTENT_DASHBOARD_2' || currentView === 'ASSISTANT_FUNNEL_DASHBOARD' || currentView === 'ASSISTANT_FUNNEL_DASHBOARD_2' || currentView === 'ASSISTANT_FUNNEL_DASHBOARD_3' || currentView === 'VERSION_COMPARISON_LAB' ? 'text-blue-400 hover:text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>×</span>
                 </div>
                 <div className={`flex items-center ${currentView === 'SESSION_EVAL_STATS' || currentView === 'SESSION_EVAL_DETAIL' || currentView === 'SESSION_DETAIL' ? 'bg-blue-50/50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600'} border px-2 py-0.5 rounded`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${currentView === 'SESSION_EVAL_STATS' || currentView === 'SESSION_EVAL_DETAIL' || currentView === 'SESSION_DETAIL' ? 'bg-blue-500' : 'bg-slate-400'} mr-1.5`}></div>
                    会话详情
                    <span className={`ml-2 cursor-pointer ${currentView === 'SESSION_EVAL_STATS' || currentView === 'SESSION_EVAL_DETAIL' || currentView === 'SESSION_DETAIL' ? 'text-blue-400 hover:text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>×</span>
                 </div>
              </div>
            )}
        </div>

        {/* Dynamic Content */}
        <div className={`flex-1 overflow-hidden ${currentView === 'PROMPT' || currentView === 'TEAM_MONITOR_DASHBOARD' || currentView === 'REALTIME_CALL_MONITOR' || currentView === 'SESSION_MONITOR' || currentView === 'DUAL_SCREEN_CONFIG' || currentView === 'DUAL_SCREEN_CONFIG_2' ? '' : 'p-6'}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;