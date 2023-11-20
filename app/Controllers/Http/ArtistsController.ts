import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Artist from 'App/Models/Artist'
import CreateArtistValidator from 'App/Validators/Artist/CreateArtistValidator'
import LogoUploadValidator from 'App/Validators/Artist/LogoUploadValidator'
import UpdateArtistValidator from 'App/Validators/Artist/UpdateArtistValidator'

export default class ArtistsController {
  /**
   * GET all Artist
   * @param {HttpContextContract} ctx Http contest Contract
   */
  public async index({ response }: HttpContextContract) {
    const artists = await Artist.query()
    response.json({ success: true, artists })
  }

  /**
   * GET an Artist by uuid
   * @param {HttpContextContract} ctx Http contest Contract
   */
  public async show({ request, response }: HttpContextContract) {
    const artist = await Artist.findByOrFail('id', request.param('id'))
    response.json({ success: true, artist })
  }

  /**
   * CREATE an Artist
   * @param {HttpContextContract} ctx Http contest Contract
   */
  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateArtistValidator)
    const artist = await Artist.create(payload)

    const { logo } = await request.validate(LogoUploadValidator)
    artist.logo = logo ? Attachment.fromFile(logo) : null

    await artist.save()
    response.json({ success: true, artist })
  }

  /**
   * UPDATE an Artist
   * @param {HttpContextContract} ctx Http contest Contract
   */
  public async update({ request, response }: HttpContextContract) {
    const artist = await Artist.findByOrFail('id', request.param('id'))
    const payload = await request.validate(UpdateArtistValidator)

    const { logo } = await request.validate(LogoUploadValidator)
    artist.logo = logo ? Attachment.fromFile(logo) : null

    await artist.merge(payload).save()
    response.json({ success: true, artist })
  }

  /**
   * DELETE an Artist
   * @param {HttpContextContract} ctx Http contest Contract
   */
  public async destroy({ request, response }: HttpContextContract) {
    const artist = await Artist.findByOrFail('id', request.param('id'))
    await artist?.delete()

    response.json({ success: true })
  }
}
