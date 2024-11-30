Ticnify es un proyecto basado en [Next.js](https://nextjs.org) creado con [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). Ticnify es una plataforma para la gestión de herramientas TIC por parte de Universidad de Cartagena.Esta plataforma esta enfocada para gestores de proyectos.

## ¿Empezamos?

Indicaciones para el inicio del servidor:

```bash
# Iniciamos los contenedores de la app.
docker compose up -d
# Instalamos las dependencias necesarias para el entorno de desarrollo.
npm i
# Migramos la Base de Datos en modo de desarrollo, esta proporciona una interfaza interactiva para confirmar o modificar datos.
npx prisma migrate dev
# Ejecutamos el script para iniciar la App en modo de desarrollo.
npm run dev
```

 Para ver el resultado, abrimos el navegador de confianza y escribimos [http://localhost:3000](http://localhost:3000)

Para poder modificar  o editar la página, anexamos en la URL lo siguiente: `app/page.tsx`. La página se actualiza a medida que editas el archivo.

Para la conexión a la base de datos se tiene que renoombrar el archivo ".env.template" a ".env"

Al momento de instalar las dependencias, si ya existe el archivo "yarn.lock" previo a la instalación eliminarlo y ejecutar el comando en la terminal correspondiente.