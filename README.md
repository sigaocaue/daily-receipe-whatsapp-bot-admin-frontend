# Daily Recipe WhatsApp Bot — Admin Frontend

![version](https://img.shields.io/badge/version-1.0.0-blue)
![license](https://img.shields.io/badge/license-MIT-brightgreen)

Painel administrativo da solução Daily Recipe WhatsApp Bot, criado para equipes que precisam visualizar estatísticas, manter catálogos e acionar campanhas diárias de receitas via WhatsApp com suporte a geração automática ou importação.

## Visão geral

A aplicação conecta-se à API do backend para oferecer uma única interface onde gestores e times podem operar módulos de proteínas, receitas, números de telefone e envio de mensagens. O painel também mostra dados resumidos no **dashboard**, permite gerar receitas com inteligência artificial, importar receitas do TudoGostoso e revisar os logs de envio para entender quais receitas foram distribuídas.

## Funcionalidades principais

- **Dashboard de operações** com cartões de contagem de proteínas, receitas, telefones e mensagens, botões de geração automática e disparo imediato de receitas.
- **Proteínas**: CRUD completo com alternância de status para habilitar/desabilitar ingredientes disponíveis nas receitas.
- **Receitas**: listagem paginada, criação/edição manual, visualização de detalhes, geração via IA, importação de receitas públicas (TudoGostoso) e associação de proteínas.
- **Números de telefone**: cadastro, edição, exclusão e indicadores de status (ativo/inativo) com formatação visual por DDI.
- **Mensagens**: envio de mensagens com receita do dia e acompanhamento dos **logs** de entrega retornados pela API.
- **Layout responsivo** utilizando sidebar colapsável, cabeçalho contextual e componentes shadcn/ui para consistência visual.

## Demonstração

1. Garanta que o backend do Daily Recipe WhatsApp Bot esteja acessível (padrão: `http://localhost:8000`).
2. Execute `npm run dev` para iniciar o servidor Vite e abra `http://localhost:5173` para ver o painel.
3. Use o menu lateral para navegar por proteínas, receitas, telefones e mensagens; os botões do dashboard disparam operações de geração e envio.

## Tecnologias

| Tipo | Ferramentas principais |
| --- | --- |
| Linguagem | React 19 + TypeScript 5.7 |
| Build | Vite 6 + TypeScript build (`tsc -b`) |
| Estado | Zustand |
| Estilização | Tailwind CSS 3.4 + Tailwind CSS Animate + shadcn/ui |
| UI Kit | Componentes Radix UI + Lucide Icons + Sonner |
| Rooftop API | Axios com interceptores globais |

## Organização do projeto

- `src/main.tsx`, `src/App.tsx`: entrada e roteamento (React Router v6) envolvendo o layout principal.
- `src/components/layout`: sidebar, cabeçalho e componentes UI reutilizáveis inspirados no template shadcn.
- `src/api`: abstrações Axios para `proteins`, `recipes`, `phone-numbers` e `messages`, incluindo geração via IA e importação de receitas.
- `src/pages`: páginas segmentadas por área funcional (`Dashboard`, `proteins`, `recipes`, `phoneNumbers`, `messages`).
- `src/store/useAppStore.ts`: estado global simples para controlar menu lateral e versão mobile.
- `src/lib/utils.ts`, `src/components/ui`: helpers e componentes de interface (botões, tabelas, diálogos, etc.).

## Licença

Este repositório está sob a licença **MIT**. Veja o arquivo `LICENSE` para o texto completo.
