import Link from 'next/link'
import { getSession } from '@/lib/session'
import { DEMO_MODE } from '@/lib/demo'

async function Header() {
    const session = await getSession()

    const signOutHref = DEMO_MODE ? '/' : '/auth/signout'

    return (
        <header>
            <div className="header-nav">
                <Link href="/" className="header-logo">NXAuth</Link>
                <nav className="header-links">
                    <Link href="/">Inicio</Link>
                    <Link href="/about">Arquitectura</Link>
                    <Link href="/dashboard">Dashboard</Link>
                    {session?.user?.role === 'ADMIN' && (
                        <Link href="/admin">Admin</Link>
                    )}
                </nav>
            </div>

            <div className="header-right">
                {DEMO_MODE && (
                    <span className="demo-badge">Demo</span>
                )}
                {session ? (
                    <div className="header-user">
                        <img
                            src={session.user.image}
                            alt={session.user.name}
                            className="header-avatar"
                        />
                        <span className="header-username">{session.user.name}</span>
                        <Link href={signOutHref} className="header-signout">Salir</Link>
                    </div>
                ) : (
                    <Link href="/auth/signin" className="btn btn-primary btn-sm">
                        Iniciar sesión
                    </Link>
                )}
            </div>
        </header>
    )
}

export default Header
