import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { CreateStudentService } from 'App/Services/Students/CreateStudentService';
import { ShowStudentService } from 'App/Services/Students/ShowStudentService';
import { UpdateStudentService } from 'App/Services/Students/UpdateStudentService';
import { RemoveStudentService } from 'App/Services/Students/RemoveStudentService';

export default class StudentsController {
  public async store({ request, response }: HttpContextContract) {
    const { name, email, birthday } = request.body();

    const createStudentService = new CreateStudentService();

    const student = await createStudentService.execute({
      name, email, birthday
    });

    return response.status(201).json(student);
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const showStudentService = new ShowStudentService();

    const student = await showStudentService.execute(id);

    return response.json(student)
  }

  public async update({ request, response }: HttpContextContract) {
    const { name, email, birthday } = request.body();
    const { id } = request.params();

    const updateStudentService = new UpdateStudentService();

    const updatedStudent = await updateStudentService.execute({
      name,
      email,
      birthday,
      id,
    })

    return response.json(updatedStudent);
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { email } = request.body();

    const removeStudentService = new RemoveStudentService();

    await removeStudentService.execute({ id, email });

    return response.status(204);
  }
}
