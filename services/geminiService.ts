import { GoogleGenAI } from "@google/genai";
import { NORMALIZE_MODEL, TRANSLATE_MODEL, FIX_MODEL } from '../constants';
import { getNormalizationPrompt, getTranslationPrompt, getCharacterAnalysisPrompt, getGenderFixPrompt } from '../constants';

const callGemini = async (apiKey: string, model: string, prompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        if (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('429')) {
            throw new Error("Đã đạt đến hạn ngạch API. Bạn đã sử dụng hết lượt yêu cầu miễn phí cho hôm nay. Vui lòng thử lại sau hoặc nâng cấp gói cước của bạn.");
        }
        if (error.message.toLowerCase().includes('api key not valid')) {
            throw new Error("API Key không hợp lệ. Vui lòng kiểm tra lại và lưu key mới.");
        }
        throw new Error(error.message);
    }
    throw new Error("Một lỗi không xác định đã xảy ra khi gọi Gemini API.");
  }
};

export interface ApiKeyCheckResult {
    isValid: boolean;
    message: string;
}

export const checkApiKey = async (apiKey: string): Promise<ApiKeyCheckResult> => {
    if (!apiKey) {
        return { isValid: false, message: "API Key không được để trống." };
    }
    try {
        const ai = new GoogleGenAI({ apiKey });
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'hi',
             config: {
                maxOutputTokens: 1,
                thinkingConfig: { thinkingBudget: 0 },
            }
        });
        return { isValid: true, message: "API Key hợp lệ và hoạt động tốt." };
    } catch (error) {
        console.error("API Key check failed:", error);
        if (error instanceof Error) {
            if (error.message.toLowerCase().includes('api key not valid')) {
                return { isValid: false, message: "API Key không hợp lệ. Vui lòng kiểm tra lại." };
            }
            if (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('429')) {
                return { isValid: false, message: "API Key hợp lệ, nhưng đã đạt đến hạn ngạch sử dụng." };
            }
            return { isValid: false, message: `Lỗi khi kiểm tra: ${error.message}`};
        }
        return { isValid: false, message: "Một lỗi không xác định đã xảy ra khi kiểm tra API key." };
    }
};


export const normalizeText = (apiKey: string, text: string): Promise<string> => {
    const prompt = getNormalizationPrompt(text);
    return callGemini(apiKey, NORMALIZE_MODEL, prompt);
};

export const translateText = (apiKey: string, text: string): Promise<string> => {
    const prompt = getTranslationPrompt(text);
    return callGemini(apiKey, TRANSLATE_MODEL, prompt);
};

export const analyzeCharacters = async (apiKey: string, text: string) => {
    const prompt = getCharacterAnalysisPrompt(text);
    const result = await callGemini(apiKey, FIX_MODEL, prompt);
    try {
        const cleanedResult = result.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanedResult);
    } catch (e) {
        console.error("Failed to parse character analysis JSON:", e, "Raw result:", result);
        throw new Error("Không thể phân tích danh sách nhân vật từ AI.");
    }
};

export const fixGenderInText = (apiKey:string, text: string, characterJson: string): Promise<string> => {
    const prompt = getGenderFixPrompt(text, characterJson);
    return callGemini(apiKey, FIX_MODEL, prompt);
};