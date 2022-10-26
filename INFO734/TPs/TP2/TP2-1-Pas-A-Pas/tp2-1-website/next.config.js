/**
 * La variable pour avoir l'adresse (et le port) du Backend
 * Si la variable d'environnement BACKEND_URL est définie alors on la choisit, sinon c'est la valeur 'localhost:3000' que l'on utilisera pour le backend
 */
const backendURL = process.env.BACKEND_URL || "localhost:3000"

// On exporte les configurations
module.exports = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
        return [
            {
                /*
                 On veut que les routes qui commencement par '/api/ soient redirigées vers le backend pour l'API
                 */
                source: '/api/:path*',
                /*
                On utilise un Proxy pour le backend
                Ça nous évitera de mettre l'adresse complète pour faire des appels à l'API, on aura juste à mettre :
                '/api/users' aux lieu de 'http://localhost:3000/api/users'
                 */
                destination: `http://${backendURL}/api/:path*`
            },
            {
                /*
                On veut que les routes qui commencement par '/socket.io/ soient redirigées vers le backend pour la Websocket
                */
                source: '/socket.io/:path*',
                /*
                On utilise un Proxy pour la websocket du backend
                Ça nous évitera de mettre l'adresse complète pour faire des appels à la websocket, on aura juste à mettre
                */
                destination: `http://${backendURL}/socket.io//:path*`
            }
        ]
    },
    env: {
        EASTER: "EGG"
    }
}