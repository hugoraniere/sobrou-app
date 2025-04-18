
import React from 'react'
import { X, Send } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const ChatWindow = ({ isOpen, onClose, className }: ChatWindowProps) => {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('process-chat', {
        body: { prompt: userMessage, userId: user?.id }
      })

      if (error) {
        console.error('Error from Edge Function:', error);
        throw new Error(error.message || 'Erro ao processar mensagem');
      }

      if (!data || !data.response) {
        throw new Error('Resposta inválida do servidor');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error processing chat:', error);
      toast.error('Erro ao processar mensagem');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente mais tarde.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={cn(
      "fixed bottom-24 right-6 z-50 w-96 rounded-lg bg-white shadow-xl",
      "border border-gray-200",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-700">Chat de IA</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Fechar chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-gray-500 text-center py-4">
            Faça uma pergunta sobre suas finanças
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "max-w-[85%] rounded-lg p-3",
              message.role === 'user'
                ? "ml-auto bg-[#7C3AED] text-white"
                : "bg-gray-100 text-gray-700"
            )}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            className="flex-1 rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={cn(
              "rounded-lg bg-[#7C3AED] p-2 text-white",
              "hover:bg-[#6D28D9] transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={!input.trim() || isLoading}
            aria-label="Enviar mensagem"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatWindow
