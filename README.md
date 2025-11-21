# MikroORM Users API
A simple web API made with NestJS to understand and document how to work with MikroORM..
### 🧰 Tech Stack

<div style="display: flex; gap: 10px;">
    <img height="32" width="32" src="https://cdn.simpleicons.org/nestjs" alt="NestJS" title="NestJS" />
    <img height="32" width="32" src="https://cdn.simpleicons.org/typescript" alt="TypeScript" title="TypeScript" />
    <img height="32" width="32" src="https://cdn.simpleicons.org/swagger" alt="Swagger" title="Swagger" />
    <img height="32" src="https://cdn.simpleicons.org/mysql" alt="MySQL" title="MySQL" />
</div>

### 📸 Project Preview

<div style="display: flex; gap: 20px; flex-wrap: wrap;">
  <div>
    <strong>Swagger UI</strong><br/>
    <img src="https://github.com/user-attachments/assets/d0b46148-b61a-436e-9cef-dbf1c86bf289" alt="Swagger UI" width="650"/>
  </div>
</div>

### 🛠️🚀 How to execute it?

There are two possible ways: locally or via Docker

#### A) Locally:
1. Clone the current repository:
   ```bash
   git clone git@github.com:JGMelon22/mikroorm-nest-demo-v1.git
   ```

2. Enter the project directory and install dependencies:
   ```bash
   cd mikroorm-nest-demo-v1
   npm install
   ```

3. Configure the database credentials in the `.env` file to match your MySQL instance

4. Start the application using the Nest CLI:
   ```bash
   npm run start:dev
   ```

5. Access the Swagger UI in your browser: `http://localhost:3000/api`

#### B) Via Docker (WIP)
1. Clone the current repository:
   ```bash
   git clone git@github.com:JGMelon22/SampleNestJS.git
   ```

2. Configure the database credentials in the `.env` file to match your MySQL instance

3. Execute with docker-composer:
   ```bash
   docker compose up --build
   ```
4. Access the Swagger UI in your browser: `http://localhost:3000/api`

### 🧩 Dependencies
- [`mikro-orm/core`](https://mikro-orm.io/) — A beautiful, simple API for interacting with your database that takes full advantage of TypeScript's type system.
- [`mikro-orm/cli`](https://mikro-orm.io/docs/cli) — Official CLI for MikroORM, used for running migrations and other tasks.
- [`mikro-orm/migrations`](https://mikro-orm.io/docs/migrations) — Migration management system for MikroORM.
- [`mikro-orm/mysql`](https://mikro-orm.io/docs/drivers/mysql) — MySQL driver for MikroORM.
- [`mikro-orm/nestjs`](https://mikro-orm.io/docs/nestjs) — NestJS integration for MikroORM.
- [`class-validator`](https://github.com/typestack/class-validator) — Decorator-based property validation for classes.
- [`class-transformer`](https://github.com/typestack/class-transformer) — Decorator-based transformation, serialization, and deserialization between objects and classes.


### 📚 References
- [Documentation | NestJS](https://docs.nestjs.com/) \
- [NestJS e Swagger: Automatize a geração de documentação para sua API](https://consolelog.com.br/nestjs-swagger-automatizar-geracao-documentacao-api/) \
- [MikroORM (Core)](https://mikro-orm.io/docs/guide) — A beautiful, simple API for interacting with your database that takes full advantage of TypeScript's type system.  
- [MikroORM (NestJS)](https://mikro-orm.io/docs/usage-with-nestjs) — Integration guide for using MikroORM with NestJS applications.  
- [MikroORM (Configuration)](https://mikro-orm.io/docs/configuration) — How to configure MikroORM in your project.  
- [MikroORM (Migrations)](https://mikro-orm.io/docs/migrations) — Managing database migrations with MikroORM.  
- [MikroORM CLI](https://mikro-orm.io/docs/cli) — Official CLI for MikroORM, used for running migrations and other tasks.  
- [MikroORM (Advanced Guide)](https://mikro-orm.io/docs/guide/advanced) — Advanced concepts and patterns for working with MikroORM.  
- [MikroORM Cursor API](https://mikro-orm.io/api/core/class/Cursor) — Documentation for MikroORM's Cursor class, used for efficient iteration over query results.