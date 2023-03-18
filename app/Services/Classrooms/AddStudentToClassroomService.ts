import BadRequestException from "App/Exceptions/BadRequestException";
import NotFoundException from "App/Exceptions/NotFoundException";
import UnauthorizedException from "App/Exceptions/UnauthorizedException";
import Classroom from "App/Models/Classroom";
import Student from "App/Models/Student";

interface IRequest {
  studentId: number;
  teacherId: number;
  classroomId: number;
}

export class AddStudentToClassroomService {
  async execute({ studentId, teacherId, classroomId }: IRequest) {
    const classroom = await Classroom.find(classroomId);

    if (!classroom) {
      throw new NotFoundException('Sala de aula não encontrada.');
    }

    if (classroom.created_by !== teacherId) {
      throw new UnauthorizedException('Você não tem permissões para adicionar alunos nesta sala de aula.');
    }

    if (!classroom.availability) {
      throw new BadRequestException('Sala de aula não possui disponibilidade.');
    }

    const newStudent = await Student.find(studentId);

    if (!newStudent) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    await classroom.load('students')

    const { students } = classroom;

    const studentAlreadyEnrolled = 
      students.some(students => students.id === newStudent.id);

    if (studentAlreadyEnrolled) {
      throw new BadRequestException('Aluno já cadastrado nesta sala de aula.');
    }

    const enrolledStudents = students.length;

    if (enrolledStudents === classroom.capacity) {
      if (classroom.availability) {
        classroom.availability = false;
        await classroom.save();
      } 

      throw new BadRequestException('Sala de aula já está com limite de alunos.');
    }

    await classroom.related('students').attach([newStudent.id])
    await classroom.save();

    return {
      message: 'Aluno adicionado à sala com sucesso!'
    }
  }
}