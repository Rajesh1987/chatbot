import { useRef, useState } from "react";
import axios from "axios";
import TypingIndicator from "./TypingIndicator";
import ChatMessages from "./ChatMessages";
import ChatInput, { type ChatFormData } from "./ChatInput";
import popSound from '@/assets/sounds/pop.mp3';
import notifiucationSound from '@/assets/sounds/notification.mp3'; 

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notifiucationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
    message: string;
}

type Message = {
    role: 'user' | 'bot';
    content: string;
}

const ChatBot = () => {

    const [messages, setMessages] = useState<Message[]>([]);

    const [isBotTyping, setIsBotTyping] =  useState(false);

    const conversationId = useRef(crypto.randomUUID());



    const onSubmit = async ({prompt}: ChatFormData) => {
        setMessages(prev => [...prev, { role: 'user', content: prompt }]);
        setIsBotTyping(true);
        popAudio.play();
         console.log("before making post call", conversationId.current);
        const { data } = await axios.post<ChatResponse>('/api/chat', { 
            prompt,
            conversationId: conversationId.current
        }); 
        
         console.log("Conversation ID:", conversationId.current);
        setMessages(prev => [...prev, { role: 'bot', content: data.message }]);   
        setIsBotTyping(false);
        notificationAudio.play();
        console.log(data.message);
    }

  return (
    <div className="flex flex-col h-full">
        <div className='flex flex-col flex-1 gap-3 mb-10 overflow-y-auto'>

            <ChatMessages messages={messages} />
            { isBotTyping && <TypingIndicator /> }

        </div>
        <ChatInput onSubmit={onSubmit} />
    </div>
  )
}
export default ChatBot