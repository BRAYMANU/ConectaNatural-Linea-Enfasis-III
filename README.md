# ConectaNatural

Plataforma web para consulta de informacion cientificamente validada sobre medicina complementaria, nutricion, terapias y bienestar. Proyecto de tesis (semilleros) con arquitectura fullstack.

## Stack tecnologico

**Backend**
- Java 17, Spring Boot 4.0.5 (Gradle)
- Spring Security 6 + JWT (JJWT 0.12.6)
- OpenAPI / Swagger UI
- HTTPS con TLS 1.3
- KeyStore PKCS12 para entorno local
- JPA / Hibernate
- SQL Server (Microsoft SQL Server + SSMS)
- Arquitectura 4 capas: controller, service, repository, model

**Frontend**
- React 18 + Vite 5
- TailwindCSS 3.4
- Framer Motion, Lucide Icons
- Axios (con interceptors JWT)
- React Router DOM 6

## Estructura del proyecto

```
Tesis_proyectoSemilleros/
├── build.gradle
├── settings.gradle
├── scripts/
│   ├── create_database.sql
│   └── create_database_actividad.sql
├── src/main/java/com/example/tesis_proyectosemilleros/
│   ├── TesisProyectoSemillerosApplication.java
│   ├── config/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── dto/
│   ├── security/
│   ├── exception/
│   └── seeder/
├── src/main/resources/
│   ├── application-example.properties
│   ├── application.yml
│   └── certs/
│       └── conectanatural-local.p12   # No se publica en Git
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── .env.example
    └── src/
```

## Requisitos previos

- Java 17 (JDK)
- Node.js 18 o superior
- SQL Server instalado + SQL Server Management Studio (SSMS)
- Gradle (opcional: viene con wrapper)

## Paso 1 — Crear la base de datos

Para trabajar con la versión utilizada en esta actividad, abre SSMS, conecta a tu instancia local y ejecuta:

```
scripts/create_database_actividad.sql
```

Esto crea la base de datos `conectanatural_actividad_db`. Las tablas las crea Hibernate automaticamente al primer arranque (`spring.jpa.hibernate.ddl-auto=update`).

### Configurar credenciales de BD

El archivo `src/main/resources/application.properties` contiene la configuración local y no se incluye en el repositorio. Utiliza `application-example.properties` como referencia para crear y configurar tu archivo local.

```
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=conectanatural_actividad_db;encrypt=true;trustServerCertificate=true
spring.datasource.username=TU_USUARIO_SQL_SERVER
spring.datasource.password=TU_PASSWORD_SQL_SERVER
```

Si SQL Server escucha en otra instancia o puerto, ajusta la URL.

## Paso 2 — Backend

El archivo `application.properties` no se incluye en el repositorio porque contiene configuraciones locales y datos sensibles. Utiliza `application-example.properties` como referencia para configurar tu entorno.

### Generar certificado local para HTTPS

El KeyStore PKCS12 utilizado para HTTPS no se publica en Git por seguridad. Antes de iniciar el backend, crea la carpeta:

```powershell
New-Item -ItemType Directory -Force src\main\resources\certs
```

Luego genera un certificado local:

```powershell
keytool -genkeypair -alias conectanatural -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore "src\main\resources\certs\conectanatural-local.p12" -validity 3650 -dname "CN=localhost, OU=Desarrollo, O=ConectaNatural, L=Tuquerres, ST=Narino, C=CO" -ext "SAN=dns:localhost,ip:127.0.0.1"
```

La contraseña utilizada para el KeyStore debe configurarse localmente en `application.properties` mediante:

```properties
app.tls.keystore-password=TU_PASSWORD_DEL_KEYSTORE
```

Desde la raíz del proyecto ejecuta:

```bash
./gradlew bootRun
```

El backend queda disponible en:

`https://localhost:8443`

Swagger UI queda disponible en:

`https://localhost:8443/swagger-ui/index.html`

Al utilizar un certificado autofirmado, el navegador puede mostrar una advertencia de seguridad durante el desarrollo local.

En el primer arranque el `DataSeeder` crea:

- un usuario administrador utilizando los datos configurados localmente en `application.properties`;
- las categorías raíz `productos-naturales`, `nutricion`, `terapias` y `precauciones`.

## Paso 3 — Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La app queda disponible en **http://localhost:5173**.

El archivo local  `frontend/.env` deve utilizar `https://localhost:8443/api`.
El archivo `.env` no se incluye en el repositorio. Se proporciona `frontend/.env.example` como referencia.

Debido a que el backend utiliza un certificado autofirmado durante el desarrollo, el navegador puede solicitar que se acepte el certificado local antes de permitir la comunicación del frontend con la API.

## Roles y flujo

- **USER** (rol por defecto al registrarse): solo lectura del dashboard, categorias, productos y contenidos publicados.
- **ADMIN**: CRUD completo sobre categorias, productos, contenidos educativos, fuentes cientificas y usuarios.

Registro de nuevos usuarios siempre crea rol USER. La promocion a ADMIN solo puede hacerla otro ADMIN via `/api/admin/usuarios`.

## Endpoints principales

### Publicos

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de USER |
| POST | `/api/auth/login` | Login (devuelve JWT) |
| GET  | `/api/auth/me` | Usuario autenticado |
| GET  | `/api/public/health` | Health check |

### Categorias (USER + ADMIN)

| Metodo | Ruta |
|--------|------|
| GET | `/api/categorias/raices` |
| GET | `/api/categorias/{padreId}/subcategorias` |
| GET | `/api/categorias/slug/{slug}` |
| GET | `/api/categorias/{id}/detalle` |

CRUD ADMIN: `POST`, `PUT`, `DELETE` en `/api/categorias/**`.

### Productos (USER + ADMIN)

| Metodo | Ruta |
|--------|------|
| GET | `/api/productos/categoria/{id}` |
| GET | `/api/productos/slug/{slug}` |
| GET | `/api/productos/{id}/detalle` |

CRUD ADMIN en `/api/productos/**`.

### Contenido educativo

| Metodo | Ruta | Rol |
|--------|------|-----|
| GET | `/api/contenidos/publicados` | Publico/USER |
| CRUD | `/api/contenidos/**` | ADMIN |

### Fuentes cientificas

| Metodo | Ruta | Rol |
|--------|------|-----|
| GET | `/api/fuentes/contenido/{id}` | USER + ADMIN |
| CRUD | `/api/fuentes/**` | ADMIN |

### Administracion

| Metodo | Ruta | Rol |
|--------|------|-----|
| ALL | `/api/admin/usuarios/**` | ADMIN |

## Autenticacion

Todas las rutas protegidas requieren el header:

```
Authorization: Bearer <JWT>
```

El frontend lo inyecta automaticamente mediante un interceptor de Axios. Ante `401`, el interceptor limpia `localStorage` y redirige a `/login`.

## Vistas del frontend

- `/` — Landing publica (hero, beneficios, categorias, sobre nosotros).
- `/login`, `/register` — Auth.
- `/dashboard` — 4 categorias raiz con iconos.
- `/dashboard/categoria/:slug` — Productos (si es `productos-naturales`) o subcategorias.
- `/dashboard/subcategoria/:id` — Subcategoria + contenido admin + fuentes cientificas.
- `/dashboard/producto/:id` — Producto + contenido admin + fuentes cientificas.

Toda vista de detalle incluye el componente `AdvertenciaMedica` para cumplir la recomendacion de disclaimer medico.

## Troubleshooting

## Troubleshooting

- **Error de conexión con SQL Server**: verifica que SQL Server Authentication esté habilitado, que las credenciales locales sean correctas y que el servicio esté iniciado.
- **Puerto 8443 ocupado**: verifica qué proceso está utilizando el puerto configurado para HTTPS antes de iniciar el backend.
- **Advertencia de certificado en el navegador**: el entorno local utiliza un certificado autofirmado, por lo que puede ser necesario aceptar manualmente el certificado de `https://localhost:8443`.
- **CORS**: si el frontend se ejecuta desde otro origen, revisa la configuración permitida en el backend.
- **Las tablas no se crean**: verifica que el usuario SQL tenga permisos sobre `conectanatural_actividad_db`.

## Notas de arquitectura

- JWT firmado mediante una clave HMAC configurada localmente en `application.properties`.
- Contraseñas con BCrypt.
- `ContenidoEducativo` es polimorfico: puede pertenecer a un `Producto` o a una `Categoria` (validacion en capa de servicio).
- `Categoria` tiene auto-referencia para jerarquia padre/hijo.
- Eliminacion de contenidos hace cascade sobre `FuenteCientifica`.
- Control de acceso por roles y métodos HTTP mediante `SecurityConfig`.
