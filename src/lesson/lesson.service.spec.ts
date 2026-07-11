import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { LessonService } from './lesson.service';
import { CreateLessonInput } from './create-lesson.input';

const mockLesson = (overrides: Partial<Lesson> = {}): Lesson => ({
    _id: 'mongo-object-id',
    id: 'f6d1a2b3-4c5d-4e6f-8a9b-0c1d2e3f4a55',
    name: 'Physics',
    startDate: '2026-01-01T09:00:00.000Z',
    endDate: '2026-01-01T10:00:00.000Z',
    students: [],
    ...overrides,
});

describe('LessonService', () => {
    let service: LessonService;
    let repository: jest.Mocked<Pick<Repository<Lesson>, 'find' | 'findOneBy' | 'create' | 'save'>>;

    beforeEach(async () => {
        repository = {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LessonService,
                { provide: getRepositoryToken(Lesson), useValue: repository },
            ],
        }).compile();

        service = module.get(LessonService);
    });

    describe('getLessons', () => {
        it('returns all lessons from the repository', async () => {
            const lessons = [mockLesson(), mockLesson({ id: 'other-id', name: 'Math' })];
            repository.find.mockResolvedValue(lessons);

            await expect(service.getLessons()).resolves.toEqual(lessons);
            expect(repository.find).toHaveBeenCalledWith();
        });
    });

    describe('getLessonById', () => {
        it('returns the lesson when it exists', async () => {
            const lesson = mockLesson();
            repository.findOneBy.mockResolvedValue(lesson);

            await expect(service.getLessonById(lesson.id)).resolves.toEqual(lesson);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: lesson.id });
        });

        it('throws NotFoundException when the lesson does not exist', async () => {
            repository.findOneBy.mockResolvedValue(null);

            await expect(service.getLessonById('missing-id')).rejects.toThrow(NotFoundException);
            await expect(service.getLessonById('missing-id')).rejects.toThrow(
                'Lesson with ID "missing-id" not found',
            );
        });
    });

    describe('createLesson', () => {
        it('creates and saves a lesson with a generated id', async () => {
            const createLessonInput: CreateLessonInput = {
                name: 'Physics',
                startDate: '2026-01-01T09:00:00.000Z',
                endDate: '2026-01-01T10:00:00.000Z',
                students: [],
            };
            repository.create.mockImplementation((entity) => entity as Lesson);
            repository.save.mockImplementation((entity) => Promise.resolve(entity as Lesson));

            const result = await service.createLesson(createLessonInput);

            expect(repository.create).toHaveBeenCalledWith({
                ...createLessonInput,
                id: expect.any(String),
            });
            expect(repository.save).toHaveBeenCalledWith(result);
            expect(result).toMatchObject(createLessonInput);
            expect(result.id).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
            );
        });
    });

    describe('assignStudentsToLesson', () => {
        it('appends the student ids to the existing students of the lesson', async () => {
            const lesson = mockLesson({ students: ['existing-student'] });
            repository.findOneBy.mockResolvedValue(lesson);
            repository.save.mockImplementation((entity) => Promise.resolve(entity as Lesson));

            const result = await service.assignStudentsToLesson(lesson.id, ['new-student']);

            expect(repository.findOneBy).toHaveBeenCalledWith({ id: lesson.id });
            expect(result.students).toEqual(['existing-student', 'new-student']);
            expect(repository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: lesson.id,
                    students: ['existing-student', 'new-student'],
                }),
            );
        });

        it('sets the student ids when the lesson has no students yet', async () => {
            const lesson = mockLesson({ students: undefined });
            repository.findOneBy.mockResolvedValue(lesson);
            repository.save.mockImplementation((entity) => Promise.resolve(entity as Lesson));

            const result = await service.assignStudentsToLesson(lesson.id, ['student-1', 'student-2']);

            expect(result.students).toEqual(['student-1', 'student-2']);
        });
    });
});
