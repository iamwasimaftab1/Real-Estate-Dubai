
import { GoogleGenAI, Type } from "@google/genai";
import { LeadData, MarketInsight } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getInvestmentStrategy(lead: LeadData) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a high-level real estate investment strategy for a client in the UAE.
        Interest: ${lead.propertyType}
        Budget: ${lead.budget}
        Client: ${lead.email} / ${lead.mobile}
        
        Focus on:
        1. Top areas for ${lead.propertyType} in Dubai.
        2. Expected ROI percentage for this specific category (Ensure you suggest returns between 8% and 12%).
        3. Market sentiment for ${lead.propertyType} in 2024.
        Keep it professional, high-end, and enticing.`,
        config: {
          systemInstruction: "You are a senior UAE Real Estate Investment Consultant for Realty UAE. Provide concise, high-value advice. Always target a premium 8-12% ROI in your recommendations.",
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini strategy error:", error);
      return "Unable to generate custom strategy at this moment. Our team will contact you shortly.";
    }
  }

  async getMarketSummary(): Promise<MarketInsight[]> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `List 5 top performing investment districts in Dubai (Palm Jumeirah, Dubai Marina, Business Bay, JVC, Dubai Hills). 
        Include ROI (between 8.0 and 12.0), trend, and avgPrice. 
        Assign approximate coordinates (x: 0-100, y: 0-100) where x is west-to-east and y is north-to-south.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                area: { type: Type.STRING },
                roi: { type: Type.NUMBER },
                trend: { type: Type.STRING },
                avgPrice: { type: Type.STRING },
                description: { type: Type.STRING },
                coordinates: {
                  type: Type.OBJECT,
                  properties: {
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER }
                  },
                  required: ["x", "y"]
                }
              },
              required: ["id", "area", "roi", "trend", "avgPrice", "coordinates"]
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      return [
        { id: 'palm', area: "Palm Jumeirah", roi: 10.5, trend: "up", avgPrice: "AED 5M", coordinates: { x: 20, y: 45 }, description: "Iconic luxury island destination with high capital appreciation." },
        { id: 'marina', area: "Dubai Marina", roi: 8.8, trend: "up", avgPrice: "AED 2M", coordinates: { x: 15, y: 60 }, description: "Vibrant waterfront community with strong rental demand." },
        { id: 'bbay', area: "Business Bay", roi: 9.2, trend: "stable", avgPrice: "AED 1.5M", coordinates: { x: 55, y: 30 }, description: "Commercial hub of the city with luxury residential towers." },
        { id: 'jvc', area: "JVC", roi: 11.4, trend: "up", avgPrice: "AED 850k", coordinates: { x: 40, y: 70 }, description: "Family-oriented community offering high rental yields." },
        { id: 'dhills', area: "Dubai Hills", roi: 8.2, trend: "up", avgPrice: "AED 3.5M", coordinates: { x: 50, y: 55 }, description: "Premium green community with a championship golf course." }
      ];
    }
  }
}

export const geminiService = new GeminiService();
