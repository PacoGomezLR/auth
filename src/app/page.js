import Link from 'next/link'

export default function Home() {
    return (
        <main className="home">
            <section className="hero">
                <h1>Auth.js v5 + Next.js</h1>
                <p className="hero-subtitle">
                    Autenticación OAuth con Google y GitHub, sesiones JWT,
                    control de roles y adaptador Prisma sobre PostgreSQL.
                </p>
                <div className="hero-actions">
                    <Link href="/auth/signin" className="btn btn-primary">
                        Ver demo de login
                    </Link>
                    <Link href="/dashboard" className="btn btn-secondary">
                        Ver dashboard
                    </Link>
                </div>
            </section>

            <section className="stack">
                <h2>Stack tecnológico</h2>
                <div className="stack-grid">
                    <div className="stack-card">
                        <span className="stack-icon">⚡</span>
                        <strong>Next.js 15</strong>
                        <span>App Router, Server Components, Server Actions</span>
                    </div>
                    <div className="stack-card">
                        <span className="stack-icon">🔐</span>
                        <strong>Auth.js v5</strong>
                        <span>OAuth 2.0, JWT sessions, custom pages</span>
                    </div>
                    <div className="stack-card">
                        <span className="stack-icon">🗄️</span>
                        <strong>Prisma + PostgreSQL</strong>
                        <span>ORM tipado, migraciones, Prisma Adapter</span>
                    </div>
                    <div className="stack-card">
                        <span className="stack-icon">🛡️</span>
                        <strong>Control de roles</strong>
                        <span>USER / ADMIN con protección de rutas</span>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2>Funcionalidades</h2>
                <ul className="features-list">
                    <li>Login con Google y GitHub (OAuth 2.0)</li>
                    <li>Sesiones JWT con rol persistido en token</li>
                    <li>Rutas protegidas por sesión y por rol</li>
                    <li>Páginas de auth personalizadas (signin, signout, error)</li>
                    <li>Adaptador Prisma para persistencia de usuarios y cuentas</li>
                    <li>Modo demo sin base de datos para desarrollo</li>
                </ul>
            </section>
        </main>
    )
}
