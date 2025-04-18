
import React from 'react'
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
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
    </button>
  )
}

export default FloatingChatButton
