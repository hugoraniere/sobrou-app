
import React from 'react'
import { cn } from "@/lib/utils"
import { PiStarFourFill } from "react-icons/pi";

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
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#7C3AED] text-white shadow-lg",
        "hover:bg-[#6D28D9] transition-colors duration-200",
        "flex items-center justify-center",
        className
      )}
      aria-label="Abrir chat de IA"
    >
      <PiStarFourFill className="w-6 h-6" />
    </button>
  )
}

export default FloatingChatButton
