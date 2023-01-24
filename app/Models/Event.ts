import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Venue from './Venue'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public title: string

  @column()
  public headliner: string

  @column()
  public support: string

  @column.dateTime()
  public date: DateTime

  @column()
  public description: string

  @column()
  public cover: string

  @column()
  public prePayment: string

  @column()
  public boxOffice: string

  @column()
  public venueId: string

  @column()
  public alternativeAddress: string

  @column()
  public links: string

  @column()
  public creatorEmail: string

  @column()
  public isPublic: boolean = false

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships
  @hasOne(() => User, {
    foreignKey: 'userEmail',
  })
  public creator: HasOne<typeof User>

  @hasOne(() => Venue)
  public venue: HasOne<typeof Venue>
}
