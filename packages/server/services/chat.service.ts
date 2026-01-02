import fs from 'fs';
import path from 'path';
import { conversationRespository } from "../repositories/conversation.repository"
import templates from '../prompts/chatbot.txt'
import { llmClient } from '../llm/client';

const parkInfo = fs.readFileSync(path.join(__dirname, '..', 'prompts', 'WonderWorld.md'), 'utf-8'); 
const instructions = templates.replace('{{PARK_INFO}}', parkInfo);   

type chatResponse = {
   id: string;
   message: string;
};

// Leaky abstraction for chat service
export const chatService = {
    async sendMesage(prompt: string, conversationId: string): Promise<chatResponse> {
        // Logic to send message using OpenAI client and manage conversation
        // This is a placeholder for actual implementation
        const response = await llmClient.generateText({
                 model: 'gpt-4o-mini',
                 instructions,
                 prompt,
                 temperature: 0.2,
                 maxTokens: 200,
                 previousResponseId: conversationRespository.getConversationResponseId(conversationId),
              });
              
        conversationRespository.saveConversation(conversationId, response.id);
        return {
            id: response.id,
            message: response.text,
        };
    }
};