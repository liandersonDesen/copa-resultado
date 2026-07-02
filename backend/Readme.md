# ⚙️ Backend - Copa Resultado 2026

API REST responsável pelo gerenciamento da Copa do Mundo de 2026.

A aplicação disponibiliza endpoints para consulta das seleções, partidas e artilharia, além de permitir a atualização dos resultados. Os dados são persistidos utilizando Prisma ORM e documentados com Swagger.

## 🚀 Tecnologias

* Node.js
* Express
* Prisma ORM
* Swagger UI
* CORS

## 📋 Pré-requisitos

Antes de iniciar, tenha instalado:

* Node.js (18 ou superior)
* npm

## 📦 Instalação

Instale as dependências:

```bash
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env` utilizando como base o arquivo `.env.example`.

Exemplo:

```env
DATABASE_URL="..."
```

## 🗄️ Banco de dados

Crie as tabelas utilizando as migrations do Prisma:

```bash
npx prisma migrate deploy
```

Caso esteja em ambiente de desenvolvimento e deseje recriar o banco:

```bash
npx prisma migrate dev
```

## 🌱 Popular o banco

Execute o seed para inserir os dados iniciais:

```bash
npm run seed
```

## ▶️ Executando o projeto

Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

A API estará disponível em:

```text
http://localhost:3333
```

## 📚 Documentação da API

Após iniciar o servidor, a documentação Swagger poderá ser acessada no navegador pelo endpoint configurado na aplicação 

Exemplo:

```text
http://localhost:3333/api-docs
```

## 📁 Estrutura

```text
backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── mock/
│   ├── routes/
│   └── server.js
├── swagger.json
├── package.json
└── README.md
```
