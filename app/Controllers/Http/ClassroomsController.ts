import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Classroom from 'App/Models/Classroom';
import Student from 'App/Models/Student';
import Teacher from 'App/Models/Teacher';

export default class ClassroomsController {
  public async store({ request, response }: HttpContextContract) {
    const {
      teacher_responsible,
      class_number,
      capacity,
      availability
    } = request.body();

    if (capacity <= 0) {
      response.status(400);
      return {
        message: 'A sala deve ter ao menos uma vaga para alunos.'
      }
    }

    const teacher = await Teacher.find(teacher_responsible);

    if (!teacher) {
      response.status(404);
      return {
        message: 'Este professor não existe.'
      }
    }

    const classroom = await Classroom.create({
      created_by: teacher.id,
      class_number,
      availability,
      capacity
    });

    await classroom.save();

    return {
      message: 'Sala de aula criada com sucesso!',
      data: classroom
    }
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const classroom = await Classroom.find(id);

    if (!classroom) {
      response.status(404);
      return {
        message: 'Sala de aula não encontrado.',
      }
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
      response.status(404);
      return {
        message: 'Sala de aula não encontrado.',
      }
    }

    const teacher = await Teacher.find(teacher_responsible);

    if (!teacher) {
      response.status(404);
      return {
        message: 'Professor responsável não encontrado.',
      }
    }

    if (classroom.created_by !== teacher.id) {
      response.status(401);
      return {
        message: 'Você não está autorizado a editar esta sala de aula.'
      }
    }

    // TODO: Criar um get para ver a quantidade alunos e cria regra de negócio para editar capacidade

    classroom.class_number = class_number ?? class_number;
    classroom.capacity = capacity ?? capacity;
    classroom.availability = availability ?? availability;

    await classroom.save();

    return {
      message: 'Sala de aula atualizada com sucesso!',
      data: classroom
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { teacher_responsible } = request.body();

    const teacher = await Teacher.find(teacher_responsible);

    if (!teacher) {
      response.status(404);
      return {
        message: 'Professor responsável não encontrado.',
      }
    }

    const classroom = await Classroom.find(id);

    if (!classroom) {
      response.status(404);
      return {
        message: 'Sala de aula não encontrado.',
      }
    }

    if (classroom.created_by !== teacher.id) {
      response.status(401);
      return {
        message: 'Você não está autorizado a deletar esta sala de aula.'
      }
    }

    await classroom.delete();
    response.status(204);
  }

  public async addStudent({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { classroom_id, teacher_id } = request.body();

    const classroom = await Classroom.find(classroom_id);

    if (!classroom) {
      response.status(404);
      return {
        message: 'Sala de aula não encontrada.',
      }
    }

    if (classroom.created_by !== teacher_id) {
      response.status(401);
      return {
        message: 'Você não tem permissões para adicionar alunos nesta sala de aula.',
      }
    }

    if (!classroom.availability) {
      response.status(400);
      return {
        message: 'Sala de aula não possui disponibilidade.',
      }
    }

    const newStudent = await Student.find(id);

    if (!newStudent) {
      response.status(404);
      return {
        message: 'Aluno não encontrado.',
      }
    }

    await classroom.load('students')

    const { students } = classroom;

    const studentAlreadyEnrolled = 
      students.some(students => students.id === newStudent.id);

    if (studentAlreadyEnrolled) {
      response.status(400);
      return {
        message: 'Aluno já cadastrado nesta sala de aula.',
      }
    }

    const enrolledStudents = students.length;

    if (enrolledStudents === classroom.capacity) {
      
      if (classroom.availability) {
        classroom.availability = false;
        await classroom.save();
      } 

      response.status(400);
      return {
        message: 'Sala de aula já está com limite de alunos.',
      }
    }

    await classroom.related('students').attach([newStudent.id])
    await classroom.save();

    return {
      message: 'Aluno adicionado à sala com sucesso!'
    }
  }
}
