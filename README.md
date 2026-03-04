# Daily Recipe WhatsApp Bot — Admin Frontend

Painel administrativo para gerenciamento do [Daily Recipe WhatsApp Bot](https://github.com/sigaocaue), permitindo operações CRUD em todos os módulos, envio de mensagens via WhatsApp e geração de receitas com IA.

## Visão Geral

Este frontend é uma SPA (Single Page Application) construída com React + TypeScript que se conecta à API backend do bot de receitas diárias. Através dele é possível:

- **Dashboard** — Visualizar estatísticas (proteínas, receitas, telefones, mensagens) e ações rápidas
- **Proteínas** — Gerenciar proteínas disponíveis para receitas (CRUD + ativar/desativar)
- **Receitas** — Gerenciar receitas manualmente ou gerar com IA, associar proteínas
- **Telefones** — Cadastrar e gerenciar números de WhatsApp dos destinatários
- **Mensagens** — Enviar receitas via WhatsApp (aleatória, existente ou personalizada) e visualizar histórico de envios

## Tech Stack

| Categoria | Tecnologia |
|-----------|------------|
| Framework | React 19 + TypeScript 5.7 |
| Build | Vite 6 |
| Estilização | Tailwind CSS 3.4 + shadcn/ui (Radix UI) |
| Roteamento | React Router v6 |
| Estado global | Zustand |
| Formulários | React Hook Form + Zod |
| HTTP | Axios |
| Ícones | Lucide React |
| Notificações | Sonner |

## Estrutura do Projeto

```
src/
├── api/                  # Camada HTTP (Axios)
│   ├── axios.ts          # Instância com interceptors
│   ├── recipes.ts        # CRUD de receitas + geração IA
│   ├── proteins.ts       # CRUD de proteínas
│   ├── phoneNumbers.ts   # CRUD de telefones
│   └── messages.ts       # Envio e logs de mensagens
├── components/
│   ├── layout/           # Layout, Sidebar, Header
│   └── ui/               # Componentes shadcn/ui
├── pages/                # Páginas por módulo
│   ├── Dashboard.tsx
│   ├── proteins/
│   ├── recipes/
│   ├── phoneNumbers/
│   └── messages/
├── store/                # Estado global (Zustand)
├── types/                # Interfaces TypeScript
├── lib/                  # Utilitários (cn)
├── App.tsx               # Definição de rotas
└── main.tsx              # Entry point
```

## Endpoints da API

| Módulo | Endpoints |
|--------|-----------|
| Receitas | `GET/POST /recipes`, `GET/PUT/DELETE /recipes/{id}`, `POST /recipes/generate` |
| Proteínas | `GET/POST /proteins`, `GET/PUT/DELETE /proteins/{id}` |
| Telefones | `GET/POST /phone-numbers`, `GET/PUT/DELETE /phone-numbers/{id}` |
| Mensagens | `POST /messages/send`, `GET /messages/logs`, `GET /messages/logs/{id}` |

## Scripts Disponíveis

```bash
npm run dev       # Servidor de desenvolvimento (Vite)
npm run build     # Build de produção (TypeScript + Vite)
npm run preview   # Preview do build de produção
npm run lint      # Verificação com ESLint
```

## Licença

Projeto privado — todos os direitos reservados.
