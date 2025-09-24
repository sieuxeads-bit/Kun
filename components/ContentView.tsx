
import React from 'react';
import type { Tab, SrtData } from '../types';

interface SubtitleViewerProps {
  data: SrtData;
}

const SubtitleViewer: React.FC<SubtitleViewerProps> = ({ data }) => {
  if (!data) {
    return <div className="text-gray-500 italic p-6">Chưa có dữ liệu.</div>;
  }
  return (
    <div className="p-4 space-y-4 text-sm font-mono">
      {data.map(entry => (
        <div key={entry.id} className="grid grid-cols-[30px_1fr] gap-x-4">
          <span className="text-gray-500 text-right">{entry.id}</span>
          <div>
            <p className="text-yellow-400 text-xs">{entry.time}</p>
            <p className="text-gray-200 whitespace-pre-wrap">{entry.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

interface LogViewerProps {
  logs: string[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
    if (logs.length === 0) {
        return <div className="text-gray-500 italic p-6">Nhật ký trống.</div>;
    }
    return (
        <div className="p-4 space-y-2 text-sm font-mono">
            {logs.map((log, index) => (
                <p key={index} className="text-gray-300 whitespace-pre-wrap">{log}</p>
            ))}
        </div>
    )
}

interface ContentViewProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  originalSrt: SrtData;
  normalizedSrt: SrtData;
  translatedSrt: SrtData;
  fixedSrt: SrtData;
  logs: string[];
}

const ContentView: React.FC<ContentViewProps> = ({
  activeTab,
  setActiveTab,
  originalSrt,
  normalizedSrt,
  translatedSrt,
  fixedSrt,
  logs
}) => {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'original', label: 'SRT Gốc (ZH)' },
    { id: 'normalized', label: 'ZH Đã chuẩn hoá' },
    { id: 'translated', label: 'Bản dịch VI (Thô)' },
    { id: 'fixed', label: 'VI Đã sửa lỗi' },
    { id: 'log', label: 'Nhật ký' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'original': return <SubtitleViewer data={originalSrt} />;
      case 'normalized': return <SubtitleViewer data={normalizedSrt} />;
      case 'translated': return <SubtitleViewer data={translatedSrt} />;
      case 'fixed': return <SubtitleViewer data={fixedSrt} />;
      case 'log': return <LogViewer logs={logs} />;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg flex-grow flex flex-col">
      <div className="border-b border-gray-700">
        <nav className="flex space-x-4 px-4" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="overflow-y-auto flex-grow">
        {renderContent()}
      </div>
    </div>
  );
};

export default ContentView;
