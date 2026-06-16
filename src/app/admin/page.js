import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { DEMO_MODE } from '@/lib/demo'

const demoUsers = [
    { id: 'demo-user-001', name: 'Paco Gómez',    email: 'paco@example.com',  role: 'ADMIN', active: true },
    { id: 'demo-user-002', name: 'Ana Martínez',   email: 'ana@example.com',   role: 'USER',  active: true },
    { id: 'demo-user-003', name: 'Luis Fernández', email: 'luis@example.com',  role: 'USER',  active: true },
    { id: 'demo-user-004', name: 'Sara López',     email: 'sara@example.com',  role: 'USER',  active: false },
]

export default async function AdminPage() {
    const session = await getSession()

    if (!session) redirect('/')
    if (session.user.role !== 'ADMIN') redirect('/')

    return (
        <main className="admin">
            <div className="admin-header">
                <div>
                    <h1>Panel de administración</h1>
                    <p className="admin-subtitle">
                        Sesión activa: <strong>{session.user.email}</strong>
                    </p>
                </div>
                {DEMO_MODE && <span className="demo-badge">Demo Mode</span>}
            </div>

            <div className="admin-stats">
                <div className="stat-card">
                    <span className="stat-number">4</span>
                    <span className="stat-label">Usuarios totales</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">3</span>
                    <span className="stat-label">Usuarios activos</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">1</span>
                    <span className="stat-label">Administradores</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">2</span>
                    <span className="stat-label">Proveedores OAuth</span>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <h2>Usuarios registrados</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {demoUsers.map(u => (
                            <tr key={u.id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`role-badge role-${u.role.toLowerCase()}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${u.active ? 'status-active' : 'status-inactive'}`}>
                                        {u.active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Link href="/" className="btn btn-secondary">
                Volver al inicio
            </Link>
        </main>
    )
}
