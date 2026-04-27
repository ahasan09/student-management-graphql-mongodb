# Student Management (GraphQL + MongoDB)

NestJS application providing a GraphQL API for managing students and lessons, backed by MongoDB.

## Tech Stack
- NestJS 9
- GraphQL 16 (`@nestjs/apollo` 11, `@apollo/server` 4)
- MongoDB (via TypeORM `mongodb` driver)
- TypeScript 4.7

## Project Structure
```
student-management-graphql-mongodb/
├── src/
│   ├── students/
│   │   ├── student.model.ts
│   │   └── students.resolver.ts
│   ├── lessons/
│   └── app.module.ts
└── package.json
```

## Development
```bash
# Install dependencies
npm install

# Run development server
npm run start:dev
```

## Key Notes
- Requires a running MongoDB instance. Set the connection URI in the NestJS module or a `.env` file.
- GraphQL playground available at `http://localhost:3000/graphql` in development.
