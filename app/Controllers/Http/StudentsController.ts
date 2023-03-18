import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidV4 } from 'uuid';

import Student from 'App/Models/Student';

export default class StudentsController {
  public async store({ request, response }: HttpContextContract) {
    const { name, email, birthday } = request.body();

    const emailAlreadyExists = await Student.findBy('email', email);

    if (emailAlreadyExists) {
      return response.status(400).json({
        message: 'Este e-mail já está em uso.',
      })
    }

    const todayDate = new Date().setHours(0,0,0,0);
    const birthdayDate = new Date(birthday).setHours(0,0,0,0);

    if (birthdayDate >= todayDate) {
      return response.status(400).json({
        message: 'Data de nascimento superior a data de hoje.'
      })
    }

    const registrationGenerated = uuidV4();

    const student = await Student.create({
      name,
      email,
      registration: registrationGenerated,
      birthday
    });

    response.status(201);

    return response.json({
      message: 'Aluno cadastrado com sucesso!',
      data: student
    });
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const student = await Student.find(id);

    if (!student) {
      return response.status(404).json({
        message: 'Aluno não encontrado.',
      })
    }

    return response.json({
      message: 'Aluno encontrado com sucesso!',
      data: student
    })
  }

  public async update({ request, response }: HttpContextContract) {
    const { name, email, birthday } = request.body();
    const { id } = request.params();

    const student = await Student.find(id);

    if (!student) {
      return response.status(404).json({
        message: 'Aluno não encontrado.',
      })
    }

    const emailAlreadyExists = await Student.findBy('email', email);

    if (emailAlreadyExists) {
      return response.status(400).json({
        message: 'Este e-mail já está em uso.',
      })
    }

    const todayDate = new Date().setHours(0,0,0,0);
    const birthdayDate = new Date(birthday).setHours(0,0,0,0);

    if (birthdayDate >= todayDate) {
      return response.status(400).json({
        message: 'Data de nascimento superior a data de hoje.',
      })
    }
    
    student.name = name ?? name;
    student.email = email ?? email;
    student.birthday = birthday ?? birthday;

    await student.save();

    return response.json({
      message: 'Aluno alterado com sucesso!',
      data: student
    })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { email } = request.body();

    const student = await Student.find(id);

    if (!student) {
      return response.status(404).json({
        message: 'Aluno não encontrado.',
      })
    }

    if (student.email !== email) {
      return response.status(404).json({
        message: 'E-mail não confere com e-mail do aluno.',
      })
    }
    
    await student.delete();
    return response.status(204);
  }
}
