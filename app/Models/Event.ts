import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Venue from './Venue'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public cover: string

  @column()
  public prePayment: number

  @column()
  public boxOffice: number

  @column()
  public venue: number

  @column()
  public links: JSON

  @column()
  public creator: number

  @column()
  public isPublic: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // @beforeSave()
  // public static stringifyEventLinks(event: Event) {
  //   if (event.links) {
  //     event.links = JSON.stringify(event.links)
  //   }
  // }

  // Relationships
  @belongsTo(() => User)
  public creatorUser: BelongsTo<typeof User>

  @belongsTo(() => Venue)
  public VenueData: BelongsTo<typeof Venue>
}
