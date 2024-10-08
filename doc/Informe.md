# PetSociety API Report

## 1. Introducción

PetSociety es una API RESTful desarrollada con NestJS para gestionar una clínica veterinaria. La API proporciona endpoints para manejar usuarios, pacientes, mascotas, citas y registros médicos.

## 2. Arquitectura General

La API está estructurada siguiendo los principios de arquitectura limpia y modular de NestJS:

- `src/`
  - `auth/`: Módulo de autenticación y autorización
  - `patients/`: Módulo para gestionar pacientes
  - `pets/`: Módulo para gestionar mascotas
  - `appointments/`: Módulo para gestionar citas
  - `medical_records/`: Módulo para gestionar registros médicos
  - `common/`: Módulo para elementos compartidos

Cada módulo contiene sus propios controladores, servicios, DTOs y entidades.

## 3. Autenticación y Autorización

### Implementación

- Se utiliza JWT (JSON Web Tokens) para la autenticación.
- La autorización se maneja mediante roles de usuario: 'admin', 'vet', y 'owner'.
- Se implementa un guard personalizado `JwtAuthGuard` para proteger rutas.
- Se utiliza un `RolesGuard` en conjunto con un decorador `@Roles()` para el control de acceso basado en roles.

### Proceso de Autenticación

1. El usuario se registra (`POST /auth/register`)
2. El usuario inicia sesión (`POST /auth/login`) y recibe un token JWT
3. El token se utiliza en el encabezado `Authorization` para acceder a rutas protegidas

## 4. Endpoints

### 4.1 Autenticación

#### Registro de Usuario
- **Ruta**: `POST /auth/register`
- **Acceso**: Público
- **Descripción**: Registra un nuevo usuario con rol 'owner' por defecto
- **Cuerpo de la solicitud**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Respuesta**: Usuario creado

#### Inicio de Sesión
- **Ruta**: `POST /auth/login`
- **Acceso**: Público
- **Descripción**: Autentica al usuario y devuelve un token JWT
- **Cuerpo de la solicitud**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Respuesta**: Token JWT

#### Cierre de Sesión
- **Ruta**: `POST /auth/logout`
- **Acceso**: Usuarios autenticados
- **Descripción**: Cierra la sesión del usuario (invalidando el token en el cliente)
- **Respuesta**: Mensaje de éxito

### 4.2 Gestión de Usuarios

#### Crear Administrador
- **Ruta**: `POST /auth/create-admin`
- **Acceso**: Solo administradores
- **Descripción**: Crea un nuevo usuario con rol de administrador
- **Cuerpo de la solicitud**: Similar al registro de usuario
- **Respuesta**: Usuario administrador creado

#### Obtener Todos los Usuarios
- **Ruta**: `GET /auth`
- **Acceso**: Solo administradores
- **Descripción**: Obtiene una lista de todos los usuarios
- **Respuesta**: Array de usuarios

#### Obtener Usuario por ID
- **Ruta**: `GET /auth/:id`
- **Acceso**: Solo administradores
- **Descripción**: Obtiene los detalles de un usuario específico
- **Respuesta**: Detalles del usuario

#### Obtener Usuarios por Rol
- **Ruta**: `GET /auth/role/:role`
- **Acceso**: Solo administradores
- **Descripción**: Obtiene una lista de usuarios con un rol específico
- **Respuesta**: Array de usuarios con el rol especificado

#### Actualizar Usuario
- **Ruta**: `PATCH /auth/:id`
- **Acceso**: Solo administradores
- **Descripción**: Actualiza la información de un usuario
- **Cuerpo de la solicitud**: Campos a actualizar
- **Respuesta**: Usuario actualizado

#### Eliminar Usuario
- **Ruta**: `DELETE /auth/:id`
- **Acceso**: Solo administradores
- **Descripción**: Elimina un usuario del sistema
- **Respuesta**: Confirmación de eliminación

### 4.3 Gestión de Pacientes

#### Crear Paciente
- **Ruta**: `POST /patients/register`
- **Acceso**: Administradores y veterinarios
- **Descripción**: Registra un nuevo paciente
- **Cuerpo de la solicitud**:
  ```json
  {
    "address": "string",
    "phone_number": "string"
  }
  ```
- **Respuesta**: Paciente creado

#### Obtener Todos los Pacientes
- **Ruta**: `GET /patients`
- **Acceso**: Administradores y veterinarios
- **Descripción**: Obtiene una lista de todos los pacientes
- **Respuesta**: Array de pacientes

#### Obtener Paciente por ID
- **Ruta**: `GET /patients/:id`
- **Acceso**: Administradores, veterinarios y dueños
- **Descripción**: Obtiene los detalles de un paciente específico
- **Respuesta**: Detalles del paciente

#### Actualizar Paciente
- **Ruta**: `PATCH /patients/:id`
- **Acceso**: Administradores y veterinarios
- **Descripción**: Actualiza la información de un paciente
- **Cuerpo de la solicitud**: Campos a actualizar
- **Respuesta**: Paciente actualizado

#### Eliminar Paciente
- **Ruta**: `DELETE /patients/:id`
- **Acceso**: Solo administradores
- **Descripción**: Elimina un paciente del sistema
- **Respuesta**: Confirmación de eliminación

### 4.4 Gestión de Mascotas

#### Crear Mascota
- **Ruta**: `POST /pets/register`
- **Acceso**: Administradores, veterinarios y dueños
- **Descripción**: Registra una nueva mascota
- **Cuerpo de la solicitud**:
  ```json
  {
    "name": "string",
    "species": "string",
    "breed": "string",
    "bith_date": "string",
    "gender": "string",
    "weight": number,
    "patient": "string" (ID del paciente)
  }
  ```
- **Respuesta**: Mascota creada

#### Obtener Todas las Mascotas
- **Ruta**: `GET /pets`
- **Acceso**: Administradores y veterinarios
- **Descripción**: Obtiene una lista de todas las mascotas
- **Respuesta**: Array de mascotas

#### Obtener Mascota por ID
- **Ruta**: `GET /pets/:id`
- **Acceso**: Administradores, veterinarios y dueños
- **Descripción**: Obtiene los detalles de una mascota específica
- **Respuesta**: Detalles de la mascota

#### Actualizar Mascota
- **Ruta**: `PATCH /pets/:id`
- **Acceso**: Administradores, veterinarios y dueños
- **Descripción**: Actualiza la información de una mascota
- **Cuerpo de la solicitud**: Campos a actualizar
- **Respuesta**: Mascota actualizada

#### Eliminar Mascota
- **Ruta**: `DELETE /pets/:id`
- **Acceso**: Solo administradores
- **Descripción**: Elimina una mascota del sistema
- **Respuesta**: Confirmación de eliminación

### 4.5 Gestión de Citas

#### Crear Cita
- **Ruta**: `POST /appointments/register`
- **Acceso**: Administradores, veterinarios y dueños
- **Descripción**: Programa una nueva cita
- **Cuerpo de la solicitud**:
  ```json
  {
    "petId": "string",
    "veterinarianId": "string",
    "appointment_date": "string",
    "reason": "string",
    "status": "string"
  }
  ```
- **Respuesta**: Cita creada

#### Obtener Todas las Citas
- **Ruta**: `GET /appointments`
- **Acceso**: Administradores y veterinarios
- **Descripción**: Obtiene una lista de todas las citas
- **Respuesta**: Array de citas

#### Obtener Cita por ID
- **Ruta**: `GET /appointments/:appointment_id`
- **Acceso**: Administradores, veterinarios y dueños
- **Descripción**: Obtiene los detalles de una cita específica
- **Respuesta**: Detalles de la cita

#### Obtener Citas por Estado
- **Ruta**: `GET /appointments/status/:status`
- **Acceso**: Administradores, veterinarios y dueños
- **Descripción**: Obtiene una lista de citas filtradas por estado
- **Respuesta**: Array de citas con el estado especificado

#### Actualizar Cita
- **Ruta**: `PATCH /appointments/:appointment_id`
- **Acceso**: Administradores y veterinarios
- **Descripción**: Actualiza la información de una cita
- **Cuerpo de la solicitud**: Campos a actualizar
- **Respuesta**: Cita actualizada

#### Eliminar Cita
- **Ruta**: `DELETE /appointments/:appointment_id`
- **Acceso**: Solo administradores
- **Descripción**: Elimina una cita del sistema
- **Respuesta**: Confirmación de eliminación

### 4.6 Gestión de Registros Médicos

#### Crear Registro Médico
- **Ruta**: `POST /medical-records/register`
- **Acceso**: Administradores y veterinarios
- **Descripción**: Crea un nuevo registro médico
- **Cuerpo de la solicitud**:
  ```json
  {
    "petId": "string",
    "veterinarianId": "string",
    "appointmentId": "string",
    "diagnosis": "string",
    "treatment": "string",
    "medication": "string",
    "notes": "string"
  }
  ```
- **Respuesta**: Registro médico creado

#### Obtener Todos los Registros Médicos
- **Ruta**: `GET /medical-records`
- **Acceso**: Administradores y veterinarios
- **Descripción**: Obtiene una lista de todos los registros médicos
- **Respuesta**: Array de registros médicos

#### Obtener Registro Médico por ID
- **Ruta**: `GET /medical-records/:record_id`
- **Acceso**: Administradores, veterinarios y dueños
- **Descripción**: Obtiene los detalles de un registro médico específico
- **Respuesta**: Detalles del registro médico

#### Actualizar Registro Médico
- **Ruta**: `PATCH /medical-records/:record_id`
- **Acceso**: Administradores y veterinarios
- **Descripción**: Actualiza la información de un registro médico
- **Cuerpo de la solicitud**: Campos a actualizar
- **Respuesta**: Registro médico actualizado

#### Eliminar Registro Médico
- **Ruta**: `DELETE /medical-records/:record_id`
- **Acceso**: Solo administradores
- **Descripción**: Elimina un registro médico del sistema
- **Respuesta**: Confirmación de eliminación

## 5. Persistencia en la Base de Datos

La persistencia de datos se maneja utilizando TypeORM, un ORM (Object-Relational Mapping) para TypeScript y JavaScript. Cada entidad (User, Patient, Pet, Appointment, MedicalRecord) tiene su propia tabla en la base de datos, con relaciones definidas entre ellas.

## 6. Pruebas con Postman

Se proporciona una colección de Postman (`PetSociety.postman_collection.json`) que incluye todas las solicitudes necesarias para probar la API. Esta colección contiene carpetas organizadas para cada entidad principal (usuarios, pacientes, mascotas, citas y registros médicos), con solicitudes pre-configuradas para cada operación CRUD.

Para utilizar la colección:
1. Importa el archivo JSON en Postman.
2. Configura la variable de entorno `url` con la URL base de tu API.
3. Utiliza la solicitud de login para obtener un token JWT.
4. El token se guardará automáticamente en la variable `token` y se utilizará en las solicitudes subsiguientes.

## 7. Conclusión

La API PetSociety proporciona una solución completa para la gestión de una clínica veterinaria, con funcionalidades robustas para manejar usuarios, pacientes, mascotas, citas y registros médicos. La implementación de autenticación JWT y autorización basada en roles garantiza la seguridad y el control de acceso adecuado a los recursos de la API.