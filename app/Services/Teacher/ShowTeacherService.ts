import NotFoundException from "App/Exceptions/NotFoundException";
import Teacher from "App/Models/Teacher";

export class ShowTeacherService {
  async execute(id: number) {
    const teacher = await Teacher.find(id);

    if (!teacher) {
      throw new NotFoundException('Professor não encontrado.');
    }

    return {
      message: 'Professor encontrado com sucesso!',
      data: teacher
    }
  }
}