
import React from 'react'
import { cn } from "@/lib/utils"
import { Asterisk } from 'lucide-react';

interface FloatingChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const FloatingChatButton = ({ isOpen, onClick, className }: FloatingChatButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-purple-500 text-white shadow-lg",
        "hover:bg-purple-600 transition-colors duration-200",
        "flex items-center justify-center",
        className
      )}
      aria-label="Abrir chat de IA"
    >
      <Asterisk className="w-6 h-6" strokeWidth={2.5} />
    </button>
  )
}

export default FloatingChatButton
