/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers(){
        return [
            {
                source: '/api/v1/video',
                headers: [
                    {
                        key: 'Orign',
                        value: 'http://localhost:80'
                    }
                ]
            }
        ]
    },
    reactStrictMode: false
}

module.exports = nextConfig
