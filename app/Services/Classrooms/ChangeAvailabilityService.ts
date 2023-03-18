import BadRequestException from "App/Exceptions/BadRequestException";
import NotFoundException from "App/Exceptions/NotFoundException";
import UnauthorizedException from "App/Exceptions/UnauthorizedException";
import Classroom from "App/Models/Classroom";

interface IRequest {
  teacherId: number;
  status: boolean;
  classroomId: number;
}

export class ChangeAvailabilityService {
  async execute({ teacherId, status, classroomId }: IRequest) {
    const classroom = await Classroom.find(classroomId);

    if (!classroom) {
      throw new NotFoundException('Sala de aula não encontrada.');
    }

    if (classroom.created_by != teacherId) {
      throw new UnauthorizedException('Você não tem permissões para editar esta sala de aula.');
    }

    await classroom.load('students');

    const enrolledStudents = classroom.students.length;

    if (enrolledStudents === classroom.capacity && status) {
      throw new BadRequestException('Não é possível definir a sala como disponível quando não há vagas');
    }

    if (classroom.availability === status) {
      throw new BadRequestException('Esta sala de aula já possui o status desejado.')
    }

    classroom.availability = status;

    await classroom.save();
  }
}