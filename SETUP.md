# Setup — Daily Recipe WhatsApp Bot Admin Frontend

Guia passo a passo para configurar e executar o projeto localmente.

## Pré-requisitos

- **Node.js** v24+ (confira o `.nvmrc`)
- **npm** (incluído com Node.js)
- **Backend** do Daily Recipe WhatsApp Bot rodando localmente (padrão: `http://localhost:8000`)

## 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd daily-receipe-whatsapp-bot-admin-frontend
```

## 2. Configurar versão do Node

Se estiver usando [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install
nvm use
```

Isso vai usar a versão definida no `.nvmrc` (v24.13.1).

## 3. Instalar dependências

```bash
npm install
```

## 4. Configurar variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

### Variáveis

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_BASE_URL` | URL base da API backend | `http://localhost:8000` |

> **Nota:** A URL base já inclui o prefixo `/api/v1/` na configuração padrão do `.env`. Ajuste conforme a configuração do seu backend.

## 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O Vite irá iniciar o servidor de desenvolvimento com hot reload. Acesse no navegador o endereço exibido no terminal (geralmente `http://localhost:5173`).

## 6. Build de produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`. Para testar o build localmente:

```bash
npm run preview
```

## Configuração do Backend

Este frontend depende do backend **Daily Recipe WhatsApp Bot** rodando e acessível na URL configurada em `VITE_API_BASE_URL`.

Certifique-se de que o backend está:
1. Instalado e configurado
2. Rodando na porta esperada (padrão: 8000)
3. Com as rotas da API (`/api/v1/`) acessíveis

Consulte o repositório do backend para instruções de setup.

## Solução de Problemas

### Erro de conexão com a API

- Verifique se o backend está rodando
- Confirme a URL em `.env` (`VITE_API_BASE_URL`)
- Verifique se há problemas de CORS no backend

### Versão do Node incompatível

```bash
nvm install
nvm use
node -v  # Deve mostrar v24.x
```

### Dependências desatualizadas

```bash
rm -rf node_modules package-lock.json
npm install
```

## Estrutura de Pastas (Referência)

```
.
├── public/               # Arquivos estáticos
├── src/                  # Código-fonte
│   ├── api/              # Chamadas HTTP
│   ├── components/       # Componentes React
│   │   ├── layout/       # Layout principal
│   │   └── ui/           # Componentes shadcn/ui
│   ├── pages/            # Páginas da aplicação
│   ├── store/            # Estado global (Zustand)
│   ├── types/            # Tipos TypeScript
│   └── lib/              # Utilitários
├── .env.example          # Exemplo de variáveis de ambiente
├── .nvmrc                # Versão do Node
├── components.json       # Config shadcn/ui
├── tailwind.config.ts    # Config Tailwind CSS
├── tsconfig.json         # Config TypeScript
├── vite.config.ts        # Config Vite
└── package.json          # Dependências e scripts
```
