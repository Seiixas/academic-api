import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException';
import { isValidMail } from 'App/Utils/ValidaEmail';

export default class ValidateEmail {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const { email } = request.body();

    if (email && !isValidMail(email)) {
      throw new BadRequestException('Este e-mail é inválido.')
    }

    await next()
  }
}
