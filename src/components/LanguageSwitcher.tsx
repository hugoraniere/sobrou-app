
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  
  const currentLanguage = i18n.language;
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };
  
  const getLanguageFlag = (code: string) => {
    switch(code) {
      case 'en':
        return '🇺🇸';
      case 'pt-BR':
        return '🇧🇷';
      default:
        return '🌐';
    }
  };
  
  const getLanguageName = (code: string) => {
    switch(code) {
      case 'en':
        return 'ENG';
      case 'pt-BR':
        return 'PT-BR';
      default:
        return code.toUpperCase();
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          {getLanguageFlag(currentLanguage)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          className={currentLanguage === 'en' ? 'bg-accent' : ''}
          onClick={() => changeLanguage('en')}
        >
          <span className="mr-2">🇺🇸</span> ENG
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={currentLanguage === 'pt-BR' ? 'bg-accent' : ''}
          onClick={() => changeLanguage('pt-BR')}
        >
          <span className="mr-2">🇧🇷</span> PT-BR
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
