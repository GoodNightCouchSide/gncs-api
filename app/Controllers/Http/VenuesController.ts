import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Venue from 'App/Models/Venue'
import CreateOrUpdateVenueValidator from 'App/Validators/Venue/CreateOrUpdateVenueValidator'

export default class VenuesController {
  // get all venues
  public async index({ response }: HttpContextContract) {
    const venues = await Venue.query()

    response.json({ success: true, venues })
  }

  // get one venue per id
  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const venue = await Venue.findOrFail(id)

    response.json({ success: true, venue })
  }

  // post one venue
  // user must be moderator or admin
  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(CreateOrUpdateVenueValidator)
      const venue = await Venue.create(payload)

      response.json({ success: true, venue })
    } catch (error) {
      response.badRequest(error)
    }
  }

  // update one venue with id
  // user must be moderator or admin
  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const venue = await Venue.findOrFail(id)
    const payload = await request.validate(CreateOrUpdateVenueValidator)

    await venue.merge(payload).save()
    response.json({ success: true, venue })
  }

  // delete one venue with id
  // user must be admin
  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const venue = await Venue.findOrFail(id)
    await venue?.delete()

    response.json({ success: true })
  }
}
