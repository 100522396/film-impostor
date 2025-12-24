# Film Impostor 🎬

Juego social de deducción para jugar con amigos. Adivina quién es el que no ha visto la película.

## Cómo Jugar
1.  **Setup**: Elige número de jugadores y filtros (Década, Dificultad).
2.  **Pasar el móvil**: Cada jugador mira su rol en secreto.
    *   **Impostor**: Ve el género, pero no el título.
    *   **Normal**: Ve el título de la película.
3.  **Debate**: Haced preguntas sobre la peli para pillar al impostor.

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar API Key de TMDB
echo "NEXT_PUBLIC_TMDB_API_KEY=tu_api_key" > .env.local

# Arrancar servidor
npm run dev
```

## Despliegue en Vercel

Este proyecto está optimizado para **Vercel**.

1.  Sube tu código a GitHub.
2.  Importa el proyecto en [Vercel](https://vercel.com/new).
3.  Añade la variable de entorno `NEXT_PUBLIC_TMDB_API_KEY` en la configuración del proyecto en Vercel.
4.  ¡Listo!

### ¿Actualizaciones?
Cada vez que hagas un cambio y lo subas a GitHub (`git push`), Vercel actualizará la web automáticamente en unos segundos. ¡Puedes ir mejorándolo poco a poco!

