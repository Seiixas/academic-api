import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Classroom from 'App/Models/Classroom';
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
      createdBy: teacher.id,
      classNumber: class_number,
      availability,
      capacity
    });

    await classroom.save();
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

    if (classroom.createdBy !== teacher.id) {
      response.status(401);
      return {
        message: 'Você não está autorizado a editar esta sala de aula.'
      }
    }

    // TODO: Criar um get para ver a quantidade alunos e cria regra de negócio para editar capacidade

    classroom.classNumber = class_number ?? class_number;
    classroom.capacity = capacity ?? capacity;
    classroom.availability = availability ?? availability;
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

    if (classroom.createdBy !== teacher.id) {
      response.status(401);
      return {
        message: 'Você não está autorizado a deletar esta sala de aula.'
      }
    }

    await classroom.delete();
    response.status(204);
  }
}
