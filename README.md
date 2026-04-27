# Student Management — GraphQL + MongoDB

A NestJS GraphQL API for managing students and lessons. Uses MongoDB as the database via TypeORM and exposes a GraphQL playground for exploring queries and mutations.

## Features

- GraphQL API (Apollo Server)
- Student CRUD — create, read, update, delete students
- Lesson management — assign students to lessons
- MongoDB persistence via TypeORM
- Input validation with class-validator
- GraphQL Playground at `/graphql`

## Tech Stack

- [NestJS](https://nestjs.com/) — Node.js framework
- TypeScript
- GraphQL (Apollo Server)
- MongoDB
- TypeORM
- class-validator / class-transformer
- UUID

## Prerequisites

- [Node.js](https://nodejs.org/) v14+
- [MongoDB](https://www.mongodb.com/) running locally (default: `mongodb://localhost/27017`)

## Getting Started

### 1. Install dependencies

```bash
git clone https://github.com/ahasan09/student-management-graphql-mongodb
cd student-management-graphql-mongodb
npm install
```

### 2. Configure MongoDB

By default the app connects to `mongodb://localhost/school`. To change this, update the TypeORM config in `src/app.module.ts`.

### 3. Run the app

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build && npm run start:prod
```

Open [http://localhost:3000/graphql](http://localhost:3000/graphql) to access the GraphQL Playground.

## Example Queries

```graphql
# Create a student
mutation {
  createStudent(createStudentInput: {
    firstName: "John"
    lastName: "Doe"
  }) {
    id
    firstName
    lastName
  }
}

# Get all students
query {
  students {
    id
    firstName
    lastName
  }
}

# Create a lesson
mutation {
  createLesson(createLessonInput: {
    name: "Mathematics"
    startDate: "2024-01-15T09:00:00Z"
    endDate: "2024-01-15T10:00:00Z"
    students: []
  }) {
    id
    name
  }
}
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Compile TypeScript |
| `npm run start:prod` | Run compiled output |
| `npm run test` | Unit tests |

## Project Structure

```
src/
├── student/     # Student module — resolver, service, entity, DTOs
├── lesson/      # Lesson module — resolver, service, entity, DTOs
└── main.ts      # App bootstrap
```
