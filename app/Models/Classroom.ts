import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Teacher from './Teacher'
import Student from './Student'

export default class Classroom extends BaseModel {
  @manyToMany(() => Student, {
    pivotTable: 'students_x_classrooms'
  })
  public students: ManyToMany<typeof Student>

  @column({ isPrimary: true })
  public id: number

  @column()
  public class_number: number

  @column()
  public capacity: number

  @column()
  public availability: boolean

  @column()
  public created_by: number

  @belongsTo(() => Teacher, {
    foreignKey: 'created_by',
  })
  public teacher: BelongsTo<typeof Teacher>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
