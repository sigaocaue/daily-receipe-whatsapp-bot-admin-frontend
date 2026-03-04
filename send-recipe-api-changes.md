# Alterações na API - Endpoint `/api/v1/messages/send`

## O que mudou

O endpoint `POST /api/v1/messages/send` agora aceita um **body opcional** com novos campos para controlar qual receita será enviada. O comportamento anterior (sem body) continua funcionando normalmente.

---

## Request

**Method:** `POST`
**URL:** `/api/v1/messages/send`
**Content-Type:** `application/json`
**Body:** Opcional

### Campos do body

| Campo          | Tipo     | Obrigatório | Default | Descrição                                                                 |
|----------------|----------|-------------|---------|---------------------------------------------------------------------------|
| `recipe_id`    | `string` (UUID) | Não | `null`  | ID de uma receita existente no banco de dados.                            |
| `title`        | `string` | Não         | `null`  | Título da receita personalizada.                                          |
| `ingredients`  | `string` | Não         | `null`  | Ingredientes da receita personalizada.                                    |
| `instructions` | `string` | Não         | `null`  | Modo de preparo da receita personalizada.                                 |
| `image_url`    | `string` | Não         | `null`  | URL da imagem da receita personalizada.                                   |
| `save_recipe`  | `boolean`| Não         | `false` | Se `true`, salva a receita personalizada no banco de dados para uso futuro. |

> **Nota:** Para enviar uma receita personalizada, os campos `title`, `ingredients` e `instructions` são obrigatórios em conjunto. Se um deles faltar, o sistema ignora a receita personalizada e seleciona uma aleatória.

---

## Cenários de uso

### 1. Receita aleatória (comportamento original)

Enviar sem body ou com body vazio. O sistema seleciona uma receita aleatória evitando as últimas 5 enviadas.

```bash
curl -X POST http://localhost:8000/api/v1/messages/send
```

ou

```bash
curl -X POST http://localhost:8000/api/v1/messages/send \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 2. Receita existente por ID

Informar o `recipe_id` de uma receita já cadastrada no banco.

```bash
curl -X POST http://localhost:8000/api/v1/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "recipe_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### 3. Receita personalizada (sem salvar no banco)

Informar `title`, `ingredients` e `instructions`. A receita é enviada mas **não é salva** no banco.

```bash
curl -X POST http://localhost:8000/api/v1/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bolo de Chocolate",
    "ingredients": "2 xícaras de farinha\n3 ovos\n1 xícara de chocolate em pó",
    "instructions": "1. Misture os ingredientes secos\n2. Adicione os ovos\n3. Asse por 40 minutos",
    "image_url": "https://exemplo.com/bolo.jpg"
  }'
```

### 4. Receita personalizada (salvando no banco)

Mesmo cenário acima, mas com `save_recipe: true`. A receita é salva e poderá ser reutilizada futuramente.

```bash
curl -X POST http://localhost:8000/api/v1/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bolo de Chocolate",
    "ingredients": "2 xícaras de farinha\n3 ovos\n1 xícara de chocolate em pó",
    "instructions": "1. Misture os ingredientes secos\n2. Adicione os ovos\n3. Asse por 40 minutos",
    "image_url": "https://exemplo.com/bolo.jpg",
    "save_recipe": true
  }'
```

---

## Response

**Status:** `200 OK`

```json
{
  "data": {
    "sent_to": ["+5511999999999"],
    "recipe": "Bolo de Chocolate",
    "recipe_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "sent"
  },
  "message": "Recipe sent via WhatsApp"
}
```

> **Nota:** O campo `recipe_id` será `null` quando uma receita personalizada for enviada sem `save_recipe: true`.

### Erros

| Status | Descrição                                | Exemplo de body                                                  |
|--------|------------------------------------------|------------------------------------------------------------------|
| `404`  | Receita com o ID informado não encontrada | `{"detail": "Recipe with id '...' not found."}`                 |
| `404`  | Nenhuma receita disponível no banco       | `{"detail": "No available recipe found. Generate more recipes first."}` |
| `404`  | Nenhum número de telefone ativo           | `{"detail": "No active phone numbers found."}`                  |

---

## Prioridade dos campos

O sistema resolve a receita na seguinte ordem de prioridade:

1. **`recipe_id`** — se informado, busca a receita no banco pelo ID
2. **`title` + `ingredients` + `instructions`** — se todos informados, usa como receita personalizada
3. **Aleatória** — se nenhum dos acima, seleciona uma receita aleatória do banco
