# TaskFlow Manager — Backend

## Stack

- **Runtime:** Node.js >=20 + Express 4
- **Language:** TypeScript ~6.0
- **Database:** MongoDB (Atlas M0) + Mongoose 8
- **Auth:** JWT — access token (Bearer) + refresh token (httpOnly cookie)
- **Validation:** Zod v4 (SSoT z `@taskflow/shared`)
- **Testing:** Vitest + Supertest + mongodb-memory-server
- **Package manager:** pnpm workspaces v11

---

## Struktura projektu

```
server/
├── scripts/
│   ├── seed.ts              # seed 3 userów do bazy
│   └── clear.ts             # czyszczenie kolekcji
├── src/
│   ├── app.ts               # Express app (eksportowany dla Vercel)
│   ├── index.ts             # entry point — connectDB + listen (lokalnie)
│   ├── env.ts               # dotenv + walidacja Zod
│   ├── config/
│   │   └── constants.ts     # SALT_ROUNDS i inne stałe
│   ├── features/
│   │   ├── auth/
│   │   │   ├── __tests__/
│   │   │   │   ├── auth.routes.test.ts
│   │   │   │   └── helpers.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.model.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.service.ts
│   │   └── todos/
│   │       ├── __tests__/
│   │       │   └── todos.routes.test.ts
│   │       ├── todos.controller.ts
│   │       ├── todos.model.ts
│   │       ├── todos.routes.ts
│   │       └── todos.service.ts
│   ├── lib/
│   │   ├── jwt.ts           # sign/verify access + refresh tokenów
│   │   └── mongoose.ts      # connectDB (idempotent — Vercel warm starts)
│   ├── middleware/
│   │   ├── authenticate.ts  # Bearer token guard → req.user
│   │   ├── errorHandler.ts  # ZodError / AppError / fallback 500
│   │   └── notFound.ts      # 404 catch-all
│   ├── test/
│   │   └── setup.ts         # MongoMemoryServer setup
│   └── utils/
│       ├── appError.ts      # operational errors z HTTP statusCode
│       └── wrapAsync.ts     # eliminuje try/catch w kontrolerach
```

---

## Uruchomienie lokalne

### Wymagania

- Node.js >= 20
- pnpm >= 11
- Konto MongoDB Atlas (free tier M0) **lub** Docker

### Instalacja

```bash
# z root monorepo
pnpm install
```

### Zmienne środowiskowe

```bash
cd server
cp .env.example .env
```

Uzupełnij `.env`:

| Zmienna                    | Opis                      | Przykład                |
| -------------------------- | ------------------------- | ----------------------- |
| `NODE_ENV`                 | Środowisko                | `development`           |
| `PORT`                     | Port serwera              | `5001`                  |
| `MONGO_URI`                | Connection string Atlas   | `mongodb+srv://...`     |
| `ACCESS_TOKEN_SECRET`      | Sekret JWT access         | `<64B hex>`             |
| `ACCESS_TOKEN_EXPIRES_IN`  | Czas życia access tokenu  | `15m`                   |
| `REFRESH_TOKEN_SECRET`     | Sekret JWT refresh        | `<64B hex>`             |
| `REFRESH_TOKEN_EXPIRES_IN` | Czas życia refresh tokenu | `7d`                    |
| `CLIENT_ORIGIN`            | URL frontendu (CORS)      | `http://localhost:5173` |

Generowanie sekretów:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### MongoDB Atlas

1. [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) → Free tier M0
2. Database Access → dodaj usera z hasłem
3. Network Access → `0.0.0.0/0` (dev)
4. Connect → Drivers → skopiuj URI → wklej do `MONGO_URI`

> Dodaj nazwę bazy do URI: `mongodb+srv://user:pass@cluster.mongodb.net/taskflow?appName=Tasks`

### MongoDB lokalnie (Docker)

```yaml
# docker-compose.yml (root)
services:
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: taskflow
volumes:
  mongo_data:
```

```bash
docker compose up -d
# MONGO_URI=mongodb://localhost:27017/taskflow
```

### Uruchomienie

```bash
cd server
pnpm dev          # development (tsx watch)
pnpm build        # kompilacja TS → dist/
pnpm start        # produkcja (node dist/index.js)
```

### Seed bazy

```bash
pnpm seed         # wstawia 3 użytkowników (Alice, Bob, Carol)
pnpm clear        # czyści wszystkie kolekcje
```

Domyślne hasło dla Alicji i Carol: `pass1234`. Bob — bez hasła.

### Smoke test

```bash
curl http://localhost:5001/api/health
# → {"status":"success","data":{"ok":true},"message":"Server alive"}
```

---

## API

### Format odpowiedzi

```json
{
  "status": "success" | "error",
  "data": <payload> | null,
  "message": "..."
}
```

### Auth endpoints

| Method   | Path                 | Auth | Opis                          |
| -------- | -------------------- | ---- | ----------------------------- |
| `GET`    | `/api/auth/users`    | ❌   | Lista użytkowników            |
| `POST`   | `/api/auth/register` | ❌   | Rejestracja                   |
| `POST`   | `/api/auth/login`    | ❌   | Login → access token + cookie |
| `POST`   | `/api/auth/refresh`  | ❌   | Rotacja tokenów               |
| `POST`   | `/api/auth/logout`   | ❌   | Wylogowanie                   |
| `PATCH`  | `/api/auth/password` | ✅   | Zmiana hasła                  |
| `DELETE` | `/api/auth/user`     | ✅   | Usunięcie konta               |

### Todos endpoints

| Method   | Path             | Auth | Opis                     |
| -------- | ---------------- | ---- | ------------------------ |
| `GET`    | `/api/todos`     | ✅   | Todos zalogowanego usera |
| `POST`   | `/api/todos`     | ✅   | Nowe todo                |
| `PATCH`  | `/api/todos/:id` | ✅   | Edycja todo              |
| `DELETE` | `/api/todos/:id` | ✅   | Usunięcie todo           |

---

## Architektura

### Error handling

```
Request → Controller (wrapAsync) → Service → AppError → errorHandler
```

- `wrapAsync` — eliminuje try/catch w kontrolerach, przekazuje błędy do Express
- `AppError` — operacyjne błędy z HTTP statusCode
- `errorHandler` — obsługuje `ZodError` (400), `AppError` (statusCode), pozostałe (500)

### JWT Flow

```
Login → access token (15min, Bearer header) + refresh token (7d, httpOnly cookie)
         ↓
Request z access tokenem → authenticate middleware → req.user
         ↓
Access token wygasł → interceptor axios → POST /auth/refresh → nowy access token
         ↓
Refresh token wygasł → logout → redirect /
```

**Token reuse detection:** każdy `/refresh` unieważnia poprzedni token. Użycie starego tokenu → czyszczenie DB + wymuszony re-login.

### Modele

**User:**

- `name`, `avatar`, `password` (bcrypt, `""` = brak hasła), `refreshToken`
- `toJSON` transform: `_id → id`, usuwa `password`, `refreshToken`, `__v`, timestamps
- Klient dostaje: `{ id, name, avatar, hasPassword }`

**Todo:**

- `title`, `description`, `priority`, `status`, `completeDate`, `userId`
- `timestamps` mapowane na `creationDate`/`lastModifiedDate` (SSoT z shared)
- `completeDate`: ustawiany gdy `status → "done"`, czyszczony przy zmianie z `"done"`
- Index na `userId` — wszystkie queries filtrują per user

---

## Security

| Warstwa       | Narzędzie            | Opis                                       |
| ------------- | -------------------- | ------------------------------------------ |
| Headers       | `helmet`             | 14 security headers                        |
| Rate limiting | `express-rate-limit` | 100 req / 15min                            |
| CORS          | `cors`               | tylko `CLIENT_ORIGIN`, `credentials: true` |
| XSS           | httpOnly cookie      | refresh token niedostępny przez JS         |
| Passwords     | `bcryptjs`           | 10 salt rounds                             |
| Validation    | Zod v4               | walidacja wszystkich endpointów            |

---

## Testy

```bash
cd server
pnpm test           # wszystkie testy
pnpm test:watch     # watch mode
```

**38 testów, wszystkie passing.**

| Plik                   | Testy | Opis                                               |
| ---------------------- | ----- | -------------------------------------------------- |
| `auth.routes.test.ts`  | 22    | Register, login, refresh, logout, password, delete |
| `todos.routes.test.ts` | 16    | CRUD todos, ownership, completeDate                |

### Setup testów

- `mongodb-memory-server` — izolowana in-memory DB, zero zależności od Atlas
- `afterEach` — `deleteMany()` na wszystkich kolekcjach, brak wycieku stanu między testami
- Aliasy: `@/` → `src/`, `@taskflow/shared` → `shared/src/index.ts`

---

## Znane decyzje techniczne

- **Port 5001** — port 5000 zajęty przez AirPlay na macOS
- **`app.ts` osobno od `index.ts`** — Vercel eksportuje `app`, lokalnie `index.ts` wywołuje `listen`
- **`connectDB` idempotent** — guard `readyState >= 1` zapobiega wielokrotnym połączeniom przy Vercel warm starts
- **`vite-tsconfig-paths` ESM-only** — zastąpiony natywnym `resolve.alias` w `vitest.config.ts`
- **`toJSON` transform z `RawUserDoc`** — Mongoose nie eksportuje poprawnego typu dla `ret` w `transform`, `any` zastąpiony precyzyjnym lokalnym typem
- **Refresh token w DB** — jeden aktywny token per user, nowe logowanie unieważnia poprzednią sesję
- **`jti` w refresh tokenie** — `randomUUID()` gwarantuje unikalność tokenów wydanych w tej samej sekundzie
