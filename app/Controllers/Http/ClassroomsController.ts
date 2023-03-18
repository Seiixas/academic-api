import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Classroom from 'App/Models/Classroom';
import Student from 'App/Models/Student';
import { AddStudentToClassroomService } from 'App/Services/Classrooms/AddStudentToClassroomService';
import { CreateClassroomService } from 'App/Services/Classrooms/CreateClassroomService';
import { RemoveClassroomService } from 'App/Services/Classrooms/RemoveClassroomService';
import { RemoveStudentFromClassroomService } from 'App/Services/Classrooms/RemoveStudentFromClassroomService';
import { ShowClassroomService } from 'App/Services/Classrooms/ShowClassroomService';
import { ShowClassroomsFromStudentService } from 'App/Services/Classrooms/ShowClassroomsFromStudentService';
import { ShowStudentsFromClassroomService } from 'App/Services/Classrooms/ShowStudentsFromClassroomService';
import { UpdateClassroomService } from 'App/Services/Classrooms/UpdateClasroomService';

export default class ClassroomsController {
  public async store({ request, response }: HttpContextContract) {
    const {
      teacher_responsible,
      class_number,
      capacity
    } = request.body();

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
      availability
    } = request.body();

    const updateClassroomService = new UpdateClassroomService();

    const updatedClassroom = await updateClassroomService.execute({
      id,
      teacherId: teacher_responsible,
      classNumber: class_number,
      capacity,
      availability,
    });

    return response.json(updatedClassroom)
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const { teacher_responsible } = request.body();

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

    console.table({
      id,
      classroom_id,
      teacher_id
    })

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
}
