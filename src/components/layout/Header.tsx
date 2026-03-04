import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";

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
  const title = getPageTitle(pathname);
  const toggleMobileSidebar = useAppStore((s) => s.toggleMobileSidebar);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <header className="flex h-14 items-center gap-2 border-b px-4 sm:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir menu</span>
      </Button>
      <h1 className="truncate text-base font-semibold sm:text-xl">{title}</h1>
    </header>
  );
}

function getPageTitle(pathname: string) {
  if (pathname === "/recipes/new") return "Nova Receita";
  if (/^\/recipes\/[^/]+\/edit$/.test(pathname)) return "Editar Receita";
  
  if (pathname === "/proteins/new") return "Nova Proteína";
  if (/^\/proteins\/[^/]+\/edit$/.test(pathname)) return "Editar Proteína";
  
  if (pathname === "/phone-numbers/new") return "Novo Número";
  if (/^\/phone-numbers\/[^/]+\/edit$/.test(pathname)) return "Editar Número";

  return titles[pathname] || defaultTitle;
}
