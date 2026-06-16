import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { DEMO_MODE } from '@/lib/demo'

export default async function Dashboard() {
    const session = await getSession()

    if (!session) redirect('/')

    const { user } = session

    return (
        <main className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                {DEMO_MODE && <span className="demo-badge">Demo Mode</span>}
            </div>

            <div className="user-card">
                <img
                    src={user.image}
                    alt={user.name}
                    className="user-avatar"
                />
                <div className="user-info">
                    <h2>{user.name}</h2>
                    <p className="user-email">{user.email}</p>
                    <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                        {user.role}
                    </span>
                </div>
            </div>

            <div className="session-card">
                <h3>Datos de sesión</h3>
                <pre className="session-json">
                    {JSON.stringify(session, null, 2)}
                </pre>
            </div>

            <div className="dashboard-actions">
                {user.role === 'ADMIN' && (
                    <Link href="/admin" className="btn btn-primary">
                        Ir al panel Admin
                    </Link>
                )}
                <Link href="/" className="btn btn-secondary">
                    Volver al inicio
                </Link>
            </div>
        </main>
    )
}
