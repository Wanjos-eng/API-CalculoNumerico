# API de Métodos Numéricos com Integração de IA

Este repositório contém uma API desenvolvida em Node.js que implementa métodos numéricos para resolver equações não lineares, tais como Bissecção, Falsa Posição, Newton-Raphson e Secante. Além disso, a API integra uma Inteligência Artificial (IA) utilizando a API Gemini, permitindo que os usuários façam perguntas sobre os cálculos realizados.

## Índice

- [Características](#características)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Endpoints](#endpoints)
  - [Métodos Numéricos](#métodos-numéricos)
  - [Interação com a IA](#interação-com-a-ia)
- [Uso](#uso)
- [Contribuição](#contribuição)

## Características

- Implementação dos métodos numéricos:
  - Bissecção
  - Falsa Posição
  - Newton-Raphson
  - Secante
- Integração com a IA Gemini para responder perguntas sobre os cálculos.
- Uso de cookies para gerenciamento de sessões sem necessidade de autenticação.
- Armazenamento de contexto utilizando Redis de terceiros (serviço online utilizado diretamente em produção).
- Documentação da API com Swagger.
- Contêineres Docker para fácil implantação.

## Pré-requisitos

- **Docker** instalado
- **Docker Compose** instalado
- **Conta e chave de API para a **API Gemini** (Google Generative AI)

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Wanjos-eng/API-CalculoNumerico
   cd API-CalculoNumerico
   ```

## Configuração

1. **Crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis de ambiente:**

   ```env
    PORT=3000
    GEMINI_KEY=
    REDIS_HOST=
    REDIS_PORT=
    REDIS_PASSWORD=
   ```

   - **GEMINI_KEY**: Obtenha sua chave de API no [Google AI Studio](https://studio.ai.google/).
   - **REDIS_**: São informações fornecida pelo serviço Redis de terceiros.

   **OBS** -Em processo de teste no desenvolvimento pode simplismente usar a biblioteca node-cache para testar as funcionalidades.

2. **Certifique-se de que tem acesso ao serviço Redis de terceiros:**

   - É necessario configurar o redis em algum sistema de serviço recomendo [render](https://dashboard.render.com/) ou [Redis](https://redis.io/)

## Execução

### Com o docker:

1. **Construa e inicie os contêineres Docker:**

   ```bash
   docker-compose up --build
   ```

   - Isso irá construir a imagem Docker da aplicação e iniciar o contêiner.

2. **Acesse a documentação Swagger para visualizar os endpoints:**

   Abra o navegador e navegue até `http://localhost:3000/docs`.

### Sem o docker:

1. **Inicie o ambiente virtual:**

   ```bash
   npm run dev
   ```

2. **Em caso de erro execute o comando para configurar o ambiente:**

   ```bash
   npm run setup
   ```

## Endpoints

### Métodos Numéricos

- **POST** `/bisseccao`
- **POST** `/fp`
- **POST** `/newton-raphson`
- **POST** `/secante`

### Interação com a IA

- **POST** `/perguntar`

## Uso

### 1. Como usar o Postman (ou Insomnia) para fazer uma requisição POST:

- Você pode baixar e instalar o Postman [aqui](https://www.postman.com/downloads/).
- Após instalar e abrir o Postman, você verá uma tela para criar uma nova requisição.
- Clique no botão New no canto superior esquerdo.
- Selecione HTTP Request.
- No campo à esquerda da URL, altere o método para POST.
- No campo ao lado do método POST, insira a URL do endpoint (exemplo: http://localhost:3000/newton-raphson).
- Clique na aba Body abaixo do campo de URL.
- Selecione a opção raw.
- No menu suspenso à direita, selecione o tipo de dados que será enviado, geralmente JSON.
- Insira os dados no formato JSON que serão enviados na requisição, como na parte 2 a seguir.
- É importante verificar na documentação o formato correto para fazer a requisição.

### 2. Executar um método numérico

Faça uma requisição `POST` para um dos endpoints dos métodos, fornecendo os parâmetros necessários no corpo da requisição.

**Exemplo de requisição para o método da Bissecção:**

```http
POST /bisseccao
Content-Type: application/json

{
  "funcao": "x^2 - 4",
  "intervalo": [0, 5],
  "tolerancia": 0.001,
  "maxIteracao": 100
}
```

### 3. Fazer uma pergunta para a IA

Após executar um método numérico, faça uma requisição `POST` para `/ia/perguntar`, fornecendo a sua pergunta.

**Exemplo de requisição:**

```http
POST /perguntar
Content-Type: application/json

{
  "pergunta": "Como o método determinou a raiz aproximada?"
}
```

A IA irá responder com base no contexto do cálculo que você executou anteriormente.


## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

Para contribuir:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

---

Desenvolvido por:

- [Andressa](https://github.com/xndrxssx)
- [José Victor](https://github.com/jvictordev1)
- [Weslen Anjos](https://github.com/Wanjos-eng)

---