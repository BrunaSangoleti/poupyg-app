# 🐷 Poupyg - Organização Financeira Inteligente

![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo_e_em_Produ%C3%A7%C3%A3o-success)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=spring&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)

O **Poupyg** é uma aplicação completa de gestão financeira pessoal. Desenvolvida para ser simples e responsiva, ela ajuda o usuário a ter controle total sobre seu dinheiro, categorizando **Despesas**, **Receitas** e acompanhando o crescimento dos seus **Investimentos** através de painéis visuais intuitivos.

🌐 **Acesse a aplicação ao vivo:** [Poupyg App - Vercel](https://poupyg-new-app-theta.vercel.app/)

## ✨ Funcionalidades

- **Dashboard Financeiro:** Visão geral do saldo, total de receitas, despesas e patrimônio investido.
- **Gestão de Investimentos:** Acompanhamento de alocação de ativos com gráficos de rosca (Donut Charts) dinâmicos.
- **Categorização Automática:** Organização de movimentações financeiras por categorias personalizadas.
- **Segurança:** Autenticação robusta utilizando tokens JWT (JSON Web Tokens).
- **Interface Responsiva:** Design "Soft UI" moderno construído com Tailwind CSS, perfeitamente adaptável para desktop e mobile.

## 🚀 Tecnologias e Arquitetura (Monorepo)

O projeto foi estruturado em um padrão **Monorepo**, unificando o Frontend e o Backend no mesmo repositório para facilitar o controle de versão e os deploys simultâneos.

### Frontend (`/Fintech react`)
- **React.js** com **Vite** (Alta performance de build)
- **Tailwind CSS** (Estilização e responsividade)
- **Recharts** (Gráficos financeiros)
- **React Hook Form + Zod** (Validação de formulários)
- **Axios** (Comunicação com a API)

### Backend (`/fintechNovo`)
- **Java 21** com **Spring Boot**
- **Spring Security + JWT** (Autenticação Stateless)
- **Spring Data JPA + Hibernate** (Mapeamento Objeto-Relacional)
- **Flyway** (Desabilitado em produção em favor da gestão manual, mas preparado para versionamento de banco)
- **Docker** (Backend conteinerizado em múltiplos estágios)

## ☁️ Estratégia de Deploy

A aplicação está hospedada em uma arquitetura moderna baseada em nuvem, dividida em três serviços gratuitos e eficientes:

1. **Banco de Dados (Neon.tech):** Banco PostgreSQL Serverless. Oferece conexão via poolers nativos e segurança SSL.
2. **Backend (Render):** O Spring Boot é compilado e executado via **Docker**. O Web Service expõe a API RESTful consumindo as variáveis de ambiente de conexão do Neon.
3. **Frontend (Vercel):** O React faz o build automático e consome a variável `VITE_API_URL` para se comunicar com o backend no Render de forma segura.

---

## 🛠️ Como executar o projeto localmente

Caso queira rodar o projeto na sua máquina, siga os passos abaixo:

### Pré-requisitos
- **Java 21** e **Maven** instalados
- **Node.js** (versão 18+)
- Um banco **PostgreSQL** rodando localmente (porta 5432)

### 1. Configurando o Banco de Dados e Backend
1. Crie um banco de dados local chamado `fintech`.
2. Abra o arquivo `fintechNovo/src/main/resources/application.properties` e garanta que as variáveis locais (ou os fallbacks) apontem para o seu banco.
3. Pelo terminal, navegue até a pasta do backend e inicie a aplicação:
```bash
cd fintechNovo
./mvnw spring-boot:run
```
*O backend estará rodando na porta `8081`.*

### 2. Configurando o Frontend
1. Abra um novo terminal e navegue até a pasta do frontend:
```bash
cd "Fintech react"
```
2. Instale as dependências:
```bash
npm install
```
3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
*O frontend abrirá localmente na porta `5173`. Acesse `http://localhost:5173` e utilize a aplicação!*
