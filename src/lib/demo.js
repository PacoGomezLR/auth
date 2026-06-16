export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const demoSession = {
    user: {
        id: 'demo-user-001',
        name: 'Paco Gómez',
        email: 'paco@example.com',
        image: 'https://api.dicebear.com/9.x/initials/svg?seed=PG&backgroundColor=4f46e5&textColor=ffffff',
        role: 'ADMIN',
    },
    expires: '2099-12-31T00:00:00.000Z',
}
