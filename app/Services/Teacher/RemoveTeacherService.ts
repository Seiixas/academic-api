import NotFoundException from "App/Exceptions/NotFoundException";
import UnauthorizedException from "App/Exceptions/UnauthorizedException";
import Teacher from "App/Models/Teacher";

interface IRequest {
  email: string;
  id: number;
}

export class RemoveTeacherService {
  async execute({ id, email }: IRequest) {
    const teacher = await Teacher.find(id);

    if (!teacher) {
      throw new NotFoundException('Professor não encontrado.');
    }

    if (teacher.email !== email) {
      throw new UnauthorizedException('E-mail não confere com e-mail do aluno.');
    }
    
    await teacher.delete();
  }
}