import Link from 'next/link'
import { getSession } from '@/lib/session'
import { DEMO_MODE } from '@/lib/demo'

async function Header() {
    const session = await getSession()

    return (
        <header>
            <div className="header-nav">
                <Link href="/">Inicio</Link>
                <Link href="/about">About</Link>
                <Link href="/dashboard">Dashboard</Link>
                {session?.user?.role === 'ADMIN' && (
                    <Link href="/admin">Admin</Link>
                )}
            </div>
            <div className="header-right">
                {DEMO_MODE && (
                    <span className="demo-badge">Demo Mode</span>
                )}
                <nav>
                    {session
                        ? <Link href="/auth/signout">Cerrar sesión</Link>
                        : <Link href="/auth/signin">Iniciar sesión</Link>
                    }
                </nav>
            </div>
        </header>
    )
}

export default Header
