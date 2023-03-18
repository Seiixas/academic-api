import { v4 as uuidV4 } from 'uuid';
import Student from "App/Models/Student";
import BadRequestException from 'App/Exceptions/BadRequestException';

interface IRequest {
  name: string;
  email: string;
  birthday: Date;
}

export class CreateStudentService {
  async execute({ name, email, birthday }: IRequest) {
    const emailAlreadyExists = await Student.findBy('email', email);

    if (emailAlreadyExists) {
      throw new BadRequestException('Este e-mail já está em uso.')
    }

    const todayDate = new Date().setHours(0,0,0,0);
    const birthdayDate = new Date(birthday).setHours(0,0,0,0);

    if (birthdayDate >= todayDate) {
      throw new BadRequestException('Data de nascimento superior a data de hoje.');
    }

    const registrationGenerated = uuidV4();

    const student = await Student.create({
      name,
      email,
      registration: registrationGenerated,
      birthday
    });

    await student.save();

    return {
      message: 'Aluno cadastrado com sucesso!',
      data: student
    }
  }
}