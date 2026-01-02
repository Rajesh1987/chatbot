import z from "zod";
import { chatService } from "../services/chat.service";
import type { Request, Response } from "express";


// Implementation of chat request schema validation
const chatRequestSchema = z.object({
   prompt: z.string()
      .trim()
      .min(1, 'Prompt cannot be empty')
      .max(1000, 'Prompt is too long and can be at most 1000 characters'),
   conversationId: z.string().uuid().optional(),
});

// Public controller for chat requests
export const chatController = {
    async handleChatRequest(req: Request, res: Response) {
        const parseResult = chatRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json(parseResult.error.format());
        }
        try {
            console.log('Received chat request:', req.body);
            const { prompt, conversationId } = req.body;
            const response = await chatService.sendMesage(prompt, conversationId || crypto.randomUUID());
            res.json({ message: response.message });
        } catch (error) {
            res.status(500).json({ error: 'Error processing chat request' });
        }
    }
};