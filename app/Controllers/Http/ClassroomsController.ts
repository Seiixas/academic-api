import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Classroom from 'App/Models/Classroom';
import Student from 'App/Models/Student';
import Teacher from 'App/Models/Teacher';

export default class ClassroomsController {
  public async store({ request, response }: HttpContextContract) {
    const {
      teacher_responsible,
      class_number,
      capacity
    } = request.body();

    if (capacity <= 0) {
      response.status(400).json({
        message: 'A sala deve ter ao menos uma vaga para alunos.'
      });
    }

    const teacher = await Teacher.find(teacher_responsible);

    if (!teacher) {
      return response.status(404).json({
        message: 'Este professor não existe.'
      });
    }

    const classroom = await Classroom.create({
      created_by: teacher.id,
      class_number,
      capacity
    });

    await classroom.save();

    return response.json({
      message: 'Sala de aula criada com sucesso!',
      data: classroom
    })
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const classroom = await Classroom.find(id);

    if (!classroom) {
      return response.status(404).json({
        message: 'Sala de aula não encontrado.',
      })
    }

    await classroom.load('students')

    return {
      message: 'Sala de aula encontrada com sucesso!',
      data: classroom
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const {
      teacher_responsible,
      class_number,
      capacity,
      availability
    } = request.body();

    const classroom = await Classroom.find(id);

    if (!classroom) {
      return response.status(404).json({
        message: 'Sala de aula não encontrado.',
      })
    }

    const teacher = await Teacher.find(teacher_responsible);

    if (!teacher) {
      return response.status(404).json({
        message: 'Professor responsável não encontrado.',
      })
    }

    if (classroom.created_by !== teacher.id) {
      return response.status(401).json({
        message: 'Você não está autorizado a editar esta sala de aula.'
      })
    }

    await classroom.load('students');

    const enrolledStudents = classroom.students.length;

    if (capacity < enrolledStudents) {
      return response.status(400).json({
        message: 'A capacidade não pode ser menor que a quantidade alunos já matriculados.',
      })
    }

    classroom.class_number = class_number ?? class_number;
    classroom.capacity = capacity ?? capacity;
    classroom.availability = availability ?? availability;

    await classroom.save();

    return response.json({
      message: 'Sala de aula atualizada com sucesso!',
      data: classroom
    })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { teacher_responsible } = request.body();

    const teacher = await Teacher.find(teacher_responsible);

    if (!teacher) {
      return response.status(404).json({
        message: 'Professor responsável não encontrado.',
      })
    }

    const classroom = await Classroom.find(id);

    if (!classroom) {
      return response.status(404).json({
        message: 'Sala de aula não encontrada.',
      })
    }

    if (classroom.created_by !== teacher.id) {
      return response.status(401).json({
        message: 'Você não está autorizado a deletar esta sala de aula.'
      })
    }

    await classroom.delete();
    return response.status(204);
  }

  public async addStudent({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { classroom_id, teacher_id } = request.body();

    const classroom = await Classroom.find(classroom_id);

    if (!classroom) {
      return response.status(404).json({
        message: 'Sala de aula não encontrada.',
      })
    }

    if (classroom.created_by !== teacher_id) {
      return response.status(401).json({
        message: 'Você não tem permissões para adicionar alunos nesta sala de aula.',
      })
    }

    if (!classroom.availability) {
      return response.status(400).json({
        message: 'Sala de aula não possui disponibilidade.',
      })
    }

    const newStudent = await Student.find(id);

    if (!newStudent) {
      return response.status(404).json({
        message: 'Aluno não encontrado.',
      })
    }

    await classroom.load('students')

    const { students } = classroom;

    const studentAlreadyEnrolled = 
      students.some(students => students.id === newStudent.id);

    if (studentAlreadyEnrolled) {
      return response.status(400).json({
        message: 'Aluno já cadastrado nesta sala de aula.',
      })
    }

    const enrolledStudents = students.length;

    if (enrolledStudents === classroom.capacity) {
      if (classroom.availability) {
        classroom.availability = false;
        await classroom.save();
      } 

      return response.status(400).json({
        message: 'Sala de aula já está com limite de alunos.',
      })
    }

    await classroom.related('students').attach([newStudent.id])
    await classroom.save();

    return response.json({
      message: 'Aluno adicionado à sala com sucesso!'
    })
  }

  public async removeStudent({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { classroom_id, teacher_id } = request.body();

    const classroom = await Classroom.find(classroom_id);

    if (!classroom) {
      return response.status(404).json({
        message: 'Sala de aula não encontrada.',
      })
    }

    if (classroom.created_by !== teacher_id) {
      return response.status(401).json({
        message: 'Você não tem permissões para adicionar alunos nesta sala de aula.'
      })
    }

    if (!classroom.availability) {
      return response.status(400).json({
        message: 'Sala de aula não possui disponibilidade.'
      })
    }

    const studentToRemove = await Student.find(id);

    if (!studentToRemove) {
      return response.status(404).json({
        message: 'Aluno não encontrado.'
      })
    }

    await classroom.load('students')

    const { students } = classroom;

    const enrolledStudents = students.length;

    const studentAlreadyEnrolled = 
      students.some(students => students.id === studentToRemove.id);

    if (!studentAlreadyEnrolled) {
      return response.status(404).json({
        message: 'Aluno não encontrado nesta sala de aula.'
      })
    }

    await classroom.related('students').detach([studentToRemove.id])
    await classroom.save();


    if ((enrolledStudents - 1) < classroom.capacity && !classroom.availability) {
      classroom.availability = true;
      await classroom.save();
    }

    return {
      message: 'Aluno removido da sala com sucesso!'
    }
  }

  public async showStudents({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { teacher_id } = request.qs();

    const classroom = await Classroom.find(id);

    if (!classroom) {
      return response.status(404).json({
        message: 'Sala de aula não encontrada.',
      })
    }

    if (classroom.created_by != teacher_id) {
      return response.status(401).json({
        message: 'Você não tem permissões ver alunos desta sala de aula.',
      })
    }

    if (!classroom.availability) {
      return response.status(400).json({
        message: 'Sala de aula não possui disponibilidade.',
      })
    }

    await classroom.load('students')

    const { students } = classroom;

    return response.json({ students });
  }

  public async myClasses({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const student = await Student
      .query()
      .select(['id', 'name'])
      .where('id', id)
      .preload('classrooms', (query) => {
        query.select(['classrooms.class_number', 'classrooms.created_by'])
        query.pivotColumns(['student_id'])
        query.preload('teacher', (query) => {
          query.select(['name'])
        })
      })
      .first();

    if (!student) {
      return response.status(404).json({
        message: 'Aluno não encontrado.'
      });
    }

    const classesFormatted = student.classrooms.map((classroom) => {
      return {
        classNumber: classroom.class_number,
        teacher: classroom.teacher.name,
      }
    })

    return response.json({
      message: 'Salas de aula encontradas com sucesso.',
      data: {
        student: student.name,
        classes: classesFormatted
      }
    });
  }
}
