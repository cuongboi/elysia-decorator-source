# Elysia Controller System with Tsyringe

This project provides a controller-based routing system for [Elysia](https://elysiajs.com/), a lightweight and fast web framework, using TypeScript decorators and [Tsyringe](https://github.com/microsoft/tsyringe) for dependency injection. It simplifies the creation of RESTful APIs and WebSocket services with a clean, modular architecture.

## Features

- **Decorator-Based Routing**: Define routes with `@Get`, `@Post`, `@Put`, etc., and group them under `@Controller`.
- **Parameter Injection**: Use `@Param` and `@Body` to access route parameters and request bodies.
- **Elysia Integration**: Leverage Elysia's schema validation and context features (`body`, `response`, etc.).
- **Dependency Injection**: Powered by Tsyringe for managing services and dependencies.
- **Type Safety**: Fully typed with TypeScript for robust development.

## File Structure

```
project-root/
├── src/
│   ├── app.controller.ts  # Controller with route handlers
│   ├── app.module.ts     # Module configuration
│   ├── app.service.ts    # Business logic service
│   ├── app.dto.ts        # Define data transfer objects
│   └── main.ts           # Application entry point
└── tsconfig.json         # TypeScript configuration
```

## Prerequisites

- **Node.js**: v16 or higher
- **TypeScript**: v4.5 or higher

## Installation

1. **Install Dependencies**:

```bash
npm install elysia elysia-decorator tsyringe reflect-metadata
```

2. **Create a tsconfig.json file in your project root with the following content to enable decorators and ES modules**:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "preserveSymlinks": true,
    "target": "ES2021",
    "lib": ["ESNext"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "noEmit": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "rootDir": "./src"
  },
  "exclude": ["node_modules"]
}
```

## Usage

### 1. Define data transfer objects

```typescript
// src/app.dto.ts
import { type Static, Type } from 'elysia-decorator';

export const AppParams = Type.Object({
  name: Type.String(),
});

export type AppParams = Static<typeof AppParams>;

export const AppPostSchema = Type.Object({
  title: Type.String(),
  content: Type.String(),
});

export type AppPostSchema = Static<typeof AppPostSchema>;
```

### 2. Create a Service

Define a service to encapsulate business logic:

```typescript
// src/app.service.ts
import { injectable } from 'elysia-decorator';

import { AppPostSchema, AppParams } from './app.dto';

@injectable()
export class AppService {
  getGreeting(params: AppParams) {
    return `Hello, ${params.name}!`;
  }

  createPost(post: AppPostSchema) {
    return { id: '123', ...post };
  }
}
```

### 3. Create a Controller

Define a controller with route handlers using decorators:

```typescript
// src/app.controller.ts
import { type Context } from 'elysia';
import {
  Controller,
  Get,
  Post,
  Body,
  Params,
  Type,
  Set,
} from 'elysia-decorator';
import { inject, injectable } from 'tsyringe';

import { AppParams, AppPostSchema } from './app.dto';
import { AppService } from './app.service';

@Controller('/v1')
@injectable()
export class AppController {
  constructor(@inject(AppService) private appService: AppService) {}

  @Get('/greet/:name', {
    params: AppParams,
    response: {
      200: Type.String(),
    },
  })
  async greeting(@Params() params: AppParams) {
    return this.appService.getGreeting(params);
  }

  @Post('/posts', {
    body: AppPostSchema,
    response: {
      201: Type.Object({
        id: Type.String(),
        title: Type.String(),
        content: Type.String(),
      }),
    },
  })
  async createPost(@Body() body: AppPostSchema, @Set() set: Context['set']) {
    set.status = 201;

    return this.appService.createPost(body);
  }
}
```

### 3. Define a Module

Create a module to configure your application:

```typescript
// src/app.module.ts
import { Module } from 'elysia-decorator';

import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
})
export class AppModule {}
```

### 5. Set Up the Application

Initialize the Elysia app with the module:

```typescript
/// src/main.tsimport { Elysia } from 'elysia';
import { useModule } from 'elysia-decorator';

import { AppModule } from './app.module';

const app = new Elysia().use(useModule(AppModule)).listen(3000);

console.log(`Server running at http://localhost:${app.server?.port}`);
```

### 5. Run the Application

```bash
bun run ./main.ts
```

## Example Request

**GET Greeting**

```http
GET http://localhost:3000/v1/greet/John
Response: "Hello, John!" (200 OK)
```

**POST Create Post**

```http
POST http://localhost:3000/v1/posts
{ "title": "My Post", "content": "Hello World" }
// Response: {
//   "id": "123",
//   "title": "My Post",
//   "content": "Hello World"
// } (201 Created)
```

## Advanced Usage

### Dependency Injection

Use Tsyringe to inject services into controllers:

```typescript
@injectable()
export class AppController {
  constructor(@inject(AppService) private appService: AppService) {}
}
```

## Troubleshooting

- Decorator Errors: Ensure experimentalDecorators and emitDecoratorMetadata are enabled in tsconfig.json.
- Dependency Injection Issues: Verify all injectable classes are marked with @injectable().
- Schema Validation: Check that Elysia schemas (t.\*) match your request/response data.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue on GitHub.
