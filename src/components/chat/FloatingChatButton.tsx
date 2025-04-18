
import React from 'react'
import { Star } from 'lucide-react'
import { cn } from "@/lib/utils"

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
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#D946EF] text-white shadow-lg",
        "hover:bg-[#D946EF]/90 transition-colors duration-200",
        "flex items-center justify-center",
        className
      )}
      aria-label="Abrir chat de IA"
    >
      <Star className="h-6 w-6" />
    </button>
  )
}

export default FloatingChatButton

