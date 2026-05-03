# Writer's Loop

[English](README.md) | [简体中文](README_zh.md) | [日本語](README_ja.md) | Español

**Escritura con IA que mejora a partir de tu estilo, aprobaciones y ediciones.**

[![Validate](https://github.com/xxsang/writers-loop/actions/workflows/validate.yml/badge.svg)](https://github.com/xxsang/writers-loop/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![No npm install](https://img.shields.io/badge/npm%20install-not%20required-brightgreen)](package.json)
[![Memory](https://img.shields.io/badge/memory-local%20opt--in-blue)](PRIVACY.md)

<p align="center">
  <img src="assets/writers-loop-overview.svg" alt="Writer's Loop overview" width="720">
</p>

Writer's Loop es una habilidad de escritura portable para agentes de IA. Convierte la
escritura en un proceso revisable: definir el contexto, planificar, redactar, criticar,
proponer cambios, decidir y revisar. Aprende solo de muestras de estilo que
aportas o apruebas y de decisiones que realmente revisas.

Regla central:

```text
Aprender de las decisiones del usuario, no de borradores de IA sin revisar.
```

## Cuándo usarlo

- Planes técnicos, planes de implementación, especificaciones y documentos de diseño
- Informes, memorandos, propuestas y resúmenes de investigación
- Documentación, tutoriales, discursos, ensayos y ficción
- Extracción y reutilización de estilo
- Traducción que debe conservar sentido, tono, formato, terminología y estilo

Para correcciones pequeñas y puntuales, un prompt simple suele bastar. Writer's
Loop es útil cuando la escritura necesita estructura, revisión, reescritura o
decisiones reutilizables.

Usar un LLM para escribir también puede reducir el placer de escribir: puede
comprimir la incertidumbre, el desvío, el descubrimiento y la sensación de
autoría que hacen satisfactoria la escritura. Usa Writer's Loop como andamiaje,
contraparte, editor o traductor. Conserva para ti las partes de escribir que
valoras hacer por tu cuenta.

## Empieza en 30 segundos

```text
Use $writers-loop for this:
[writing task]

Audience: [reader]
Goal: [desired outcome]

Ask only if blocked. Otherwise make a short plan, draft, and brief critique.
Do not save preferences unless I ask.
```

## Configuración con una línea

Si usas Claude Code, Codex, Cursor, Gemini CLI, OpenCode u otro agente local:

```text
Help me install Writer's Loop from https://github.com/xxsang/writers-loop, then use $writers-loop for my writing task without saving preferences unless I explicitly opt in.
```

Si tu versión de Codex u otro agente admite plugins desde repositorios, usa
directamente la URL pública `https://github.com/xxsang/writers-loop`. Para el
uso normal no hace falta `npm install`.

## Privacidad y memoria local

Writer's Loop funciona sin memoria persistente. De forma predeterminada, el
aprendizaje de preferencias solo vive en la sesión actual.

Solo si optas explícitamente por almacenamiento local, las herramientas crean
esta carpeta dentro del proyecto elegido:

```text
.writers-loop/
├── journal.jsonl
├── prefs.md
└── styles/
    └── my-style.md
```

- `.writers-loop/` nunca se crea sin tu aprobación.
- No lo subas a repositorios públicos.
- Solo se guardan paquetes de estilo revisados, no muestras privadas sin procesar.

## Documentación

| Necesidad | Enlace |
| --- | --- |
| README en inglés | [README.md](README.md) |
| Instalación | [docs/installation.md](docs/installation.md) |
| Plantillas de prompts | [docs/prompt-templates.md](docs/prompt-templates.md) |
| Integraciones con herramientas de escritura | [docs/writing-tools.md](docs/writing-tools.md) |
| Almacenamiento local de preferencias | [docs/local-preference-storage.md](docs/local-preference-storage.md) |
| Política de privacidad | [PRIVACY.md](PRIVACY.md) |

## Validación

```bash
npm test
```

No hace falta `npm install` para el uso normal. Los scripts de Node se usan solo
para validación, evaluaciones y herramientas opcionales de almacenamiento local.

## License

MIT
