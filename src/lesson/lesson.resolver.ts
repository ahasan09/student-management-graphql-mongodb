import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { LessonType } from './lesson.type'
import { LessonService } from './lesson.service'
import { CreateLessonInput } from './dto/create-lesson.input';

@Resolver(() => LessonType)
export class LessonResolver {
    constructor(private lessonService: LessonService) { }

    @Query(() => [LessonType])
    lessons() {
        return this.lessonService.getLessons();
    }

    @Query(() => LessonType)
    lessonById(
        @Args('id') id: string,
    ) {
        return this.lessonService.getLessonById(id);
    }

    @Mutation(() => LessonType)
    createLesson(
        @Args('createLessonInput') createLessonInput: CreateLessonInput
    ) {
        return this.lessonService.createLesson(createLessonInput);
    }
}
