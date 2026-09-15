# Finance Dashboard

Aplicação full-stack para gerenciamento de portfólios financeiros desenvolvida com **Spring Boot** e **React**. O sistema permite que usuários autenticados gerenciem seus próprios ativos, acompanhem métricas de investimento e visualizem a evolução do portfólio através de uma arquitetura moderna baseada em APIs REST.

## Sobre o projeto

O Finance Dashboard foi desenvolvido como um projeto de estudo avançado para aplicar conceitos utilizados em aplicações corporativas modernas.

Entre os principais objetivos estão:

- arquitetura em camadas;
- autenticação e autorização utilizando JWT;
- isolamento de dados por usuário;
- integração com APIs externas;
- migrações versionadas de banco de dados;
- atualização automática de informações financeiras;
- integração contínua com GitHub Actions;
- containerização utilizando Docker.

O projeto segue uma estrutura full-stack, separando frontend e backend em módulos independentes.

---

## Funcionalidades

### Autenticação

- Cadastro de usuários
- Login utilizando JWT
- Criptografia de senhas com BCrypt
- Proteção de rotas
- Isolamento completo dos dados por usuário autenticado

### Gestão de ativos

- Cadastro de ativos financeiros
- Consulta de ativos do usuário
- Atualização e remoção de ativos
- Histórico de preços
- Cálculo de métricas do portfólio

### Atualização de dados

- Integração com a API CoinGecko
- Atualização automática de preços
- Comunicação em tempo real utilizando WebSocket

---

## Arquitetura

```
┌──────────────┬────────────────┬──────────────────┐
│ React + Vite  │    REST / JWT   │  Spring Boot API  │
│  (Frontend)   │►─────────────►  Spring Security   │
└──────────────┘                └───────┴──────────┘
                                         │
                          Spring Data JPA + Hibernate
                                         │
                                    PostgreSQL
                                         │
                                   CoinGecko API
```

| Camada | Tecnologia |
|---|---|
| Frontend | React 19, TanStack Router, React Query, Recharts, Tailwind CSS 4 |
| Backend | Spring Boot 3.3, Java 17, Spring Data JPA, WebSocket, WebFlux |
| Banco | PostgreSQL 15 |
| Observabilidade | Micrometer, Prometheus |
| CI | GitHub Actions |
| Deploy Frontend | Vercel |
| Deploy Backend | Render / Railway |
| Containerização | Docker, Docker Compose |

---

## Tecnologias

### Backend

- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Spring Web
- Spring WebFlux
- Spring WebSocket
- Flyway
- Maven

### Frontend

- React 19
- TypeScript
- Vite
- TanStack Router
- React Query
- Axios
- Tailwind CSS
- Recharts

### Banco de Dados

- PostgreSQL

### DevOps

- Docker
- Docker Compose
- GitHub Actions
- Vercel
- Render

---

## Estrutura do projeto

```text
finance-dashboard
│
├── backend
│   ├── src
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend
│   ├── src
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── README.md
└── .github
    └── workflows
```

---

## Executando o projeto

### Pré-requisitos

- Java 17
- Node.js 20+
- Docker
- Docker Compose

---

### Executando com Docker

```bash
git clone https://github.com/FelipedBarbosa/Finance-Dashboard.git

cd Finance-Dashboard

docker compose up --build
```

Após a inicialização:

| Serviço | Endereço |
|----------|----------|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

As migrações do Flyway são executadas automaticamente durante a inicialização.

---

### Executando localmente

#### Backend

```bash
cd backend

./mvnw spring-boot:run
```

Windows

```powershell
mvnw.cmd spring-boot:run
```

#### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Autenticação

### Registro

```
POST /auth/register
```

```json
{
  "username": "felipe",
  "email": "felipe@example.com",
  "password": "SenhaForte123456"
}
```

---

### Login

```
POST /auth/login
```

```json
{
  "username": "felipe",
  "password": "SenhaForte123456"
}
```

Resposta

```json
{
  "accessToken": "...",
  "tokenType": "Bearer"
}
```

As requisições para endpoints protegidos devem conter o cabeçalho:

```
Authorization: Bearer <accessToken>
```

---

## Principais endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cadastro de usuário |
| `POST` | `/auth/login` | Autenticação |
| `GET` | `/assets` | Lista ativos do usuário autenticado |
| `POST` | `/assets` | Cadastra um ativo |
| `PUT` | `/assets/{id}` | Atualiza um ativo |
| `DELETE` | `/assets/{id}` | Remove um ativo |
| `GET` | `/assets/{id}/metrics` | Consulta métricas do ativo |
| `GET` | `/assets/chart/portfolio-last-30-days` | Histórico do portfólio |
| `WS` | `/ws/prices` | Stream de preços em tempo real |
| `GET` | `/actuator/health` | Status da aplicação (público) |
| `GET` | `/actuator/prometheus` | Métricas no formato Prometheus |
| `GET` | `/actuator/metrics` | Métricas em JSON |
| `GET` | `/swagger-ui.html` | Documentação interativa |

---

## Observabilidade

O backend expõe métricas no formato [Prometheus](https://prometheus.io) via **Micrometer**.

### Endpoint

```
GET http://localhost:8080/actuator/prometheus
```

### Métricas Disponíveis

| Categoria | Exemplos |
|---|---|
| JVM | `jvm_memory_used_bytes`, `jvm_gc_pause_seconds` |
| HTTP | `http_server_requests_seconds_count`, `http_server_requests_seconds_sum` |
| Banco de dados | `hikaricp_connections_active`, `hikaricp_connections_idle` |
| Sistema | `process_cpu_usage`, `system_cpu_usage` |

### Verificação Local

```bash
# Suba o backend
cd backend && ./mvnw spring-boot:run

# Acesse o endpoint (nova aba do terminal)
curl http://localhost:8080/actuator/prometheus | head -40
```

### Próximos Passos (Observabilidade)

- [ ] Adicionar Prometheus + Grafana ao `docker-compose.yml`
- [ ] Criar dashboard Grafana com métricas JVM e HTTP
- [ ] Adicionar métricas de negócio customizadas (ex: total de ativos por usuário)
- [ ] Configurar alertas de disponibilidade

## Testes

Backend

```bash
cd backend

./mvnw test
```

O pipeline de integração contínua executa automaticamente:

- compilação do backend;
- testes automatizados;
- validação do frontend;
- verificação de build a cada Push e Pull Request.

---

## Deploy

### Frontend

Hospedado na Vercel.

Variáveis de ambiente:

```env
VITE_API_URL=https://seu-backend.onrender.com
VITE_WS_URL=wss://seu-backend.onrender.com/ws/prices
```

### Backend

Hospedado no Render utilizando Docker.

---

## Roadmap

- Refresh Token
- Dashboard analítico consolidado
- Cache com Redis
- Documentação OpenAPI/Swagger
- Testes End-to-End com Cypress
- ~~Observabilidade (Micrometer + Prometheus)~~ ✅ Concluído

---

## Autor

**Felipe Barbosa**

