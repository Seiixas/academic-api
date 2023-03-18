import NotFoundException from "App/Exceptions/NotFoundException";
import Student from "App/Models/Student";

export class ShowStudentService {
  async execute(id: number) {
    const student = await Student.find(id);

    if (!student) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    return {
      message: 'Aluno encontrado com sucesso!',
      data: student
    }
  }
}