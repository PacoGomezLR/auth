import Link from 'next/link'

export default function Home() {
    return (
        <main className="home">
            <section className="hero">
                <p className="hero-label">Proyecto de portfolio</p>
                <h1>Autenticación OAuth<br />con Next.js y Auth.js v5</h1>
                <p className="hero-subtitle">
                    Implementación de referencia con login social, sesiones JWT,
                    control de roles y persistencia en PostgreSQL mediante Prisma.
                </p>
                <div className="hero-actions">
                    <Link href="/dashboard" className="btn btn-primary">
                        Ver dashboard
                    </Link>
                    <Link href="/about" className="btn btn-secondary">
                        Ver arquitectura
                    </Link>
                </div>
            </section>

            <section className="stack">
                <h2>Stack tecnológico</h2>
                <div className="stack-grid">
                    <div className="stack-card">
                        <div className="stack-indicator"></div>
                        <div className="stack-content">
                            <strong>Next.js 15</strong>
                            <span>App Router · Server Components · Server Actions</span>
                        </div>
                    </div>
                    <div className="stack-card">
                        <div className="stack-indicator"></div>
                        <div className="stack-content">
                            <strong>Auth.js v5</strong>
                            <span>OAuth 2.0 · Sesiones JWT · Páginas personalizadas</span>
                        </div>
                    </div>
                    <div className="stack-card">
                        <div className="stack-indicator"></div>
                        <div className="stack-content">
                            <strong>Prisma + PostgreSQL</strong>
                            <span>ORM tipado · Migraciones · Prisma Adapter</span>
                        </div>
                    </div>
                    <div className="stack-card">
                        <div className="stack-indicator"></div>
                        <div className="stack-content">
                            <strong>Control de roles</strong>
                            <span>Roles USER / ADMIN · Protección de rutas en servidor</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2>Qué implementa</h2>
                <ul className="features-list">
                    <li>Login con Google y GitHub mediante OAuth 2.0</li>
                    <li>Sesiones JWT con rol persistido en el token</li>
                    <li>Rutas protegidas por sesión y por rol en servidor</li>
                    <li>Páginas de autenticación personalizadas (login, logout, error)</li>
                    <li>Adaptador Prisma para persistencia de usuarios y cuentas OAuth</li>
                    <li>Modo demo sin base de datos para desarrollo y portfolio</li>
                </ul>
            </section>
        </main>
    )
}
