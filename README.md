# TaskFlow Manager — Frontend README

## Stack

| Technology                      | Version | Role                                 |
| ------------------------------- | ------- | ------------------------------------ |
| React                           | 19      | UI                                   |
| Vite                            | latest  | bundler + dev server                 |
| TypeScript                      | 6       | type safety                          |
| Tailwind                        | v4      | styling                              |
| HeadlessUI                      | v2      | accessible UI primitives             |
| React Query                     | v5      | server state + mutations             |
| Zustand                         | v5      | client state (auth, theme)           |
| React Router                    | v7      | routing                              |
| React Hook Form                 | latest  | forms                                |
| Zod                             | v4      | validation (SSoT z @taskflow/shared) |
| Axios                           | latest  | HTTP client (gotowy na backend)      |
| dayjs                           | latest  | formatowanie dat                     |
| sonner                          | latest  | toasty                               |
| Lucide                          | latest  | ikony                                |
| Vitest + @testing-library/react | latest  | testy                                |

---

## Architektura

### Monorepo (pnpm workspaces v10)

```
TaskFlow-Manager/
├── client/          → @taskflow/client
├── shared/          → @taskflow/shared (Zod SSoT)
└── server/          → Node/Express (w toku)
```

Aliasy:

- `@/` → `client/src/`
- `@taskflow/shared` → `shared/src/index.ts`

### Routing

```
/        → HomePage (public)
/todos   → ProtectedRoute → TodosPage
*        → redirect /todos (niezalogowany → / przez ProtectedRoute)
```

### State management

- **Auth** — `useAuthStore` (Zustand + sessionStorage persist)
- **Theme** — `useThemeStore` (Zustand + localStorage persist)
- **Server state** — React Query (mock-first, gotowy na swap z backendem)

---

## Design System

### Comic Style

- Border: `2.5px solid var(--border-color)`
- Shadow: `3px 3px 0 var(--color-ink)` (hard offset)
- Border radius: `8px` (btns), `12px` (cards/panels)

### Motywy

| Token            | Light             | Dark              |
| ---------------- | ----------------- | ----------------- |
| `--bg-primary`   | `#f5f0e8` (cream) | `#1a2233` (navy)  |
| `--bg-surface`   | `#ffffff`         | `#243044`         |
| `--border-color` | `#1a1a2e` (ink)   | `#4a6080` (slate) |
| `--text-primary` | `#1a1a2e`         | `#e8e0d0`         |

### Fonty

- Headings: **Fredoka** (Fredoka One)
- Body: **Josefin Sans**

### Klasy CSS (index.css)

```
comic-card          — interactive card (hover scale + brightness)
comic-panel         — flat container (bez hover)
comic-btn           — base button (flex + gap + shadow)
comic-btn-primary   — amber background, ink text
comic-btn-ghost     — transparent
comic-input         — styled input/textarea/select
comic-checkbox      — custom checkbox (amber checked state)
badge-{priority}    — low/medium/high/crucial
badge-{status}      — todo/in_progress/done
error-message       — min-h-6, text-error, mt-2
```

---

## Struktura plików

```
src/
├── App.tsx                          ← Routes + ErrorBoundary + Toaster
├── main.tsx                         ← providers (BrowserRouter, QueryClient)
├── index.css                        ← design system (CSS vars + komponenty)
├── constants.ts                     ← AvatarId type + avatars[]
│
├── components/                      ← globalne, reużywalne
│   ├── AvatarsGallery.tsx           ← karuzela SVG sprite
│   ├── ComicSelect.tsx              ← HeadlessUI Listbox, generic <T extends string>
│   ├── ErrorBoundary.tsx            ← class component, catch render errors
│   ├── Footer.tsx
│   ├── Layout.tsx                   ← Topbar + <main grow> + Footer + Toaster
│   ├── MobileMenu.tsx               ← HeadlessUI Dialog, slide z górnego rogu
│   ├── ProtectedRoute.tsx           ← useAuthStore guard + <Outlet />
│   ├── SessionWarningModal.tsx      ← HeadlessUI Dialog, countdown
│   ├── SettingsModal.tsx            ← activeSection state, ChangePassForm + DeleteAccountSection
│   ├── ThemeToggler.tsx             ← HeadlessUI Switch + classList.toggle("dark")
│   └── Topbar.tsx                   ← useLocation + mobile burger
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── ChangePassForm.tsx   ← RHF + Zod, toggle expand
│   │   │   ├── DeleteAccountSection.tsx ← warunkowy resolver, guard !user
│   │   │   ├── UserCard.tsx         ← inline login, shake animation, autofocus
│   │   │   └── UserList.tsx         ← grid, loading/error states
│   │   ├── hooks/
│   │   │   ├── useLogout.ts         ← logout() + navigate("/")
│   │   │   └── useUsers.ts          ← React Query + MOCK_USERS + useDeleteUser
│   │   └── store/
│   │       └── authStore.ts         ← Zustand + sessionStorage
│   │
│   ├── createUser/
│   │   └── components/
│   │       ├── CreateUser.tsx       ← orkiestracja isOpen
│   │       ├── CreateUserBtn.tsx    ← comic-card button
│   │       ├── CreateUserForm.tsx   ← RHF + Zod + AvatarsGallery Controller
│   │       └── CreateUserModal.tsx  ← HeadlessUI Dialog
│   │
│   ├── theme/
│   │   └── store/
│   │       └── themeStore.ts        ← Zustand + localStorage + system preference
│   │
│   └── todos/
│       ├── components/
│       │   ├── FilterChip.tsx       ← badge-{label} gdy aktywny
│       │   ├── TodoCreateDrawer.tsx ← HeadlessUI Dialog, slide-in z prawej
│       │   ├── TodoCreateForm.tsx   ← RHF + Zod, create many mode, feedback lista
│       │   ├── TodoEmptyState.tsx   ← variant: "empty" | "filtered", config object
│       │   ├── TodoFilterDrawer.tsx ← HeadlessUI Dialog, slide-in z prawej
│       │   ├── TodoFilters.tsx      ← layout: "row" | "col"
│       │   ├── TodoItem.tsx         ← Disclosure accordion, inline edit, cycle badges
│       │   ├── TodoItemBadges.tsx   ← view/edit mode przez opcjonalne handlery
│       │   ├── TodoItemsActions.tsx ← early returns per stan
│       │   ├── TodoList.tsx         ← divide-y lista
│       │   └── TodoPagination.tsx   ← first/prev/next/last, guard totalPages <= 1
│       ├── hooks/
│       │   ├── useTodoFilters.ts    ← search+status+priority+sort+pagination+reset
│       │   ├── useTodoMutations.ts  ← create/update/delete + optimistic updates + toasty
│       │   └── useTodos.ts          ← React Query, filtr po userId
│       └── utils/
│           └── todoFilters.utils.ts ← toggleChip, cycleValue, formatLabel, SORT_OPTIONS
│
├── hooks/
│   ├── useMediaQuery.ts             ← window.matchMedia + cleanup
│   └── useSessionExpiry.ts          ← timery, warning, countdown, logout
│
├── lib/
│   ├── axios.ts                     ← Axios instance (gotowa na backend)
│   ├── cn.ts                        ← clsx + tailwind-merge
│   ├── date.ts                      ← dayjs + relativeTime (fromNow, formatDate)
│   └── queryClient.ts               ← QueryClient instance
│
└── pages/
    ├── HomePage.tsx                 ← UserList + CreateUser
    └── TodosPage.tsx                ← TodoList + filtry + paginacja + drawery + session
```

---

## Shared Schemas (@taskflow/shared)

### user.ts

```typescript
UserSchema          — id, name, avatar, password?
LoginSchema         — password: z.string().min(4)
CreateUserSchema    — omit(id) + passwordProtected + confirmPassword + superRefine
ChangePasswordSchema
DeleteUserSchema    — password: z.string().min(4)
```

### todo.ts

```typescript
ToDoSchema          — id, title (min10/max50), description?, priority, status,
                      creationDate, lastModifiedDate, completeDate?, badge?, userId
TodoFormSchema      — pick: title, description, priority, status, badge
CreateTodoSchema    — omit badge (status required, default "todo" w RHF defaultValues)
EditTodoSchema      — TodoFormSchema
TODO_STATUSES       — ["todo", "in_progress", "done"] (runtime z Zod enum)
TODO_PRIORITIES     — ["low", "medium", "high", "crucial"]
```

---

## Funkcjonalności

### Auth

- Hybrid auth — user z hasłem (inline login) lub bez (klik → login)
- `UserCard` — animacja slide (avatar wyjeżdża górą, form wjeżdża), shake przy złym haśle, autofocus z `setTimeout(500)`
- `useAuthStore` — Zustand + sessionStorage persist
- Session expiry — 10 min bezczynności (click/keydown/scroll/touchstart), warning modal po 9 min z odliczaniem

### Todos

- CRUD — create (drawer), read (lista), update (inline edit), delete (potwierdzenie)
- Optimistic updates — `onMutate` snapshot + rollback `onError` + `invalidateQueries` w `onSettled`
- Filtrowanie — search (case-insensitive, trim), status[] (chips), priority[] (chips)
- Sortowanie — creationDate/priority/status, asc/desc
- Paginacja — 5 tasków (ekran < 630px) lub 10, reset strony przy zmianie filtrów
- Daty — `creationDate`, `lastModifiedDate`, `completeDate` (auto przy status → done)
- Format dat — `DD/MM/YY` + relative (`2 days ago`) via dayjs

### UX

- Toast notifications — sonner, `richColors`, dark mode aware
- Empty state — variant "empty" (brak tasków) / "filtered" (brak wyników)
- Paginacja — ChevronFirst/Last/Left/Right, guard `totalPages <= 1`
- Session warning — modal bez przycisków, jakiekolwiek kliknięcie resetuje timer
- Error Boundary — class component, fallback UI z "Reload page"
- Theme — dark/light, system preference default, localStorage persist, inline script w `<head>` (FOUC mitigation)

### Settings

- `ChangePassForm` — toggle expand, warunkowy render (tylko dla userów z hasłem)
- `DeleteAccountSection` — warunkowy resolver Zod, guard `!user`
- `activeSection` — wzajemne zamykanie sekcji

---

## Hooks

| Hook               | Opis                                 |
| ------------------ | ------------------------------------ |
| `useAuthStore`     | Zustand auth state                   |
| `useThemeStore`    | Zustand theme state                  |
| `useUsers`         | React Query MOCK_USERS               |
| `useDeleteUser`    | mutacja usunięcia konta              |
| `useLogout`        | logout + navigate                    |
| `useTodos`         | React Query todos po userId          |
| `useTodoMutations` | create/update/delete + optimistic    |
| `useTodoFilters`   | filtrowanie + sortowanie + paginacja |
| `useMediaQuery`    | window.matchMedia reactive           |
| `useSessionExpiry` | timery + warning + countdown         |

---

## Testy (33 łącznie, wszystkie zielone)

| Plik                        | Testy                            |
| --------------------------- | -------------------------------- |
| `useTodoFilters.test.ts`    | 18 (13 filtrów + 5 paginacja)    |
| `useTodoMutations.test.tsx` | 5                                |
| `useTodos.test.tsx`         | 1                                |
| `useUsers.test.tsx`         | 4 (1 useUsers + 3 useDeleteUser) |
| `useSessionExpiry.test.ts`  | 5                                |

Patterns: `vi.useFakeTimers()`, `vi.stubGlobal("matchMedia")`, `vi.mock`, `createWrapper` (QueryClient), `beforeEach` reset mock arrays.

---

## Mock Infrastructure (do zastąpienia backendem)

```typescript
MOCK_USERS[]        — 9 userów, 5 z hasłem, 4 bez
MOCK_TODOS[]        — 6 seedów z różnymi statusami/priorytetami
addMockTodo()       — push + invalidateQueries
updateMockTodo()    — find + splice + lastModifiedDate
deleteMockTodo()    — find + splice
addMockUser()       — push + invalidateQueries
deleteMockUser()    — find + splice
```

Swap plan: zamień `queryFn` i `mutationFn` na `axios` calls — reszta kodu bez zmian.

---

## Known Issues / Decisions

- **FOUC przy theme** — CSR limitation w Vite, mitygowany inline scriptem w `<head>`
- **Mock data** — MOCK_TODOS/USERS żyją w pamięci, reset przy odświeżeniu strony
- **ChangePassword** — tylko UI, brak logiki (mock submit `console.log`)
- **completeDate** — ustawiane przy create (status: done) i update (status → done), czyszczone przy zmianie z done
