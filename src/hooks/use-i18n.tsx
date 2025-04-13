
import { useTranslation } from "react-i18next";

export function useI18n() {
  const { i18n } = useTranslation();
  return {
    locale: i18n.language
  };
}
