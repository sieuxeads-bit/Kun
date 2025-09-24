
import React, { useState, useEffect } from 'react';
import type { Character } from '../types';
import { Gender } from '../types';

interface CharacterEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (characters: Character[]) => void;
  initialCharacters: Character[];
  isLoading: boolean;
}

const CharacterEditorModal: React.FC<CharacterEditorModalProps> = ({ isOpen, onClose, onConfirm, initialCharacters, isLoading }) => {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);

  useEffect(() => {
    setCharacters(initialCharacters);
  }, [initialCharacters]);

  if (!isOpen) return null;

  const handleGenderChange = (index: number, newGender: Gender) => {
    const updatedCharacters = [...characters];
    updatedCharacters[index].gender = newGender;
    setCharacters(updatedCharacters);
  };

  const handleConfirmClick = () => {
    onConfirm(characters);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-white">Xác nhận giới tính nhân vật</h2>
        <p className="text-gray-400 mb-6 text-sm">AI đã xác định các nhân vật sau. Vui lòng kiểm tra và chỉnh sửa lại giới tính cho chính xác trước khi tiếp tục.</p>
        
        <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
          {characters.map((char, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
              <span className="font-medium text-gray-200">{char.name}</span>
              <div className="flex items-center space-x-2">
                {[Gender.Male, Gender.Female, Gender.Unknown].map(gender => (
                  <button
                    key={gender}
                    onClick={() => handleGenderChange(index, gender)}
                    className={`px-3 py-1 text-xs rounded-full transition ${
                      char.gender === gender
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-500 text-white transition disabled:opacity-50"
          >
            Huỷ
          </button>
          <button
            onClick={handleConfirmClick}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận & Sửa lỗi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterEditorModal;
