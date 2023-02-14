import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Venue from 'App/Models/Venue'
import CreateVenueValidator from 'App/Validators/Venue/CreateVenueValidator'
import UpdateVenueValidator from 'App/Validators/Venue/UpdateVenueValidator'

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

  // create one venue
  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateVenueValidator)
    const venue = await Venue.create(payload)
    await venue.refresh()

    response.json({ success: true, venue })
  }

  // update one venue with id
  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const venue = await Venue.findOrFail(id)
    const payload = await request.validate(UpdateVenueValidator)

    await venue.merge(payload).save()
    await venue.refresh()

    response.json({ success: true, venue })
  }

  // delete one venue with id
  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const venue = await Venue.findOrFail(id)
    await venue?.delete()

    response.json({ success: true })
  }
}
