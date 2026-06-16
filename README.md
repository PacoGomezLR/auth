# NXAuth — Autenticación OAuth con Next.js 15 y Auth.js v5

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)
![Auth.js](https://img.shields.io/badge/Auth.js_v5-purple?style=flat-square&logo=authjs)
![Prisma](https://img.shields.io/badge/Prisma_6-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Demo](https://img.shields.io/badge/demo-activo-green?style=flat-square)

Implementación completa de autenticación OAuth en Next.js 15 con App Router. Login con Google y GitHub, sesiones JWT con control de roles `USER / ADMIN`, protección de rutas en servidor y persistencia con Prisma sobre PostgreSQL.

**Incluye modo demo funcional — sin base de datos ni credenciales OAuth.**

---

## Capturas

### Panel de administración
![Admin](docs/images/admin.png)

### Dashboard de usuario
![Dashboard](docs/images/dashboard.png)

### Home
![Home](docs/images/home.png)

---

## Qué demuestra este proyecto

Este proyecto no es un tutorial seguido línea a línea. Resuelve problemas reales que aparecen cuando se implementa autenticación en producción:

- **Configuración de Auth.js v5 (beta)** con adaptador Prisma, callbacks JWT personalizados e inyección de roles en el token — no la configuración mínima de la documentación oficial.
- **Control de acceso por rol en servidor**: las rutas `/dashboard` y `/admin` comprueban la sesión antes de renderizar. Sin middleware adicional, sin client-side guards que se puedan saltarse.
- **Modo demo con zero dependencias**: implementado con `dynamic import` para que `Prisma` y `Auth.js` nunca se carguen en modo demo. Ninguna variable de entorno crítica requerida para ejecutar el proyecto.
- **Server Actions para autenticación**: `loginGoogle()`, `loginGithub()` y `logout()` son Server Actions — sin endpoints API propios, sin `fetch()` desde el cliente.
- **Modelo de datos OAuth**: schema Prisma con relación `User → Account[]` siguiendo la especificación de Auth.js, con `onDelete: Cascade` y constraint `@@unique([provider, providerAccountId])`.

---

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js — App Router | 15 |
| Autenticación | Auth.js (next-auth) | v5 beta |
| Base de datos | PostgreSQL | — |
| ORM | Prisma | 6 |
| Adapter | @auth/prisma-adapter | 2 |
| Estilos | CSS puro con variables | — |
| Runtime | React | 19 |

---

## Arquitectura

```
src/
├── auth.js                           # Configuración central de Auth.js
│                                     # providers, PrismaAdapter, callbacks JWT
├── lib/
│   ├── prisma.js                     # Singleton de PrismaClient
│   ├── actions.js                    # Server Actions: login y logout
│   ├── demo.js                       # Flag DEMO_MODE y sesión ficticia
│   └── session.js                    # getSession(): abstracción demo/real
├── app/
│   ├── page.js                       # Home
│   ├── about/page.js                 # Arquitectura del proyecto
│   ├── dashboard/page.js             # Ruta protegida por sesión
│   ├── admin/page.js                 # Ruta protegida por rol ADMIN
│   └── auth/
│       ├── signin/page.js            # Login personalizado
│       ├── signout/page.js           # Logout
│       └── error/page.js             # Errores OAuth
│   └── api/auth/[...nextauth]/
│       └── route.js                  # Handler de Auth.js
└── components/
    └── header.js                     # Navegación con estado de sesión
```

### Flujo OAuth

```
/auth/signin
  └── Server Action loginGithub() / loginGoogle()
        └── Auth.js → redirección al proveedor
              └── Callback /api/auth/callback/[provider]
                    └── Prisma Adapter → crea o actualiza User + Account
                          └── JWT generado con { sub, role }
                                └── Cookie HttpOnly → sesión activa
```

### Control de roles

```js
// src/auth.js — el rol se inyecta en el token en cada request
async jwt({ token }) {
  const user = await prisma.user.findUnique({ where: { id: token.sub } })
  token.role = user?.role
  return token
}

// dashboard/page.js — verificación en servidor antes de renderizar
const session = await getSession()
if (!session) redirect('/')
if (session.user.role !== 'ADMIN') redirect('/')
```

### Modo demo — decisión técnica

El modo demo usa `dynamic import` para garantizar que `@/auth` (y por tanto `PrismaClient`) **nunca se instancia** cuando `NEXT_PUBLIC_DEMO_MODE=true`. Un import estático habría crasheado en la inicialización del módulo aunque la función nunca se llamara.

```js
// src/lib/session.js
export async function getSession() {
  if (DEMO_MODE) return demoSession               // Prisma nunca se toca
  const { auth } = await import('@/auth')         // lazy — solo en modo real
  return auth()
}
```

---

## Retos y decisiones

**Bug de providers invertidos**
Al configurar Auth.js v5 los imports de `google` y `github` estaban cruzados — el provider nombrado `Google` apuntaba al módulo de GitHub y viceversa. El flujo OAuth funciona internamente porque Auth.js lo detecta por el `id` del provider, pero las páginas de signin personalizadas recibían el nombre incorrecto. Detectado al comparar el `provider` devuelto en el callback con el nombre del botón pulsado.

**Instanciación de Prisma en módulos**
En Next.js, los imports estáticos se resuelven en tiempo de carga del módulo, no en tiempo de ejecución de la función. Importar `auth` directamente habría instanciado `PrismaClient` aunque el código de la función lo ignorara con un `if`. La solución es `dynamic import` dentro de `getSession()`, que difiere la resolución hasta que la función se ejecuta — y en modo demo nunca se ejecuta esa rama.

**Sesión en Server Components vs Client Components**
Auth.js v5 expone `auth()` solo en servidor. Para no propagar el import de `@/auth` por toda la aplicación, se creó `getSession()` como punto de entrada único — cualquier componente que necesite la sesión lo hace a través de esta abstracción, que gestiona tanto el modo demo como el modo real.

---

## Aprendizajes

- Auth.js v5 cambia significativamente respecto a v4: la configuración es un objeto exportado desde `auth.js`, no un array de opciones en `pages/api/auth`. Los handlers `GET` y `POST` se exportan directamente al route handler.
- El `PrismaAdapter` requiere exactamente los modelos `User` y `Account` con los campos de la especificación de Auth.js. Cualquier campo faltante o renombrado rompe silenciosamente el callback de OAuth.
- Los Server Actions de Next.js 15 simplifican el flujo de autenticación: `loginGoogle()` llama directamente a `signIn('google')` sin necesitar un endpoint `/api/auth/signin` propio.
- `NEXT_PUBLIC_` expone la variable al cliente, pero también está disponible en servidor — útil para que un Server Component decida sin necesidad de una API route.

---

## Instalación

### Modo demo — sin base de datos

```bash
git clone <url-del-repo> && cd nxauth
npm install
cp .env.example .env          # NEXT_PUBLIC_DEMO_MODE=true ya está activo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Modo real — con PostgreSQL y OAuth

```bash
git clone <url-del-repo> && cd nxauth
npm install
cp .env.example .env
```

Edita `.env`:

```env
NEXT_PUBLIC_DEMO_MODE=false
DATABASE_URL="postgresql://usuario:password@localhost:5432/nxauth"
AUTH_SECRET=""          # npx auth secret
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

```bash
npx prisma db push
npm run dev
```

**Callback URLs para los proveedores OAuth:**
- GitHub: `http://localhost:3000/api/auth/callback/github`
- Google: `http://localhost:3000/api/auth/callback/google`

---

## Schema de base de datos

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          String?   @default("USER")   // USER | ADMIN
  active        Boolean?  @default(true)
  accounts      Account[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}
```

---

## Scripts

```bash
npm run dev         # Desarrollo en localhost:3000
npm run build       # Build de producción
npm run start       # Producción
npx prisma studio   # GUI de base de datos
npx prisma db push  # Sincronizar schema
npx auth secret     # Generar AUTH_SECRET
```

---

## Rutas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Home y stack del proyecto |
| `/about` | Público | Arquitectura y flujo OAuth |
| `/auth/signin` | Público | Login con Google / GitHub |
| `/dashboard` | Sesión requerida | Perfil e información de sesión |
| `/admin` | Rol ADMIN | Panel de usuarios |
| `/api/auth/[...nextauth]` | Auth.js | Handler OAuth interno |
