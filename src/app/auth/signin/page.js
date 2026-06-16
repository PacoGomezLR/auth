import { loginGoogle, loginGithub } from '@/lib/actions'
import { DEMO_MODE } from '@/lib/demo'

const errorMessages = new Map([
    ['OAuthSignin',           'Error al construir la URL de autorización.'],
    ['OAuthCallback',         'Error al gestionar la respuesta del proveedor.'],
    ['OAuthCreateAccount',    'No se pudo crear el usuario en la base de datos.'],
    ['EmailCreateAccount',    'No se pudo crear el usuario de correo electrónico.'],
    ['Callback',              'Error en el callback de OAuth.'],
    ['OAuthAccountNotLinked', 'Este correo ya está registrado con otro proveedor.'],
    ['EmailSignin',           'Comprueba tu dirección de correo electrónico.'],
    ['CredentialsSignin',     'Credenciales incorrectas.'],
    ['SessionRequired',       'Debes iniciar sesión para acceder.'],
    ['Default',               'No se puede iniciar sesión.'],
])

export default async function SignIn({ searchParams }) {
    const { error } = await searchParams

    return (
        <>
            <div className="signin-card">
                <p className="signin-brand">NXAuth</p>
                <h1>Iniciar sesión</h1>
                <p className="signin-subtitle">
                    Accede con tu cuenta de Google o GitHub
                </p>

                {error && (
                    <div className="signin-error">
                        {errorMessages.get(error) ?? errorMessages.get('Default')}
                    </div>
                )}

                {DEMO_MODE && (
                    <div className="demo-notice">
                        Modo demo activo. Explora la aplicación con datos de ejemplo.
                    </div>
                )}

                <form className="signin-form">
                    <button formAction={DEMO_MODE ? undefined : loginGoogle} disabled={DEMO_MODE}>
                        <img src="/google.svg" alt="Google" width={20} height={20} />
                        Continuar con Google
                    </button>
                    <button formAction={DEMO_MODE ? undefined : loginGithub} disabled={DEMO_MODE}>
                        <img src="/github.svg" alt="GitHub" width={20} height={20} />
                        Continuar con GitHub
                    </button>
                </form>
            </div>
        </>
    )
}
