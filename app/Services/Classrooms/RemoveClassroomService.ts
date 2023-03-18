import NotFoundException from "App/Exceptions/NotFoundException";
import UnauthorizedException from "App/Exceptions/UnauthorizedException";
import Classroom from "App/Models/Classroom";
import Teacher from "App/Models/Teacher";

interface IRequest {
  teacherId: number;
  id: number;
}

export class RemoveClassroomService {
  async execute({ teacherId, id }: IRequest) {
    const teacher = await Teacher.find(teacherId);

    if (!teacher) {
      throw new NotFoundException('Professor responsável não encontrado.')
    }

    const classroom = await Classroom.find(id);

    if (!classroom) {
      throw new NotFoundException('Sala de aula não encontrada.');
    }

    if (classroom.created_by !== teacher.id) {
      throw new UnauthorizedException('Você não está autorizado a deletar esta sala de aula.');
    }

    await classroom.delete();
  }
}