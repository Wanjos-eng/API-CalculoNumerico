<!-- PROJECT_METADATA
{
  "title": "API de Métodos Numéricos + IA",
  "short_description": "API Node.js que resolve equações não lineares por 4 métodos numéricos e integra a Gemini AI para responder dúvidas sobre os cálculos, com Swagger e Docker.",
  "primary_stack": ["Node.js", "Express", "Gemini AI", "Redis", "Swagger", "Docker"],
  "architecture": "REST API",
  "detail_description": "API REST em Node.js que combina cálculo numérico com IA generativa. Resolve equações não lineares usando Bissecção, Falsa Posição, Newton-Raphson e Secante. Integra a API Gemini do Google para que o usuário possa fazer perguntas sobre os cálculos realizados, com contexto de sessão gerenciado via Redis. Documentada com Swagger e containerizada com Docker."
}
-->

# API de Métodos Numéricos + IA (Gemini)

API REST em Node.js que resolve equações não lineares por 4 métodos numéricos e integra a **API Gemini (Google AI)** para responder dúvidas contextuais sobre os cálculos.

## Diferenciais

- **4 métodos numéricos** para equações não lineares
- **Gemini AI integrada** — o usuário faz perguntas sobre os cálculos e a IA responde com contexto
- **Sessões via Redis** — contexto da conversa preservado sem autenticação
- **Documentação Swagger** — API totalmente documentada
- **Docker** — ambiente reproduzível com um comando

## Métodos Numéricos Implementados

| Método | Tipo | Convergência |
|---|---|---|
| Bissecção | Fechado | Linear |
| Falsa Posição | Fechado | Superlinear |
| Newton-Raphson | Aberto | Quadrática |
| Secante | Aberto | Superlinear |

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| IA Generativa | Google Gemini API |
| Cache / Sessão | Redis |
| Documentação | Swagger (OpenAPI) |
| Containerização | Docker |

## Como Rodar

### Com Docker
```bash
docker-compose up -d
```

### Localmente
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Adicionar GEMINI_API_KEY e configurações Redis

# Iniciar servidor
npm start
```

Documentação Swagger disponível em `http://localhost:3000/api-docs`

## Contexto

Projeto da disciplina de **Cálculo Numérico** — Engenharia de Computação @ UNIVASF, expandido com integração de IA e deploy em produção.
