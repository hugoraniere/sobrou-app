
import React from 'react'
import { X, Send } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import { useDashboardData } from '@/hooks/useDashboardData'
import { Transaction } from '@/services/transactions'
import { PiStarFourFill } from "react-icons/pi"
import { transactionQueryService } from '@/services/transactions/transactionQueryService'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const SUGGESTED_QUESTIONS = [
  "Como estão minhas finanças este mês?",
  "Qual categoria gastei mais?",
  "Quais são minhas metas de economia?",
  "Me ajude a economizar dinheiro"
]

const ChatWindow = ({ isOpen, onClose, className }: ChatWindowProps) => {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const { transactions } = useDashboardData()
  const [localTransactions, setLocalTransactions] = React.useState([])

  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Usando o serviço diretamente
        const data = await transactionQueryService.getTransactions();
        setLocalTransactions(data);
        console.log("Fetched transactions:", data.length);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (isOpen && user) {
      fetchTransactions();
    }
  }, [isOpen, user]);

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

    const transactionsToSend = transactions.length > 0 ? transactions : localTransactions;
    console.log("Sending transactions to API:", transactionsToSend.length);

    try {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Analisando suas finanças...' }])

      const { data, error } = await supabase.functions.invoke('process-chat', {
        body: { 
          prompt: userMessage, 
          userId: user?.id,
          transactions: transactionsToSend 
        }
      })

      if (error) {
        console.error('Error from Edge Function:', error);
        throw new Error(error.message || 'Erro ao processar mensagem');
      }

      if (!data || !data.response) {
        throw new Error('Resposta inválida do servidor');
      }

      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error processing chat:', error);
      toast.error('Erro ao processar mensagem');
      setMessages(prev => [...prev.slice(0, -1), { 
        role: 'assistant', 
        content: 'Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente mais tarde.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (question: string) => {
    setInput(question)
  }

  if (!isOpen) return null

  return (
    <div className={cn(
      "fixed z-50 bg-white shadow-xl border border-gray-200",
      isMobile 
        ? "bottom-24 left-4 right-4 w-auto rounded-xl"
        : "bottom-24 right-6 w-96 rounded-lg",
      className
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <PiStarFourFill className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-700">Chat de IA</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Fechar chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <p className="text-gray-500 text-center">
              Como posso ajudar você hoje? Aqui algumas sugestões:
            </p>
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  className="w-full text-left p-3 text-sm rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "max-w-[85%] rounded-lg p-4 whitespace-pre-line leading-relaxed",
                message.role === 'user'
                  ? "ml-auto bg-primary text-white"
                  : "bg-gray-100 text-gray-700"
              )}
            >
              {message.content}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            className="flex-1 rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={cn(
              "rounded-lg bg-primary p-2 text-white",
              "hover:bg-primary-hover transition-colors duration-200",
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
