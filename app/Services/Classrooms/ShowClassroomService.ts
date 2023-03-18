import NotFoundException from "App/Exceptions/NotFoundException";
import Classroom from "App/Models/Classroom";

export class ShowClassroomService {
  async execute(id: number) {
    const classroom = await Classroom.find(id);

    if (!classroom) {
      throw new NotFoundException('Sala de aula não encontrada.');
    }

    await classroom.load('students')

    return {
      message: 'Sala de aula encontrada com sucesso!',
      data: classroom
    }
  }
}