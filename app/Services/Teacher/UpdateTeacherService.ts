import BadRequestException from "App/Exceptions/BadRequestException";
import NotFoundException from "App/Exceptions/NotFoundException";
import Teacher from "App/Models/Teacher";

interface IRequest {
  name: string;
  email: string;
  birthday: Date;
  id: number;
}

export class UpdateTeacherService {
  async execute({ name, email, birthday, id }: IRequest) {
    const teacher = await Teacher.find(id);

    if (!teacher) {
      throw new NotFoundException('Professor não encontrado.');
    }

    if (email) {
      if (email === teacher.email) {
        throw new BadRequestException('Este é o seu próprio e-mail.');
      }
  
      const emailAlreadyExists = await Teacher.findBy('email', email);
  
      if (emailAlreadyExists) {
        throw new BadRequestException('Este e-mail já está em uso.');
      }
    }

    const todayDate = new Date().setHours(0,0,0,0);
    const birthdayDate = new Date(birthday).setHours(0,0,0,0);

    if (birthdayDate >= todayDate) {
      throw new BadRequestException('Data de nascimento superior a data de hoje.');
    }
    
    teacher.name = name ?? name;
    teacher.email = email ?? email;
    teacher.birthday = birthday ?? birthday;

    await teacher.save();

    return {
      message: 'Professor alterado com sucesso!',
      data: {
        name: teacher.name,
        email: teacher.email,
        birthday: teacher.birthday
      }
    }
  }
}