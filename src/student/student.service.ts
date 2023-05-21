import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Student } from './student.entity';
import { CreateStudentInput } from './create-student.input';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student) private repository: Repository<Student>
    ) { }

    async getStudents(): Promise<Student[]> {
        return this.repository.find();
    }

    async getStudentById(id: string): Promise<Student> {
        const student = await this.repository.findOneBy({ id });

        if (!student) {
            throw new NotFoundException(`Student with ID "${id}" not found`);
        }

        return student;
    }

    async createStudent(createStudentInput: CreateStudentInput): Promise<Student> {
        const student = this.repository.create({
            ...createStudentInput,
            id: uuid()
        });

        return this.repository.save(student);
    }

    async getManyStudents(studentIds: string[]): Promise<Student[]> {
        const students = await this.repository.find({
            where: {
              id: In(studentIds),
            },
          });
          return students || [];
    }
}
