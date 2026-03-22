# Publicacion por API

Este proyecto incluye un flujo para crear un repositorio privado en GitHub por API y hacer `push` del contenido.

## Variables requeridas

Usa estas variables de entorno:

```bash
GITHUB_TOKEN=...
GITHUB_OWNER=saltbalente
GITHUB_REPO=brujeriawebedwar
GITHUB_PRIVATE=true
```

## Comando

Desde este directorio:

```bash
npm run github:publish
```

## Que hace

1. Crea el repo si no existe.
2. Inicializa git local si hace falta.
3. Crea la rama `main`.
4. Agrega, commitea y hace `push`.
5. Limpia la URL remota para no dejar el token guardado en `.git/config`.
