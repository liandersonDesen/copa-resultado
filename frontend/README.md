# 💻 Frontend - Copa Resultado 2026

Aplicação web desenvolvida em React responsável pela interface do sistema **Copa Resultado 2026**.

A aplicação consome a API do backend para exibir as partidas da fase de grupos, classificação das seleções e tabela de artilharia, além de permitir a atualização dos placares por meio de uma interface intuitiva.

## 🚀 Tecnologias

* React 19
* Vite
* Axios
* CSS

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

* Node.js (18 ou superior)
* npm

> **Importante:** o backend deve estar em execução para que o frontend consiga acessar os dados da API.

## 📦 Instalação

Instale as dependências do projeto:

```bash
npm install
```

## ▶️ Executando o projeto

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Após iniciar, o Vite exibirá o endereço da aplicação no terminal, normalmente:

```text
http://localhost:5173
```

Abra esse endereço no navegador para acessar o sistema.

## 📁 Estrutura

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

## 📂 Componentes principais

* **TabelaGrupo** – Exibe a classificação de cada grupo.
* **ListaPartidas** – Lista todas as partidas da fase de grupos.
* **ModalEdicaoPlacar** – Permite editar o placar das partidas.
* **TabelaArtilharia** – Exibe a classificação dos artilheiros.

## 🔗 Comunicação com a API

A comunicação com o backend é realizada utilizando **Axios**, por meio do arquivo:

```text
src/services/api.js
```

Certifique-se de que o backend esteja em execução antes de iniciar o frontend.
