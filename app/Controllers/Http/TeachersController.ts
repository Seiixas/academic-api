import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { CreateTeacherService } from 'App/Services/Teacher/CreateTeacherService';
import { ShowTeacherService } from 'App/Services/Teacher/ShowTeacherService';
import { UpdateTeacherService } from 'App/Services/Teacher/UpdateTeacherService';
import { RemoveTeacherService } from 'App/Services/Teacher/RemoveTeacherService';
import { ChangeAvailabilityService } from 'App/Services/Classrooms/ChangeAvailabilityService';

export default class TeachersController {
  public async store({ request, response }: HttpContextContract) {
    const { name, email, birthday } = request.body();

    const createTeacherService = new CreateTeacherService();

    const teacher = await createTeacherService.execute({
      name, email, birthday
    });

    return response.status(201).json(teacher);
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const showTeacherService = new ShowTeacherService();

    const teacher = await showTeacherService.execute(id);

    return response.json(teacher)
  }

  public async update({ request, response }: HttpContextContract) {
    const { name, email, birthday } = request.body();
    const { id } = request.params();

    const updateTeacherService = new UpdateTeacherService();

    const updatedTeacher = await updateTeacherService.execute({
      name,
      email,
      birthday,
      id,
    })

    return response.json(updatedTeacher);
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { email } = request.body();

    const removeTeacherService = new RemoveTeacherService();

    await removeTeacherService.execute({ id, email });

    return response.status(204);
  }

  public async changeAvailability({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { status, teacher_responsible } = request.body();

    const changeAvailabilityService = new ChangeAvailabilityService();

    await changeAvailabilityService.execute({
      classroomId: id, status, teacherId: teacher_responsible
    })

    return response.status(204);
  }
}
