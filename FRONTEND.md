# Daily Recipe WhatsApp Bot — Admin Frontend

## COMPORTAMENTO DO ASSISTENTE

- Todas as respostas, explicações e perguntas de esclarecimento devem ser em **português brasileiro (pt-BR)**, independentemente do idioma usado na pergunta;
- Todo o código-fonte, nomes de variáveis, funções, comentários, arquivos e estrutura de pastas devem estar em **inglês**.

---

## OBJETIVO

Criar um frontend administrativo em React.js com TypeScript para gerenciar o backend `daily-recipe-whatsapp-bot`, permitindo operações de CRUD para todos os módulos, envio de mensagens via WhatsApp e geração de receitas via IA.

---

## LOCALIZAÇÃO DO PROJETO

O frontend deve ser criado em:
```
/Volumes/projects-mac-volume/software-projects/sigaocaue-projects/javascript/reactjs/daily-receipe-whatsapp-bot-admin-frontend
```

O backend está localizado em:
```
/Volumes/projects-mac-volume/software-projects/sigaocaue-projects/python/daily-receipe-whatsapp-bot
```

---

## STACK TECNOLÓGICA

- **Node.js**: `v24.13.1` (usar o `.nvmrc` com esse valor na raiz do projeto)
- **Framework**: React.js com **Vite** — escolhido por ser o mais leve, simples e rápido para SPAs administrativos sem necessidade de SSR
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: shadcn/ui (sobre Tailwind, sem overhead de bibliotecas pesadas)
- **Roteamento**: React Router v6
- **Requisições HTTP**: Axios com instância configurada apontando para o backend
- **Estado global**: Zustand (leve e simples)
- **Formulários**: React Hook Form + Zod para validação
- **Notificações**: Sonner (toasts leves)
- **Ícones**: Lucide React

---

## Setup

```bash
# Usar a versão correta do Node
nvm use

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar em modo desenvolvimento
npm run dev
```

## Variáveis de Ambiente

| Variável | Descrição | Default |
|---|---|---|
| `VITE_API_BASE_URL` | URL base da API backend | `http://localhost:8000` |

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Linting |

## Estrutura

```
src/
├── api/          # Camada de API (axios)
├── components/
│   ├── layout/   # Sidebar, Header, Layout
│   └── ui/       # Componentes shadcn/ui
├── lib/          # Utilitários (cn)
├── pages/        # Páginas por feature
│   ├── proteins/
│   ├── recipes/
│   ├── phoneNumbers/
│   └── messages/
├── store/        # Zustand stores
├── types/        # Interfaces TypeScript
├── App.tsx       # Rotas
├── main.tsx      # Entry point
└── index.css     # Tailwind + CSS variables
```

## Funcionalidades

- **Dashboard** — Resumo com contagens e últimos envios
- **Proteínas** — CRUD completo com toggle ativo/inativo
- **Receitas** — CRUD completo, geração via IA, multi-select de proteínas
- **Números de Telefone** — CRUD completo com validação E.164
- **Mensagens** — Enviar receita do dia + logs com filtro por status
