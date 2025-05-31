# OL Software Frontend

Este es el frontend de la aplicación OL Software, desarrollado con Next.js 15, React 19, TypeScript y TailwindCSS.

## Requisitos Previos

- Node.js (versión recomendada: 18.x o superior)
- Yarn (como gestor de paquetes)

## Tecnologías Principales

- Next.js 15.3.3
- React 19.0.0
- TypeScript 5
- TailwindCSS 4
- Zustand (manejo de estado)
- React Query (manejo de datos del servidor)
- React Hook Form (manejo de formularios)
- Zod (validación de esquemas)

## Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd ol-software-frontend
```

2. Instala las dependencias:

```bash
yarn install
```

3. Copia el archivo de variables de entorno:

```bash
cp env_example .env
```

4. Configura las variables de entorno en el archivo `.env`:

```env
NEXT_PUBLIC_API_URL=<URL_DE_TU_API>
```

## Scripts Disponibles

- `yarn dev`: Inicia el servidor de desarrollo con Turbopack
- `yarn build`: Construye la aplicación para producción
- `yarn start`: Inicia el servidor de producción
- `yarn lint`: Ejecuta el linter para verificar el código

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # Rutas y páginas de la aplicación
│   │   ├── (auth)/            # Rutas de autenticación
│   │   └── (private)/         # Rutas privadas
│   ├── components/            # Componentes reutilizables
│   │   ├── auth/             # Componentes de autenticación
│   │   ├── layout/           # Componentes de layout
│   │   └── ui/               # Componentes de UI
│   ├── context/              # Contextos de React
│   ├── interface/            # Interfaces y tipos de TypeScript
│   ├── lib/                  # Utilidades y configuraciones
│   └── providers/            # Proveedores de la aplicación
├── public/                   # Archivos estáticos
└── ...                      # Archivos de configuración
```

## Características

- 🔐 Autenticación de usuarios
- 🎨 UI moderna con TailwindCSS
- 📱 Diseño responsive
- 🚀 Rendimiento optimizado con Next.js
- 💻 TypeScript para mejor desarrollo
- 🔄 Manejo de estado con Zustand
- 📝 Validación de formularios con React Hook Form y Zod

## Dependencias Principales

### Producción

- `@hookform/resolvers`: ^5.0.1
- `@radix-ui/react-*`: Componentes de UI
- `@tanstack/react-query`: ^5.79.0
- `jwt-decode`: ^4.0.0
- `zustand`: ^5.0.5

### Desarrollo

- `typescript`: ^5
- `eslint`: ^9
- `tailwindcss`: ^4

## Configuración de IDE Recomendada

Para obtener la mejor experiencia de desarrollo, recomendamos:

- VSCode con las siguientes extensiones:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

## Contribución

1. Crea un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Realiza tus cambios
4. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT.
