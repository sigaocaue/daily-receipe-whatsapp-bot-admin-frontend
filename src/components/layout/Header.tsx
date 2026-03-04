import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/proteins": "Proteínas",
  "/recipes": "Receitas",
  "/phone-numbers": "Números de Telefone",
  "/messages": "Enviar Mensagens",
  "/messages/logs": "Logs de Mensagens",
};

export function Header() {
  const { pathname } = useLocation();
  const title = titles[pathname] || "Daily Recipe Admin";

  return (
    <header className="flex h-14 items-center border-b px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
