# Usar a imagem base do Node.js (Node v21.6.1)
FROM node:21.6.1

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o package.json e package-lock.json
COPY package*.json ./

# Copiar o arquivo .env.docker e renomear para .env dentro do contêiner
COPY .env.docker .env

# Instalar as dependências de produção
RUN npm install --production

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta em que a aplicação irá rodar
EXPOSE 3000

# Definir o comando para iniciar a aplicação
CMD ["node", "src/index.js"]
