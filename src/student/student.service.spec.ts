import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { CreateStudentInput } from './create-student.input';

const mockStudent = (overrides: Partial<Student> = {}): Student => ({
    _id: 'mongo-object-id',
    id: 'a3c817d2-99f4-4f36-8a37-2d1e4a51a111',
    firstName: 'John',
    lastName: 'Doe',
    ...overrides,
});

describe('StudentService', () => {
    let service: StudentService;
    let repository: jest.Mocked<Pick<Repository<Student>, 'find' | 'findOneBy' | 'create' | 'save'>>;

    beforeEach(async () => {
        repository = {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StudentService,
                { provide: getRepositoryToken(Student), useValue: repository },
            ],
        }).compile();

        service = module.get(StudentService);
    });

    describe('getStudents', () => {
        it('returns all students from the repository', async () => {
            const students = [mockStudent(), mockStudent({ id: 'other-id', firstName: 'Jane' })];
            repository.find.mockResolvedValue(students);

            await expect(service.getStudents()).resolves.toEqual(students);
            expect(repository.find).toHaveBeenCalledWith();
        });
    });

    describe('getStudentById', () => {
        it('returns the student when it exists', async () => {
            const student = mockStudent();
            repository.findOneBy.mockResolvedValue(student);

            await expect(service.getStudentById(student.id)).resolves.toEqual(student);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: student.id });
        });

        it('throws NotFoundException when the student does not exist', async () => {
            repository.findOneBy.mockResolvedValue(null);

            await expect(service.getStudentById('missing-id')).rejects.toThrow(NotFoundException);
            await expect(service.getStudentById('missing-id')).rejects.toThrow(
                'Student with ID "missing-id" not found',
            );
        });
    });

    describe('createStudent', () => {
        it('creates and saves a student with a generated id', async () => {
            const createStudentInput: CreateStudentInput = {
                firstName: 'John',
                lastName: 'Doe',
            };
            repository.create.mockImplementation((entity) => entity as Student);
            repository.save.mockImplementation((entity) => Promise.resolve(entity as Student));

            const result = await service.createStudent(createStudentInput);

            expect(repository.create).toHaveBeenCalledWith({
                ...createStudentInput,
                id: expect.any(String),
            });
            expect(repository.save).toHaveBeenCalledWith(result);
            expect(result).toMatchObject(createStudentInput);
            expect(result.id).toMatch(
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
            );
        });
    });

    describe('getManyStudents', () => {
        it('returns students matching the given ids', async () => {
            const studentIds = ['id-1', 'id-2'];
            const students = [mockStudent({ id: 'id-1' }), mockStudent({ id: 'id-2' })];
            repository.find.mockResolvedValue(students);

            await expect(service.getManyStudents(studentIds)).resolves.toEqual(students);
            expect(repository.find).toHaveBeenCalledWith({
                where: { id: In(studentIds) },
            });
        });

        it('returns an empty array when no students match', async () => {
            repository.find.mockResolvedValue([]);

            await expect(service.getManyStudents(['unknown-id'])).resolves.toEqual([]);
        });
    });
});
