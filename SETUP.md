# Setup técnico — Daily Recipe WhatsApp Bot Admin Frontend

## 1. Pré-requisitos

- **Node.js** 24.13.1 (conforme `.nvmrc`; o projeto utiliza recursos modernos do Vite 6 e React 19).
- **npm** compatível com a versão do Node selecionada.
- **Backend do Daily Recipe WhatsApp Bot** rodando e com as rotas expostas (`/recipes`, `/proteins`, `/phone-numbers`, `/messages`) acessíveis na URL informada em `VITE_API_BASE_URL`.

## 2. Instalação

```bash
npm install
```

## 3. Variáveis de ambiente

1. Copie o exemplo:

   ```bash
   cp .env.example .env
   ```

2. Ajuste a variável disponível:

   | Variável | Descrição | Exemplo |
   | --- | --- | --- |
   | `VITE_API_BASE_URL` | URL base usada pelo Axios em `src/api/axios.ts`. | `http://localhost:8000` |

3. Atualize o valor conforme o endereço em que o backend estiver disponível. Não há outras variáveis obrigatórias no repositório.

## 4. Execução

- **Modo desenvolvimento** (hot reload):

  ```bash
  npm run dev
  ```

  Abra o navegador em `http://localhost:5173` (porta padrão do Vite) para acessar o painel.

- **Build de produção**:

  ```bash
  npm run build
  ```

  Os arquivos otimizados são emitidos em `dist/`.

- **Preview do build** (para testar arquivos gerados):

  ```bash
  npm run preview
  ```

## 5. Testes

- **Lint** (verifica padrões configurados no ESLint):

  ```bash
  npm run lint
  ```

  Não existem suites automatizados além do lint neste projeto.

## 6. Observações adicionais

- O painel depende do backend responder nas rotas padrão com o prefixo `/api/v1/` ou conforme configurado em `VITE_API_BASE_URL`.
- O arquivo `.env.example` define `http://localhost:8000` como base; altere-o caso o backend esteja em outro host/porta.
- O dashboard e as páginas de recursos consomem os endpoints de proteínas, receitas, telefones e mensagens para realizar operações CRUD, geração via IA e envio de mensagens.
