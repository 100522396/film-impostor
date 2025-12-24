import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Film Impostor',
        short_name: 'Impostor',
        description: 'Adivina la película o engaña a tus amigos.',
        start_url: '/',
        display: 'standalone',
        background_color: '#030712',
        theme_color: '#4f46e5',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
