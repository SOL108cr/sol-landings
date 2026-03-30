# School of Love — Landing Pages Central

Repositorio central de todas las páginas web de School of Love.
Cada carpeta = un proyecto. Cada `git push` despliega todo automáticamente.

## Proyectos activos

| Carpeta | URL Live | Plataforma | Descripción |
|---|---|---|---|
| `rda-ceremonia-online/` | [rda-ceremonia-online.pages.dev](https://rda-ceremonia-online.pages.dev) | CF Pages | Landing RDA Online Mayo 2026 |
| `rda-acceso-anticipado/` | [rda-acceso-anticipado.pages.dev](https://rda-acceso-anticipado.pages.dev) | CF Pages | Pre-registro Respiración del Alma |
| `comunicacion-celestial/` | [comunicacion-celestial.pages.dev](https://comunicacion-celestial.pages.dev) | CF Pages | Taller Comunicación Celestial |
| `meditacion-luz-cristica/` | [meditacion-luz-cristica.theaugmentedleader.workers.dev](https://meditacion-luz-cristica.theaugmentedleader.workers.dev) | CF Worker | Meditación de Luz Crística |

## Flujo de trabajo

```
Claude edita HTML  →  git push  →  GitHub Actions  →  Cloudflare (auto-deploy ~60 seg)
```

## Agregar un proyecto nuevo

1. Crear carpeta `nuevo-proyecto/` con `index.html`
2. Crear el proyecto en Cloudflare Pages dashboard (solo primera vez)
3. Agregar nuevo job en `.github/workflows/deploy.yml`
4. `git push` — listo, nunca más intervención manual

## Secreto requerido en GitHub

`CLOUDFLARE_API_TOKEN` → Settings → Secrets and variables → Actions
