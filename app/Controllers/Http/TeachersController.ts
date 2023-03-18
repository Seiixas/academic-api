import { schema } from '@ioc:Adonis/Core/Validator'

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

    const createTeacherSchema = schema.create({
      name: schema.string(),
      email: schema.string(),
      birthday: schema.date(),
    })

    await request.validate({ schema: createTeacherSchema });

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

    const updateTeacherSchema = schema.create({
      name: schema.string.optional(),
      email: schema.string.optional(),
      birthday: schema.date.optional(),
    })

    await request.validate({ schema: updateTeacherSchema });

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

    const removeTeacherSchema = schema.create({
      email: schema.string(),
    })

    await request.validate({ schema: removeTeacherSchema });

    const removeTeacherService = new RemoveTeacherService();

    await removeTeacherService.execute({ id, email });

    return response.status(204);
  }

  public async changeAvailability({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { status, teacher_responsible } = request.body();

    const changeAvailabilitySchema = schema.create({
      status: schema.boolean(),
      teacher_responsible: schema.number(),
    })

    await request.validate({ schema: changeAvailabilitySchema });

    const changeAvailabilityService = new ChangeAvailabilityService();

    await changeAvailabilityService.execute({
      classroomId: id, status, teacherId: teacher_responsible
    })

    return response.status(204);
  }
}
