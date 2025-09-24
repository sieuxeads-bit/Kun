import React, { useState, useEffect } from 'react';
import { SpinnerIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onCheck: (key: string) => void;
  isChecking: boolean;
  checkStatus: 'idle' | 'success' | 'error' | null;
  onTyping: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey, onCheck, isChecking, checkStatus, onTyping }) => {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    setApiKey(localApiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const handleCheck = () => {
    onCheck(localApiKey);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalApiKey(e.target.value);
    onTyping();
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4">
      <label htmlFor="api-key" className="text-sm font-medium text-gray-400 whitespace-nowrap">
        Google API Key
      </label>
      <input
        id="api-key"
        type="password"
        value={localApiKey}
        onChange={handleInputChange}
        placeholder="Dán API Key của bạn vào đây"
        className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />
      <div className="flex items-center space-x-2">
        <button
          onClick={handleSave}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition whitespace-nowrap ${
            saved
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500`}
        >
          {saved ? 'Đã lưu!' : 'Lưu API'}
        </button>
         <button
          onClick={handleCheck}
          disabled={isChecking || !localApiKey}
          className="px-4 py-2 text-sm font-semibold rounded-md transition whitespace-nowrap bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-400"
        >
          {isChecking ? 'Đang kiểm tra...' : 'Kiểm tra Key'}
        </button>
        <div className="w-6 h-6 flex items-center justify-center">
            { isChecking && <SpinnerIcon /> }
            { !isChecking && checkStatus === 'success' && <CheckCircleIcon /> }
            { !isChecking && checkStatus === 'error' && <XCircleIcon /> }
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInput;