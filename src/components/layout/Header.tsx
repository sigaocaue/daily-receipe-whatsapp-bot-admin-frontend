import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/proteins": "Proteínas",
  "/recipes": "Receitas",
  "/phone-numbers": "Números de telefones",
  "/messages": "Enviar uma receita pelo WhatsApp",
  "/messages/logs": "Logs de Mensagens",
};

const defaultTitle = "Daily Recipe - Admin";

export function Header() {
  const { pathname } = useLocation();
  const title = titles[pathname] || defaultTitle;

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <header className="flex h-14 items-center border-b px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
