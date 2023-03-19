import { schema } from '@ioc:Adonis/Core/Validator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { AddStudentToClassroomService } from 'App/Services/Classrooms/AddStudentToClassroomService';
import { CreateClassroomService } from 'App/Services/Classrooms/CreateClassroomService';
import { RemoveClassroomService } from 'App/Services/Classrooms/RemoveClassroomService';
import { RemoveStudentFromClassroomService } from 'App/Services/Classrooms/RemoveStudentFromClassroomService';
import { ShowClassroomService } from 'App/Services/Classrooms/ShowClassroomService';
import { ShowClassroomsFromStudentService } from 'App/Services/Classrooms/ShowClassroomsFromStudentService';
import { ShowStudentsFromClassroomService } from 'App/Services/Classrooms/ShowStudentsFromClassroomService';
import { UpdateClassroomService } from 'App/Services/Classrooms/UpdateClassroomService';
import { ChangeAvailabilityService } from 'App/Services/Classrooms/ChangeAvailabilityService';

export default class ClassroomsController {
  public async store({ request, response }: HttpContextContract) {
    const {
      teacher_responsible,
      class_number,
      capacity
    } = request.body();

    const createClassroomSchema = schema.create({
      teacher_responsible: schema.number(),
      class_number: schema.number(),
      capacity: schema.number(),
    })

    await request.validate({ schema: createClassroomSchema });

    const createClassroomService = new CreateClassroomService();

    const classroom = await createClassroomService.execute({
      teacherId: teacher_responsible,
      classNumber: class_number,
      capacity,
    })

    return response.status(201).json(classroom);
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const showClassroomService = new ShowClassroomService();

    const classroom = await showClassroomService.execute(id);

    return response.json(classroom);
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const {
      teacher_responsible,
      class_number,
      capacity,
    } = request.body();

    const updateClassroomSchema = schema.create({
      teacher_responsible: schema.number.optional(),
      class_number: schema.number.optional(),
      capacity: schema.number.optional(),
    })

    await request.validate({ schema: updateClassroomSchema });

    const updateClassroomService = new UpdateClassroomService();

    const updatedClassroom = await updateClassroomService.execute({
      id,
      teacherId: teacher_responsible,
      classNumber: class_number,
      capacity,
    });

    return response.json(updatedClassroom)
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { teacher_responsible } = request.body();

    const removeClassroomSchema = schema.create({
      teacher_responsible: schema.number(),
    })

    await request.validate({ schema: removeClassroomSchema });

    const removeClassroomService = new RemoveClassroomService();

    await removeClassroomService.execute({
      id,
      teacherId: teacher_responsible,
    })

    return response.status(204);
  }

  public async addStudent({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { classroom_id, teacher_id } = request.body();

    const addStudentSchema = schema.create({
      classroom_id: schema.number(),
      teacher_id: schema.number(),
    })

    await request.validate({ schema: addStudentSchema });

    const addStudentToClassroomService = new AddStudentToClassroomService();

    const studentAdded = await addStudentToClassroomService.execute({
      studentId: Number(id),
      teacherId: teacher_id,
      classroomId: classroom_id,
    })

    return response.json(studentAdded);
  }

  public async removeStudent({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { classroom_id, teacher_id } = request.body();

    const removeStudentSchema = schema.create({
      classroom_id: schema.number(),
      teacher_id: schema.number(),
    })

    await request.validate({ schema: removeStudentSchema });

    const removeStudentFromClassroomService = new RemoveStudentFromClassroomService();

    const studentRemoved = await removeStudentFromClassroomService.execute({
      studentId: id,
      teacherId: teacher_id,
      classroomId: classroom_id,
    })

    return response.json(studentRemoved);
  }

  public async showStudents({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { teacher_id } = request.qs();

    const showStudentsFromClassroomService = new ShowStudentsFromClassroomService();

    const studentsFromClassroom = await showStudentsFromClassroomService.execute({
      classroomId: id,
      teacherId: teacher_id
    })

    return response.json(studentsFromClassroom);
  }

  public async myClasses({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const showClassroomsFromStudentService = new ShowClassroomsFromStudentService();

    const classes = await showClassroomsFromStudentService.execute(id);

    return response.json(classes);
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
