import React, { useState, useEffect, useCallback } from 'react';
import ApiKeyInput from './components/ApiKeyInput';
import Toolbar from './components/Toolbar';
import ContentView from './components/ContentView';
import CharacterEditorModal from './components/CharacterEditorModal';
import ErrorAlert from './components/ErrorAlert';
import { parseSrt, serializeSrt } from './services/srtParser';
import * as geminiService from './services/geminiService';
import type { SrtEntry, SrtData, Character, Tab } from './types';
import { BATCH_SIZE } from './constants';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  
  const [originalSrt, setOriginalSrt] = useState<SrtData>(null);
  const [normalizedSrt, setNormalizedSrt] = useState<SrtData>(null);
  const [translatedSrt, setTranslatedSrt] = useState<SrtData>(null);
  const [fixedSrt, setFixedSrt] = useState<SrtData>(null);
  
  const [characters, setCharacters] = useState<Character[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Sẵn sàng.');
  const [activeTab, setActiveTab] = useState<Tab>('original');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isCheckingKey, setIsCheckingKey] = useState<boolean>(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'idle' | 'success' | 'error' | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      addLog("Đã tải API key đã lưu.");
    }
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };
  
  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('gemini_api_key', newKey);
    setApiKeyStatus(null);
    const maskedKey = newKey.length > 8 ? `${newKey.substring(0, 4)}...${newKey.substring(newKey.length - 4)}` : '***';
    addLog(`API key đã được cập nhật. Key đang dùng: ${maskedKey}`);
    setStatusMessage("Đã lưu API key mới.");
  };

  const resetApiKeyStatus = () => {
    if (apiKeyStatus !== null) {
      setApiKeyStatus(null);
    }
  };

  const handleCheckApiKey = async (keyToCheck: string) => {
    if (!keyToCheck) {
        setStatusMessage("Vui lòng nhập API key để kiểm tra.");
        setApiKeyStatus('error');
        addLog("Lỗi: Thao tác kiểm tra key thất bại vì không có key nào được nhập.");
        return;
    }
    setIsCheckingKey(true);
    setApiKeyStatus('idle');
    setErrorMessage(null);
    addLog(`Đang kiểm tra API key...`);
    setStatusMessage("Đang kiểm tra API key...");
    
    const result = await geminiService.checkApiKey(keyToCheck);
    
    if (result.isValid) {
        setApiKeyStatus('success');
        addLog(`Kiểm tra thành công: ${result.message}`);
        setStatusMessage("API Key hợp lệ.");
    } else {
        setApiKeyStatus('error');
        addLog(`Kiểm tra thất bại: ${result.message}`);
        setStatusMessage(`Lỗi: ${result.message}`);
        setErrorMessage(result.message);
    }
    setIsCheckingKey(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setErrorMessage(null);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const parsed = parseSrt(content);
        setOriginalSrt(parsed);
        setNormalizedSrt(null);
        setTranslatedSrt(null);
        setFixedSrt(null);
        setActiveTab('original');
        addLog(`Đã tải file: ${file.name} (${parsed.length} mục).`);
        setStatusMessage(`Đã tải ${file.name}.`);
      };
      reader.readAsText(file);
    }
  };

  const processInBatches = async <T, R>(
    inputData: T[],
    processor: (batchText: string) => Promise<string>,
    taskName: string
  ): Promise<R[]> => {
    setErrorMessage(null);
    if (!apiKey) {
      const errorMsg = "Vui lòng nhập và lưu API key trước khi xử lý.";
      addLog(`LỖI: ${errorMsg}`);
      setStatusMessage(`Lỗi: ${errorMsg}`);
      setErrorMessage(errorMsg);
      throw new Error(errorMsg);
    }
    
    setIsLoading(true);
    addLog(`Bắt đầu ${taskName}...`);
    
    const results: R[] = [];
    const numBatches = Math.ceil(inputData.length / BATCH_SIZE);

    for (let i = 0; i < numBatches; i++) {
      const start = i * BATCH_SIZE;
      const end = start + BATCH_SIZE;
      const batch = inputData.slice(start, end);
      const batchText = batch.map((entry: any) => entry.text).join('\n---\n');
      
      setStatusMessage(`${taskName}: đang xử lý batch ${i + 1} / ${numBatches}...`);
      
      const resultText = await processor(batchText);
      const resultLines = resultText.split(/\n---\n/);
      
      const processedBatch = batch.map((originalEntry: any, index: number) => ({
        ...originalEntry,
        text: resultLines[index] || originalEntry.text,
      }));
      
      results.push(...processedBatch as R[]);
    }
    
    setStatusMessage(`${taskName} hoàn tất.`);
    addLog(`${taskName} hoàn tất.`);
    setIsLoading(false);
    return results;
  };

  const handleApiError = (error: unknown, taskName: string) => {
    const message = error instanceof Error ? error.message : String(error);
    addLog(`Lỗi trong tác vụ "${taskName}": ${message}`);
    if (error && typeof error === 'object') {
        try {
            const errorDetails = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
            addLog(`Chi tiết lỗi: ${errorDetails}`);
        } catch {
             addLog(`Chi tiết lỗi: Không thể chuyển đổi đối tượng lỗi sang JSON.`);
        }
    }
    setStatusMessage(`Lỗi: ${message}`);
    setErrorMessage(message);
    setIsLoading(false);
  };
  
  const handleNormalize = useCallback(async () => {
    if (!originalSrt) return;
    try {
      const processedSrt = await processInBatches<SrtEntry, SrtEntry>(
        originalSrt,
        (text) => geminiService.normalizeText(apiKey, text),
        "Chuẩn hoá ZH"
      );
      setNormalizedSrt(processedSrt);
      setActiveTab('normalized');
    } catch (error) {
      handleApiError(error, "Chuẩn hoá ZH");
    }
  }, [originalSrt, apiKey]);

  const handleTranslate = useCallback(async () => {
    if (!normalizedSrt) return;
     try {
      const processedSrt = await processInBatches<SrtEntry, SrtEntry>(
        normalizedSrt,
        (text) => geminiService.translateText(apiKey, text),
        "Dịch sang VI"
      );
      setTranslatedSrt(processedSrt);
      setActiveTab('translated');
    } catch (error) {
      handleApiError(error, "Dịch sang VI");
    }
  }, [normalizedSrt, apiKey]);

  const handleStartGenderFix = useCallback(async () => {
    if (!translatedSrt) return;
    setErrorMessage(null);
    setIsLoading(true);
    setStatusMessage("Đang phân tích nhân vật...");
    addLog("Bắt đầu phân tích nhân vật...");
    try {
        if (!apiKey) {
            const errorMsg = "Vui lòng nhập và lưu API key trước khi xử lý.";
            setErrorMessage(errorMsg);
            throw new Error(errorMsg);
        }
        const fullText = translatedSrt.map(e => e.text).join('\n');
        const result = await geminiService.analyzeCharacters(apiKey, fullText);
        setCharacters(result.characters || []);
        setIsModalOpen(true);
        addLog(`Phân tích xong. Tìm thấy ${result.characters?.length || 0} nhân vật.`);
    } catch (error) {
        handleApiError(error, "Phân tích nhân vật");
    } finally {
        setIsLoading(false);
    }
  }, [translatedSrt, apiKey]);

  const handleConfirmGenderFix = useCallback(async (confirmedCharacters: Character[]) => {
    if (!translatedSrt) return;
    setCharacters(confirmedCharacters);
    setIsModalOpen(false);
    
    const characterJson = JSON.stringify({ characters: confirmedCharacters });
    addLog("Đã xác nhận giới tính. Bắt đầu sửa lỗi...");

    try {
      const processedSrt = await processInBatches<SrtEntry, SrtEntry>(
        translatedSrt,
        (text) => geminiService.fixGenderInText(apiKey, text, characterJson),
        "Sửa lỗi giới tính"
      );
      setFixedSrt(processedSrt);
      setActiveTab('fixed');
    } catch (error) {
      handleApiError(error, "Sửa lỗi giới tính");
    }

  }, [translatedSrt, apiKey]);
  
  const handleExport = () => {
    if (!fixedSrt || !fileName) return;
    const finalSrtContent = serializeSrt(fixedSrt);
    const blob = new Blob([finalSrtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const baseName = fileName.replace(/\.srt$/, '');
    link.download = `${baseName}.fixed.vi.srt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addLog(`Đã xuất file: ${link.download}`);
  };


  return (
    <div className="h-screen w-screen bg-gray-900 text-gray-200 flex flex-col p-4 space-y-4 font-sans">
        <header>
          <h1 className="text-2xl font-bold text-white">Trình Sửa Phụ Đề AI</h1>
          <p className="text-sm text-gray-400">Dịch & sửa lỗi giới tính cho phụ đề tiếng Trung sang tiếng Việt.</p>
        </header>

        {errorMessage && (
          <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />
        )}

        <ApiKeyInput 
            apiKey={apiKey} 
            setApiKey={handleApiKeyChange} 
            onCheck={handleCheckApiKey}
            isChecking={isCheckingKey}
            checkStatus={apiKeyStatus}
            onTyping={resetApiKeyStatus}
        />
        
        <Toolbar 
            onFileSelect={handleFileSelect}
            onNormalize={handleNormalize}
            onTranslate={handleTranslate}
            onStartGenderFix={handleStartGenderFix}
            onExport={handleExport}
            fileName={fileName}
            originalSrt={originalSrt}
            normalizedSrt={normalizedSrt}
            translatedSrt={translatedSrt}
            fixedSrt={fixedSrt}
            isLoading={isLoading}
        />

        <main className="flex-grow min-h-0">
          <ContentView 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            originalSrt={originalSrt}
            normalizedSrt={normalizedSrt}
            translatedSrt={translatedSrt}
            fixedSrt={fixedSrt}
            logs={logs}
          />
        </main>

        <footer className="bg-gray-800 p-2 rounded-lg text-xs text-gray-400">
          <p>Trạng thái: {statusMessage}</p>
        </footer>

        <CharacterEditorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmGenderFix}
            initialCharacters={characters}
            isLoading={isLoading}
        />
    </div>
  );
};

export default App;