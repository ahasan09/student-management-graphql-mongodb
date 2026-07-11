import { Test, TestingModule } from '@nestjs/testing';
import { Student } from './student.entity';
import { StudentResolver } from './student.resolver';
import { StudentService } from './student.service';
import { CreateStudentInput } from './create-student.input';

const mockStudent = (overrides: Partial<Student> = {}): Student => ({
    _id: 'mongo-object-id',
    id: 'a3c817d2-99f4-4f36-8a37-2d1e4a51a111',
    firstName: 'John',
    lastName: 'Doe',
    ...overrides,
});

describe('StudentResolver', () => {
    let resolver: StudentResolver;
    let studentService: jest.Mocked<
        Pick<StudentService, 'getStudents' | 'getStudentById' | 'createStudent'>
    >;

    beforeEach(async () => {
        studentService = {
            getStudents: jest.fn(),
            getStudentById: jest.fn(),
            createStudent: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StudentResolver,
                { provide: StudentService, useValue: studentService },
            ],
        }).compile();

        resolver = module.get(StudentResolver);
    });

    describe('students', () => {
        it('delegates to StudentService.getStudents', async () => {
            const students = [mockStudent()];
            studentService.getStudents.mockResolvedValue(students);

            await expect(resolver.students()).resolves.toEqual(students);
            expect(studentService.getStudents).toHaveBeenCalledTimes(1);
        });
    });

    describe('studentById', () => {
        it('delegates to StudentService.getStudentById with the given id', async () => {
            const student = mockStudent();
            studentService.getStudentById.mockResolvedValue(student);

            await expect(resolver.studentById(student.id)).resolves.toEqual(student);
            expect(studentService.getStudentById).toHaveBeenCalledWith(student.id);
        });
    });

    describe('createStudent', () => {
        it('delegates to StudentService.createStudent with the given input', async () => {
            const createStudentInput: CreateStudentInput = {
                firstName: 'John',
                lastName: 'Doe',
            };
            const student = mockStudent();
            studentService.createStudent.mockResolvedValue(student);

            await expect(resolver.createStudent(createStudentInput)).resolves.toEqual(student);
            expect(studentService.createStudent).toHaveBeenCalledWith(createStudentInput);
        });
    });
});
