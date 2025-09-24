
import React from 'react';
import type { SrtData } from '../types';
import { FileIcon, WandIcon, LanguageIcon, UsersIcon, DownloadIcon, SaveIcon } from './icons';

interface ToolbarProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNormalize: () => void;
  onTranslate: () => void;
  onStartGenderFix: () => void;
  onExport: () => void;
  fileName: string | null;
  originalSrt: SrtData;
  normalizedSrt: SrtData;
  translatedSrt: SrtData;
  fixedSrt: SrtData;
  isLoading: boolean;
}

const ToolbarButton: React.FC<{ onClick?: () => void; disabled?: boolean; children: React.ReactNode; isFile?: boolean; fileId?: string; onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = 
({ onClick, disabled, children, isFile, fileId, onFileChange }) => {
  const commonClasses = "flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const disabledClasses = "bg-gray-600 text-gray-400 cursor-not-allowed";
  const enabledClasses = "bg-gray-700 hover:bg-gray-600 text-white focus:ring-blue-500";
  
  if (isFile) {
    return (
        <>
            <input type="file" id={fileId} accept=".srt" onChange={onFileChange} className="hidden" />
            <label htmlFor={fileId} className={`${commonClasses} ${disabled ? disabledClasses : enabledClasses} cursor-pointer`}>
                {children}
            </label>
        </>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={`${commonClasses} ${disabled ? disabledClasses : enabledClasses}`}>
      {children}
    </button>
  );
};

const Toolbar: React.FC<ToolbarProps> = ({
  onFileSelect,
  onNormalize,
  onTranslate,
  onStartGenderFix,
  onExport,
  fileName,
  originalSrt,
  normalizedSrt,
  translatedSrt,
  fixedSrt,
  isLoading,
}) => {
  return (
    <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-2">
      <ToolbarButton isFile fileId="srt-upload" onFileChange={onFileSelect}>
        <FileIcon /> Mở SRT (ZH)
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-600"></div>

      <ToolbarButton onClick={onNormalize} disabled={!originalSrt || isLoading}>
        <WandIcon /> Chuẩn hoá ZH
      </ToolbarButton>

      <ToolbarButton onClick={onTranslate} disabled={!normalizedSrt || isLoading}>
        <LanguageIcon /> Dịch sang VI
      </ToolbarButton>
      
      <ToolbarButton onClick={onStartGenderFix} disabled={!translatedSrt || isLoading}>
        <UsersIcon /> Sửa lỗi giới tính
      </ToolbarButton>
      
      <div className="w-px h-6 bg-gray-600"></div>

      <ToolbarButton onClick={onExport} disabled={!fixedSrt || isLoading}>
        <DownloadIcon /> Xuất SRT đã sửa
      </ToolbarButton>
    </div>
  );
};

export default Toolbar;
