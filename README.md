# Finance Dashboard

Aplicação full-stack para gerenciamento de ativos financeiros, com autenticação segura, atualização automática de preços e métricas de portfólio por usuário.

[![CI](https://github.com/FelipedBarbosa/Finance-Dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/FelipedBarbosa/Finance-Dashboard/actions/workflows/ci.yml)

**Demo Online:** https://finance-dashboard-phi.vercel.app *(atualizar após deploy)*

---

## Estrutura do Repositório

```
finance-dashboard/
├── backend/          # Spring Boot 3 · Java 17 · PostgreSQL
├── frontend/         # React 19 · TanStack Router · Vite · Tailwind CSS
├── docker-compose.yml
├── README.md
└── .github/
    └── workflows/
        └── ci.yml
```

---

## Funcionalidades

* Java 17
* Node.js (para o frontend)
* Docker
* Docker Compose

---

## Stack

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

### 3. Executar o backend

### Pré-requisitos

- Java 17
- Node 20
- Docker + Docker Compose

### Opção 1 — Docker Compose (tudo de uma vez)

```bash
git clone https://github.com/FelipedBarbosa/Finance-Dashboard.git
cd finance-dashboard

docker compose up --build
```

As migrações Flyway são aplicadas automaticamente na inicialização.

### 4. Executar o frontend

```bash
cd frontend
npm install
npm run dev
```

A interface estará disponível em:

```text
http://localhost:5173
```

## Autenticação

A API utiliza autenticação stateless via JWT.

### Registrar usuário

```http
POST /auth/register
```

```json
{
  "username": "felipe",
  "email": "felipe@example.com",
  "password": "SenhaForte123456"
}
```

### Login

```http
POST /auth/login
```

```json
{
  "username": "felipe",
  "password": "SenhaForte123456"
}
```

Resposta:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer"
}
```

Todas as requisições aos endpoints de ativos devem incluir o header:

```text
Authorization: Bearer <accessToken>
```

## Endpoints Principais

---

### Opção 2 — Desenvolvimento local

**Backend:**

```bash
cd backend
./mvnw package -DskipTests
java -jar target/finance-dashboard-0.0.1-SNAPSHOT.jar
```

### Listar ativos (do usuário autenticado)

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Acesse: http://localhost:3000

---

## Deploy

### Frontend → Vercel

1. Importe o repositório no [Vercel](https://vercel.com)
2. Configure **Root Directory** como `frontend`
3. Adicione as variáveis de ambiente:
   ```
   VITE_API_URL=https://seu-backend.onrender.com
   VITE_WS_URL=wss://seu-backend.onrender.com/ws/prices
   ```
4. Deploy automático a cada push na `main`

### Backend → Render

1. Crie um novo **Web Service** no [Render](https://render.com)
2. Selecione o repositório e configure **Root Directory** como `backend`
3. Render detecta automaticamente o `Dockerfile`
4. Adicione as variáveis de ambiente do PostgreSQL

Executar os testes automatizados do backend:

```bash
./mvnw -f backend/pom.xml test
```

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/assets` | Lista todos os ativos |
| `POST` | `/assets` | Cadastra novo ativo |
| `GET` | `/assets/{id}/metrics` | Métricas de um ativo |
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

```bash
cd backend
./mvnw test
```

## Melhorias Futuras

* Refresh token automático no frontend
* Deploy em cloud
* Cache com Redis
* Documentação com Swagger/OpenAPI
* Integração com mais provedores financeiros
* Testes end-to-end com Cypress

## Autor

Desenvolvido por **Felipe Barbosa**
