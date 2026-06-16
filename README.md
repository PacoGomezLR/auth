# Auth.js v5 — OAuth con Next.js, Prisma y PostgreSQL

Proyecto de referencia para autenticación OAuth completa en Next.js 15 usando Auth.js v5. Incluye login con Google y GitHub, sesiones JWT, control de roles (USER / ADMIN), adaptador Prisma y páginas de auth personalizadas.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| Autenticación | Auth.js v5 (next-auth beta) |
| Base de datos | PostgreSQL |
| ORM | Prisma 6 |
| Adapter | @auth/prisma-adapter |
| Estilos | CSS puro (variables, sin framework) |
| Runtime | Node.js / React 19 |

---

## Arquitectura

```
src/
├── auth.js                          # Configuración central de Auth.js
│   └── providers, adapter, callbacks JWT
├── lib/
│   ├── prisma.js                    # Instancia singleton de PrismaClient
│   ├── actions.js                   # Server Actions: loginGoogle, loginGithub, logout
│   ├── demo.js                      # Datos ficticios y flag DEMO_MODE
│   └── session.js                   # getSession(): abstracción demo/real
├── app/
│   ├── page.js                      # Home — descripción del proyecto
│   ├── about/page.js                # Arquitectura y flujo OAuth
│   ├── dashboard/page.js            # Ruta protegida por sesión
│   ├── admin/page.js                # Ruta protegida por rol ADMIN
│   └── auth/
│       ├── signin/page.js           # Página de login personalizada
│       ├── signout/page.js          # Página de logout
│       └── error/page.js            # Página de error OAuth
├── api/auth/[...nextauth]/route.js  # Handler de Auth.js
└── components/
    └── header.js                    # Navegación con estado de sesión
```

### Flujo de autenticación

```
Usuario → /auth/signin
  → Server Action loginGithub() / loginGoogle()
  → Auth.js redirige al proveedor OAuth
  → Proveedor devuelve código a /api/auth/callback/[provider]
  → Prisma Adapter crea/actualiza User + Account en PostgreSQL
  → Auth.js genera JWT con { sub, role }
  → Cookie segura HttpOnly → sesión activa
```

### Control de roles

El rol se persiste en la base de datos (`User.role`) y se inyecta en el JWT en el callback `jwt`. El callback `session` lo expone en `session.user.role`. Las rutas protegidas comprueban el rol en el servidor antes de renderizar.

---

## Modo Demo

El proyecto incluye un modo demo que permite ejecutar la aplicación **sin PostgreSQL ni credenciales OAuth**. Útil para desarrollo local rápido y capturas de portfolio.

### Cómo funciona

`NEXT_PUBLIC_DEMO_MODE=true` activa una sesión ficticia en `src/lib/session.js` mediante **dynamic import**: `@/auth` (y por tanto Prisma) **nunca se importa** en modo demo, eliminando cualquier dependencia de base de datos.

```
getSession()
  ├── DEMO_MODE=true  → devuelve demoSession (sin tocar Prisma)
  └── DEMO_MODE=false → dynamic import('@/auth') → auth() real
```

### Usuario demo

```json
{
  "name": "Paco Gómez",
  "email": "paco@example.com",
  "role": "ADMIN"
}
```

---

## Instalación

### Modo Demo (sin base de datos)

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd auth-main

# 2. Instalar dependencias
npm install

# 3. Crear archivo de entorno
cp .env.example .env
# Asegúrate de que NEXT_PUBLIC_DEMO_MODE=true en el .env

# 4. Arrancar
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Modo Real (con PostgreSQL y OAuth)

```bash
# 1. Clonar e instalar
git clone <url-del-repo>
cd auth-main
npm install

# 2. Configurar entorno
cp .env.example .env
# Edita .env:
#   NEXT_PUBLIC_DEMO_MODE=false
#   DATABASE_URL=postgresql://...
#   AUTH_SECRET=<genera con: npx auth secret>
#   AUTH_GITHUB_ID / AUTH_GITHUB_SECRET
#   AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET

# 3. Crear tablas en PostgreSQL
npx prisma db push

# 4. Arrancar
npm run dev
```

### Credenciales OAuth

**GitHub** — [github.com/settings/developers](https://github.com/settings/developers)
- Application type: OAuth App
- Callback URL: `http://localhost:3000/api/auth/callback/github`

**Google** — [console.cloud.google.com](https://console.cloud.google.com)
- Tipo: Aplicación web
- URI de redireccionamiento: `http://localhost:3000/api/auth/callback/google`

---

## Pantallas

| Ruta | Descripción |
|---|---|
| `/` | Home con descripción del proyecto y stack |
| `/about` | Arquitectura, flujo OAuth y decisiones técnicas |
| `/auth/signin` | Login con Google y GitHub |
| `/dashboard` | Perfil de usuario y datos de sesión (protegida) |
| `/admin` | Panel de administración con tabla de usuarios (solo ADMIN) |

---

## Schema de base de datos

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          String?   @default("USER")
  active        Boolean?  @default(true)
  accounts      Account[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  // ... campos OAuth estándar de Auth.js
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}
```

---

## Scripts

```bash
npm run dev        # Servidor de desarrollo en localhost:3000
npm run build      # Build de producción
npm run start      # Servidor de producción
npx prisma studio  # GUI para explorar la base de datos
npx prisma db push # Sincronizar schema con la base de datos
```
