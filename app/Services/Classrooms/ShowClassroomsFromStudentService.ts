import NotFoundException from "App/Exceptions/NotFoundException";
import Student from "App/Models/Student";

export class ShowClassroomsFromStudentService {
  async execute(id: number) {
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
      throw new NotFoundException('Aluno não encontrado.');
    }

    const classesFormatted = student.classrooms.map((classroom) => {
      return {
        classNumber: classroom.class_number,
        teacher: classroom.teacher.name,
      }
    })

    return {
      message: 'Salas de aula encontradas com sucesso.',
      data: {
        student: student.name,
        classes: classesFormatted
      }
    }
  }
}