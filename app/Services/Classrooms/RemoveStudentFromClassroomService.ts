import BadRequestException from "App/Exceptions/BadRequestException";
import NotFoundException from "App/Exceptions/NotFoundException";
import UnauthorizedException from "App/Exceptions/UnauthorizedException";
import Classroom from "App/Models/Classroom";
import Student from "App/Models/Student";

interface IRequest {
  studentId: number;
  teacherId: number;
  classroomId: number;
}

export class RemoveStudentFromClassroomService {
  async execute({ studentId, teacherId, classroomId }: IRequest) {
    const classroom = await Classroom.find(classroomId);

    if (!classroom) {
      throw new NotFoundException('Sala de aula não encontrada.');
    }

    if (classroom.created_by !== teacherId) {
      throw new UnauthorizedException('Você não tem permissões para remover alunos nesta sala de aula.');
    }

    const studentToRemove = await Student.find(studentId);

    if (!studentToRemove) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    await classroom.load('students')

    const { students } = classroom;

    const enrolledStudents = students.length;

    const studentAlreadyEnrolled = 
      students.some(students => students.id === studentToRemove.id);

    if (!studentAlreadyEnrolled) {
      throw new BadRequestException('Aluno não encontrado nesta sala de aula.');
    }

    await classroom.related('students').detach([studentToRemove.id])
    await classroom.save();

    if ((enrolledStudents - 1) < classroom.capacity && !classroom.availability) {
      classroom.availability = true;
      await classroom.save();
    }

    return {
      message: 'Aluno removido da sala com sucesso!'
    }
  }
}