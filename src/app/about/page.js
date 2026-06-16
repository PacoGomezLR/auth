export default function About() {
    return (
        <main className="about">
            <h1>Sobre el proyecto</h1>
            <p className="about-intro">
                Proyecto de referencia para implementar autenticación completa en aplicaciones
                Next.js modernas usando Auth.js v5 (antes NextAuth.js).
            </p>

            <section className="about-section">
                <h2>¿Qué problema resuelve?</h2>
                <p>
                    Configurar autenticación OAuth desde cero en Next.js implica gestionar
                    tokens, callbacks, sesiones, persistencia de usuarios y protección de rutas.
                    Este proyecto encapsula ese flujo completo como base reutilizable.
                </p>
            </section>

            <section className="about-section">
                <h2>Arquitectura</h2>
                <div className="arch-grid">
                    <div className="arch-card">
                        <h3>Capa de autenticación</h3>
                        <p>
                            Auth.js v5 gestiona el flujo OAuth completo. La configuración
                            central vive en <code>src/auth.js</code> e incluye providers,
                            adapter, estrategia de sesión y callbacks para inyectar el rol
                            en el JWT.
                        </p>
                    </div>
                    <div className="arch-card">
                        <h3>Persistencia</h3>
                        <p>
                            Prisma Adapter sincroniza automáticamente usuarios y cuentas OAuth
                            en PostgreSQL. El schema define modelos <code>User</code> y{' '}
                            <code>Account</code> siguiendo la especificación de Auth.js.
                        </p>
                    </div>
                    <div className="arch-card">
                        <h3>Protección de rutas</h3>
                        <p>
                            Dashboard y Admin son Server Components que llaman a{' '}
                            <code>getSession()</code> en el servidor. Sin sesión válida
                            redirigen a home. Admin además verifica que el rol sea ADMIN.
                        </p>
                    </div>
                    <div className="arch-card">
                        <h3>Server Actions</h3>
                        <p>
                            El login y logout se implementan como Server Actions en{' '}
                            <code>src/lib/actions.js</code>, eliminando la necesidad de
                            endpoints API propios para estas operaciones.
                        </p>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <h2>Flujo de autenticación</h2>
                <ol className="flow-list">
                    <li>Usuario hace clic en "Iniciar sesión con GitHub/Google"</li>
                    <li>Auth.js redirige al proveedor OAuth</li>
                    <li>El proveedor devuelve un código al callback <code>/api/auth/callback/[provider]</code></li>
                    <li>Auth.js intercambia el código por tokens del proveedor</li>
                    <li>Prisma Adapter crea o actualiza el registro en PostgreSQL</li>
                    <li>Se genera un JWT con el ID y rol del usuario</li>
                    <li>El JWT se almacena en una cookie segura HttpOnly</li>
                </ol>
            </section>
        </main>
    )
}
