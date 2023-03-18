import BadRequestException from "App/Exceptions/BadRequestException";
import NotFoundException from "App/Exceptions/NotFoundException";
import Student from "App/Models/Student";

interface IRequest {
  name: string;
  email: string;
  birthday: Date;
  id: number;
}

export class UpdateStudentService {
  async execute({ name, email, birthday, id }: IRequest) {
    const student = await Student.find(id);

    if (!student) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    const emailAlreadyExists = await Student.findBy('email', email);

    if (emailAlreadyExists) {
      throw new BadRequestException('Este e-mail já está em uso.');
    }

    const todayDate = new Date().setHours(0,0,0,0);
    const birthdayDate = new Date(birthday).setHours(0,0,0,0);

    if (birthdayDate >= todayDate) {
      throw new BadRequestException('Data de nascimento superior a data de hoje.');
    }
    
    student.name = name ?? name;
    student.email = email ?? email;
    student.birthday = birthday ?? birthday;

    await student.save();

    return {
      message: 'Aluno alterado com sucesso!',
      data: student
    }
  }
}