import BadRequestException from "App/Exceptions/BadRequestException";
import NotFoundException from "App/Exceptions/NotFoundException";
import Classroom from "App/Models/Classroom";
import Teacher from "App/Models/Teacher";

interface IRequest {
  teacherId: number;
  classNumber: number;
  capacity: number;
}

export class CreateClassroomService {
  async execute({ teacherId, classNumber, capacity }: IRequest) {
    if (capacity <= 0) {
      throw new BadRequestException('A sala deve ter ao menos uma vaga para alunos.')
    }

    const teacher = await Teacher.find(teacherId);

    if (!teacher) {
      throw new NotFoundException('Este professor não existe.');
    }

    const classNumberAlreadyExists = await Classroom.findBy('class_number', classNumber);

    if (classNumberAlreadyExists) {
      throw new BadRequestException('Este número de classe já foi utilizado por outro professor.')
    }

    const classroom = await Classroom.create({
      created_by: teacher.id,
      class_number: classNumber,
      capacity
    });

    await classroom.save();

    return {
      message: 'Sala de aula criada com sucesso!',
      data: classroom
    }
  }
}