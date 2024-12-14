# Consideraciones del Proyecto

## Configuración Inicial

1. **Subida de Pods:**
   - Crear una base de datos en `ms-request` llamada **`request-db`**.
   - Crear una base de datos en `ms-users` llamada **`users-db`**.

2. **Carga Inicial de Datos:**
   - En `request-db`, completar los datos de los tipos de préstamos `lona_type` con los datos del archivo **`querys.sql`**.

3. **Configuración del Frontend:**
   - Actualizar las rutas en el frontend en función de los puertos generados.
   - Ajustar las rutas del módulo de evaluación para obtener los PDFs.

---

## Descripción de los Microservicios

### 1. **ms-simulation**
   - Realiza simulaciones de créditos.

### 2. **ms-users**
   - Gestiona la creación, modificación y eliminación de clientes.

### 3. **ms-request**
   - Gestiona la creación, modificación y eliminación de solicitudes de crédito.

### 4. **ms-evaluation**
   - Evalúa solicitudes de crédito.

### 5. **ms-tracking**
   - Proporciona el estado de las solicitudes de crédito.

### 6. **ms-totalcost**
   - Calcula el costo total de las solicitudes de crédito.

---

## Dependencias del Proyecto

### Dependencias de Spring Boot
- `spring-boot-starter-data-jpa`: Para la integración con JPA y Hibernate.
- `spring-boot-starter-web`: Para construir servicios web RESTful.

### Dependencias de Spring Cloud
- `spring-cloud-config-client`: Para conectar con el servidor de configuración centralizada.
- `spring-cloud-starter-netflix-eureka-client`: Para la integración con Eureka como cliente de descubrimiento.
- `spring-cloud-starter-openfeign`: Para realizar llamadas a microservicios mediante Feign.

### Dependencias de Base de Datos
- `postgresql`: Controlador JDBC para PostgreSQL.

### Dependencias de Utilidad
- `lombok`: Para reducir la escritura de código repetitivo como getters, setters y constructores.

### Dependencias de Pruebas
- `spring-boot-starter-test`: Para escribir y ejecutar pruebas unitarias.

---

### Contacto
Ante cualquier duda o problema contactarme a través del correo reinaldo.pacheco@usach.cl