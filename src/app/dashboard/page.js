import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'

export default async function Dashboard() {
    const session = await getSession()

    if (!session) redirect('/')

    const { user } = session

    const expiry = session.expires
        ? new Date(session.expires).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
          })
        : '—'

    return (
        <main className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
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
                <h3>Información de sesión</h3>
                <div className="session-fields">
                    <div className="session-field">
                        <span className="session-field-label">ID de usuario</span>
                        <span className="session-field-value session-field-mono">{user.id}</span>
                    </div>
                    <div className="session-field">
                        <span className="session-field-label">Correo electrónico</span>
                        <span className="session-field-value">{user.email}</span>
                    </div>
                    <div className="session-field">
                        <span className="session-field-label">Rol</span>
                        <span className="session-field-value">
                            <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                                {user.role}
                            </span>
                        </span>
                    </div>
                    <div className="session-field">
                        <span className="session-field-label">Estado</span>
                        <span className="session-field-value">
                            <span className="status-badge status-active">Activa</span>
                        </span>
                    </div>
                    <div className="session-field">
                        <span className="session-field-label">Expira</span>
                        <span className="session-field-value">{expiry}</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-actions">
                {user.role === 'ADMIN' && (
                    <Link href="/admin" className="btn btn-primary">
                        Panel de administración
                    </Link>
                )}
                <Link href="/auth/signout" className="btn btn-secondary">
                    Cerrar sesión
                </Link>
            </div>
        </main>
    )
}
