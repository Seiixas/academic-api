import { v4 as uuidV4 } from 'uuid';
import BadRequestException from 'App/Exceptions/BadRequestException';
import Teacher from 'App/Models/Teacher';

interface IRequest {
  name: string;
  email: string;
  birthday: Date;
}

export class CreateTeacherService {
  async execute({ name, email, birthday }: IRequest) {
    const emailAlreadyExists = await Teacher.findBy('email', email);

    if (emailAlreadyExists) {
      throw new BadRequestException('Este e-mail já está em uso.')
    }

    const todayDate = new Date().setHours(0,0,0,0);
    const birthdayDate = new Date(birthday).setHours(0,0,0,0);

    if (birthdayDate >= todayDate) {
      throw new BadRequestException('Data de nascimento superior a data de hoje.');
    }

    const registrationGenerated = uuidV4();

    const teacher = await Teacher.create({
      name,
      email,
      registration: registrationGenerated,
      birthday
    });

    await teacher.save();

    return {
      message: 'Professor cadastrado com sucesso!',
      data: teacher
    }
  }
}