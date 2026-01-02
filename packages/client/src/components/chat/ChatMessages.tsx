import ReactMarkDown from "react-markdown";

export type Message = {
    role: 'user' | 'bot';
    content: string;
}
    
type Props = {
    messages: Message[];
}

const ChatMessages = ({ messages }: Props) => {
  return (
    <div className="flex flex-col gap-3">
            {messages.map((message, index) => (
                <p key={index} className={'px-3 py-1 max-w-md rounded-lg' +
                    (message.role === 'user' 
                    ? ' bg-blue-600 text-white self-end'  
                    : ' bg-gray-200 text-black self-start')}>

                    <ReactMarkDown>{message.content}</ReactMarkDown>
                </p>
            ))}
    </div>
  )
}


export default ChatMessages