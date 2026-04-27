# Improvement Plan: student-management-graphql-mongodb

## Overview
NestJS + GraphQL + MongoDB app for student/lesson management. No authentication, no authorization, limited entity coverage, and no tests.

## Improvements

### Security (High Priority)
- Add authentication using JWT + `@nestjs/jwt` — currently any caller can mutate data
- Add authorization guards: students should only access their own data; admins can access all
- Move MongoDB URI to environment variables and validate on startup with `@nestjs/config`

### Testing
- Add Jest unit tests for resolvers and services with mocked TypeORM repositories
- Add e2e tests using NestJS `@nestjs/testing` + GraphQL client (`graphql-request`)
- Use MongoDB Memory Server for integration tests
- Set a minimum coverage threshold (≥80%)

### Schema Expansion
- Add an `Enrollment` entity linking students to lessons (many-to-many)
- Add `grades` to the enrollment entity
- Add `Teacher` entity for assigning teachers to lessons
- Add `Course` grouping for related lessons

### Code Quality
- Enable TypeScript `strict` mode
- Add `class-validator` decorators to all GraphQL input types
- Add DataLoader to batch N+1 queries (e.g., loading students for a list of lessons)

### API
- Add pagination (`first`/`after` cursor-based) to all list queries
- Add filtering arguments to queries (e.g., `students(nameContains: "Ali")`)

### DevOps
- Add a `Dockerfile` and `docker-compose.yml` (app + MongoDB)
- Add GitHub Actions CI: lint + test + build Docker image
- Expose GraphQL Playground only in development (`playground: process.env.NODE_ENV !== 'production'`)
