import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Lesson } from './lesson.entity';
import { CreateLessonInput } from './create-lesson.input';

@Injectable()
export class LessonService {
    constructor(
        @InjectRepository(Lesson) private repository: Repository<Lesson>
    ) { }

    async getLessons(): Promise<Lesson[]> {
        return this.repository.find();
    }

    async getLessonById(id: string): Promise<Lesson> {
        const lesson = await this.repository.findOneBy({ id });

        if (!lesson) {
            throw new NotFoundException(`Lesson with ID "${id}" not found`);
        }

        return lesson;
    }

    async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
        const lesson = this.repository.create({
            ...createLessonInput,
            id: uuid()
        });

        return this.repository.save(lesson);
    }

    async assignStudentsToLesson(lessonId: string, studentIds: string[]): Promise<Lesson> {
        const lesson = await this.repository.findOneBy({ id: lessonId });
        lesson.students = lesson.students ? [...lesson.students, ...studentIds] : studentIds;

        return this.repository.save(lesson);
    }
}
