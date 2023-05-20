import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { LessonModule } from './lesson/lesson.module'
import { Lesson } from './lesson/lesson.entity'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mongodb',
            url: 'mongodb://localhost/school',
            synchronize: true,
            useUnifiedTopology: true,
            entities: [
                Lesson
            ],
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
        }),
        LessonModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }