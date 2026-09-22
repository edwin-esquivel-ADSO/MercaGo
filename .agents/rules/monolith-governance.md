# Regla de Gobernanza: Monolith Governance Framework (MGF)

## 1. Scaffolding Obligatorio (Monorepo Aislado)
Todo proyecto generado debe seguir estrictamente esta estructura de directorios:
```text
.
├── .agents/                    # Definición de roles, gobernanza y flujos de trabajo
│   ├── roles/
│   ├── rules/
│   └── workflows/
├── apps/
│   ├── web/                    # [A08] React + Vite + TypeScript (SPA Web)
│   └── mobile/                 # [A08m] React Native + Expo + TypeScript (Mobile App)
├── packages/
│   ├── backend/                # [A07] Node.js + Express + TypeScript (API REST)
│   └── database/               # [A10/A13] Prisma ORM + Migraciones + Scripts Neon DDL
├── docs/                       # [A00/A09/A11] Documentación técnica, diagramas y despliegue
├── vercel.json                 # Configuración de despliegue multi-app / backend
├── package.json                # Monorepo root con workspaces configurados
└── .env.example                # Plantilla de variables de entorno documentadas
```

## 2. Regla de Oro: Cero Placeholders (Zero Placeholders)
- Prohibido terminantemente el uso de fragmentos incompletos:
  - `// Tu código aquí`
  - `// ... resto del archivo`
  - `/* TODO: implementar luego */`
- Todos los archivos generados deben contener código integral, fuertemente tipado y listo para compilación y ejecución directa.

## 3. Barreras de Aislamiento
- `apps/web/` no puede importar directamente modelos de backend ni clientes de base de datos; interactúa únicamente mediante llamadas HTTP a la API de `packages/backend/`.
- `apps/mobile/` sigue el mismo aislamiento que la web, consumiendo la API de `packages/backend/`.
- `packages/backend/` delega las operaciones de persistencia exclusivamente a `packages/database/`.
- Ningún paquete puede violar las fronteras de responsabilidad definidas para su rol.
