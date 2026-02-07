
// @ts-nocheck
import { GoogleGenAI, Type } from "@google/genai";
import { AISuggestion } from "../types";

// Initialize with named parameter as per @google/genai guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper function to convert image URL to base64 (for simulation)
async function urlToBase64(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Failed to fetch or convert image for Gemini", e);
        return "";
    }
}

export const getProactiveSuggestion = async (
  imageUrl: string,
  context: string,
  availableCams: {id: string, name: string}[]
): Promise<AISuggestion | null> => {
  if (!imageUrl) return null;

  try {
    const imageDataBase64 = await urlToBase64(imageUrl);
    if (!imageDataBase64) return null;
    
    const cameraList = availableCams.map(c => `'${c.id}' (${c.name})`).join(', ');

    // Use ai.models.generateContent with model name and content parts directly.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: imageDataBase64 } },
          { text: `Contexto del partido: ${context}. Cámaras disponibles: [${cameraList}]. Analiza este frame de una transmisión deportiva. Si detectas un momento clave (posible gol, falta, contraataque, jugador importante con el balón), genera una sugerencia de producción. De lo contrario, devuelve null.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, enum: ['CUT', 'REPLAY', 'COMMENTARY', 'INFO'], description: 'Tipo de acción sugerida.' },
                reason: { type: Type.STRING, description: 'Breve explicación de por qué se sugiere la acción (en español).'},
                targetId: { type: Type.STRING, description: 'ID de la cámara a la que cortar, si aplica.'},
                duration: { type: Type.NUMBER, description: 'Duración en segundos para un replay.'}
            },
            propertyOrdering: ["type", "reason", "targetId", "duration"]
        },
        systemInstruction: "Eres un asistente de dirección de TV experto en deportes. Tu trabajo es identificar momentos cruciales y sugerir acciones de producción en un formato JSON estricto. Si no hay nada interesante, tu única respuesta debe ser `null`."
      }
    });

    // Access the .text property directly (not a method).
    const jsonText = response.text?.trim();
    if (jsonText && jsonText !== 'null') {
        try {
            return JSON.parse(jsonText) as AISuggestion;
        } catch (e) {
            console.error("Failed to parse AI response JSON", jsonText);
        }
    }
    return null;

  } catch (error) {
    console.error("Gemini Proactive Suggestion Error:", error);
    return null; // Fail silently to not interrupt production
  }
};


export const generateTacticalAnalysis = async (
  imageDataBase64: string,
  context: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageDataBase64
            }
          },
          {
            text: `Contexto: ${context}. Analiza este cuadro de una transmisión deportiva. Identifica la formación, posiciones clave o problemas técnicos de la imagen (iluminación, desenfoque). Responde en Español, sé breve y profesional (menos de 50 palabras).`
          }
        ]
      },
      config: {
        systemInstruction: "Eres un asistente experto en dirección técnica de deportes para TV. Responde siempre en Español."
      }
    });

    return response.text || "No hay análisis disponible.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        return "Error: La API Key de Gemini no es válida. Revisa la configuración."
    }
    return "Fallo en el análisis por red o error de API.";
  }
};

export const generateStudioAdvice = async (context: string): Promise<string[]> => {
    const fallbackTips = [
        "Ángulo de Cámara: Coloca el lente a la altura de los ojos para autoridad.",
        "Iluminación: Usa luz principal a 45 grados para dar profundidad.",
        "Postura: Siéntate derecho para transmitir energía a la audiencia.",
        "Audio: Mantén el micrófono a 15-30cm de distancia de la boca."
    ];
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Proporciona 4 consejos técnicos breves y accionables para una transmisión en vivo de: ${context}. Enfócate en postura, iluminación y cámara. Formato: Array JSON de strings. Responde en Español.`,
            config: {
                 responseMimeType: "application/json",
                 responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                 }
            }
        });
        const text = response.text || "[]";
        try {
            return JSON.parse(text);
        } catch (e) {
            return fallbackTips;
        }
    } catch (error) {
        console.error("Gemini Studio Advice Error:", error);
        return fallbackTips;
    }
};

export const generateSetImageDescription = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Genera una descripción visual corta y vívida (solo palabras clave en inglés para el generador de imágenes) basada en esta idea de set virtual: ${prompt}.`,
        });
        return response.text || "abstract studio background";
    } catch (error) {
        return "blue studio background";
    }
};
