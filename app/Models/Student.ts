import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Classroom from './Classroom'

export default class Student extends BaseModel {
  @manyToMany(() => Classroom, {
    pivotTable: 'students_x_classrooms'
  })
  public classrooms: ManyToMany<typeof Classroom>

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public registration: string

  @column()
  public birthday: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
