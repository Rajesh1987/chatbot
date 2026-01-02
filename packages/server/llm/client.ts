import OpenAI from "openai";
import { InferenceClient } from "@huggingface/inference";
import { Ollama } from 'ollama';

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

const ollamaClient = new Ollama();

// Initialize OpenAI client
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

type GenerateTextOptions = {
    model?: string;
    prompt: string;
    instructions?: string;
    temperature?: number;
    maxTokens?: number;
    previousResponseId?: string;
};

type LLMResponse = {
    id: string;
    text: string;
};

export const llmClient = {
    async generateText({
        model = 'gpt-4o-mini',
        prompt,
        instructions,
        temperature = 0.2,
        maxTokens = 300,
        previousResponseId     
    }: GenerateTextOptions ): Promise<LLMResponse> {   
    const response = await client.responses.create({
         model,
         instructions,
         input: prompt,
         temperature,
         max_output_tokens: maxTokens,
         previous_response_id: previousResponseId,
     });
     return {
         id: response.id,
         text: response.output_text
     }; 
    },

    summarizeText: async (text: string): Promise<string> => {   
        const summary = await inferenceClient.summarization({
            model: "facebook/bart-large-cnn",
            inputs: text,
            provider: "hf-inference",
        });
        return summary.summary_text;
    },

    ollamaSummarizeText: async (text: string): Promise<string> => {   
        const response = await ollamaClient.chat({
            model: 'tinyllama',
            messages: [
                { role: 'system', content: 'You are a helpful assistant that summarizes text.' },
                { role: 'user', content: `Summarize the following text:\n\n${text}` }
            ],
        });
        return response.message.content;
    }   
}