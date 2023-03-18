import NotFoundException from "App/Exceptions/NotFoundException";
import UnauthorizedException from "App/Exceptions/UnauthorizedException";
import Student from "App/Models/Student";

interface IRequest {
  email: string;
  id: number;
}

export class RemoveStudentService {
  async execute({ id, email }: IRequest) {
    const student = await Student.find(id);

    if (!student) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    if (student.email !== email) {
      throw new UnauthorizedException('E-mail não confere com e-mail do aluno.');
    }
    
    await student.delete();
  }
}