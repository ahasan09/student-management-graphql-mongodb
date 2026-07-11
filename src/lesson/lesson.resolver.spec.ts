import { Test, TestingModule } from '@nestjs/testing';
import { Lesson } from './lesson.entity';
import { LessonResolver } from './lesson.resolver';
import { LessonService } from './lesson.service';
import { CreateLessonInput } from './create-lesson.input';
import { AssignStudentsToLessonInput } from './assign-students-to-lesson.input';
import { Student } from '../student/student.entity';
import { StudentService } from '../student/student.service';

const mockLesson = (overrides: Partial<Lesson> = {}): Lesson => ({
    _id: 'mongo-object-id',
    id: 'f6d1a2b3-4c5d-4e6f-8a9b-0c1d2e3f4a55',
    name: 'Physics',
    startDate: '2026-01-01T09:00:00.000Z',
    endDate: '2026-01-01T10:00:00.000Z',
    students: [],
    ...overrides,
});

const mockStudent = (overrides: Partial<Student> = {}): Student => ({
    _id: 'mongo-object-id',
    id: 'a3c817d2-99f4-4f36-8a37-2d1e4a51a111',
    firstName: 'John',
    lastName: 'Doe',
    ...overrides,
});

describe('LessonResolver', () => {
    let resolver: LessonResolver;
    let lessonService: jest.Mocked<
        Pick<LessonService, 'getLessons' | 'getLessonById' | 'createLesson' | 'assignStudentsToLesson'>
    >;
    let studentService: jest.Mocked<Pick<StudentService, 'getManyStudents'>>;

    beforeEach(async () => {
        lessonService = {
            getLessons: jest.fn(),
            getLessonById: jest.fn(),
            createLesson: jest.fn(),
            assignStudentsToLesson: jest.fn(),
        };
        studentService = {
            getManyStudents: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LessonResolver,
                { provide: LessonService, useValue: lessonService },
                { provide: StudentService, useValue: studentService },
            ],
        }).compile();

        resolver = module.get(LessonResolver);
    });

    describe('lessons', () => {
        it('delegates to LessonService.getLessons', async () => {
            const lessons = [mockLesson()];
            lessonService.getLessons.mockResolvedValue(lessons);

            await expect(resolver.lessons()).resolves.toEqual(lessons);
            expect(lessonService.getLessons).toHaveBeenCalledTimes(1);
        });
    });

    describe('lessonById', () => {
        it('delegates to LessonService.getLessonById with the given id', async () => {
            const lesson = mockLesson();
            lessonService.getLessonById.mockResolvedValue(lesson);

            await expect(resolver.lessonById(lesson.id)).resolves.toEqual(lesson);
            expect(lessonService.getLessonById).toHaveBeenCalledWith(lesson.id);
        });
    });

    describe('createLesson', () => {
        it('delegates to LessonService.createLesson with the given input', async () => {
            const createLessonInput: CreateLessonInput = {
                name: 'Physics',
                startDate: '2026-01-01T09:00:00.000Z',
                endDate: '2026-01-01T10:00:00.000Z',
                students: [],
            };
            const lesson = mockLesson();
            lessonService.createLesson.mockResolvedValue(lesson);

            await expect(resolver.createLesson(createLessonInput)).resolves.toEqual(lesson);
            expect(lessonService.createLesson).toHaveBeenCalledWith(createLessonInput);
        });
    });

    describe('assignStudentsToLesson', () => {
        it('unpacks the input and delegates to LessonService.assignStudentsToLesson', async () => {
            const assignStudentsToLessonInput: AssignStudentsToLessonInput = {
                lessonId: 'lesson-id',
                studentIds: ['student-1', 'student-2'],
            };
            const lesson = mockLesson({ students: ['student-1', 'student-2'] });
            lessonService.assignStudentsToLesson.mockResolvedValue(lesson);

            await expect(
                resolver.assignStudentsToLesson(assignStudentsToLessonInput),
            ).resolves.toEqual(lesson);
            expect(lessonService.assignStudentsToLesson).toHaveBeenCalledWith(
                'lesson-id',
                ['student-1', 'student-2'],
            );
        });
    });

    describe('students (field resolver)', () => {
        it('resolves the student ids of the parent lesson through StudentService', async () => {
            const lesson = mockLesson({ students: ['student-1', 'student-2'] });
            const students = [mockStudent({ id: 'student-1' }), mockStudent({ id: 'student-2' })];
            studentService.getManyStudents.mockResolvedValue(students);

            await expect(resolver.students(lesson)).resolves.toEqual(students);
            expect(studentService.getManyStudents).toHaveBeenCalledWith(['student-1', 'student-2']);
        });
    });
});
