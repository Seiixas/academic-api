import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidV4 } from 'uuid';

import Teacher from 'App/Models/Teacher';

export default class TeachersController {
  public async store({ request, response }: HttpContextContract) {
    const { name, email, birthday } = request.body();

    const emailAlreadyExists = await Teacher.findBy('email', email);

    if (emailAlreadyExists) {
      response.status(400);
      return {
        message: 'Este e-mail já está em uso.',
      }
    }

    const todayDate = new Date().setHours(0,0,0,0);
    const birthdayDate = new Date(birthday).setHours(0,0,0,0);

    if (birthdayDate >= todayDate) {
      response.status(400);
      return {
        message: 'Data de nascimento superior a data de hoje.',
      }
    }

    const registrationGenerated = uuidV4();

    const teacher = await Teacher.create({
      name,
      email,
      registration: registrationGenerated,
      birthday
    });

    await teacher.save();
    response.status(201);

    return {
      message: 'Professor cadastrado com sucesso!',
      data: teacher
    };
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const teacher = await Teacher.find(id);

    if (!teacher) {
      response.status(404);
      return {
        message: 'Professor não encontrado.',
      }
    }

    return {
      message: 'Professor encontrado com sucesso!',
      data: teacher
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const { name, email, birthday } = request.body();
    const { id } = request.params();

    const teacher = await Teacher.find(id);

    if (!teacher) {
      response.status(404);
      return {
        message: 'Professor não encontrado.',
      }
    }

    const emailAlreadyExists = await Teacher.findBy('email', email);

    if (emailAlreadyExists) {
      response.status(400);
      return {
        message: 'Este e-mail já está em uso.',
      }
    }

    const todayDate = new Date().setHours(0,0,0,0);
    const birthdayDate = new Date(birthday).setHours(0,0,0,0);

    if (birthdayDate >= todayDate) {
      response.status(400);
      return {
        message: 'Data de nascimento superior a data de hoje.',
      }
    }
    
    teacher.name = name ?? name;
    teacher.email = email ?? email;
    teacher.birthday = birthday ?? birthday;

    await teacher.save();

    return {
      message: 'Professor alterado com sucesso!',
      data: teacher
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { email } = request.body();

    const teacher = await Teacher.find(id);

    if (!teacher) {
      response.status(404);
      return {
        message: 'Professor não encontrado.',
      }
    }

    if (teacher.email !== email) {
      response.status(404);
      return {
        message: 'E-mail não confere com e-mail do professor.',
      }
    }
    
    await teacher.delete();
    response.status(204);
  }
}
