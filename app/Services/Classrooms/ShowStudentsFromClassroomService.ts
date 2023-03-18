import BadRequestException from "App/Exceptions/BadRequestException";
import NotFoundException from "App/Exceptions/NotFoundException";
import UnauthorizedException from "App/Exceptions/UnauthorizedException";
import Classroom from "App/Models/Classroom";

interface IRequest {
  teacherId: number;
  classroomId: number;
}

export class ShowStudentsFromClassroomService {
  async execute({ teacherId, classroomId }: IRequest) {
    const classroom = await Classroom.find(classroomId);

    if (!classroom) {
      throw new NotFoundException('Sala de aula não encontrada.');
    }

    if (classroom.created_by != teacherId) {
      throw new UnauthorizedException('Você não tem permissões ver alunos desta sala de aula.');
    }

    if (!classroom.availability) {
      throw new BadRequestException('Sala de aula não possui disponibilidade.');
    }

    await classroom.load('students')

    const { students } = classroom;

    return {
      message: 'Alunos encontrados com sucesso!',
      data: students,
    }
  }
}