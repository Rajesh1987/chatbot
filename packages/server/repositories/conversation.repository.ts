// In-memory storage for conversations - Implementation detail
const conversations: Map<string, string> = new Map();

export const conversationRespository = {

     saveConversation(conversationId: string, responseId: string): void {
          conversations.set(conversationId, responseId);
    }, 
    
    getConversationResponseId(conversationId: string): string | undefined {
     return conversations.get(conversationId);
}
};