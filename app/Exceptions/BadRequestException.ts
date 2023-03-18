import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BadRequestException extends Exception {
  public async handle(error: this, ctx: HttpContextContract) {
    ctx.response.status(400).json({
      message: error.message
    })
  }
}
