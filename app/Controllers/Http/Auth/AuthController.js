'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

const User = use('App/Models/User')
const Image = use('App/Models/Image')
const ImageType = use('App/Models/ImageType')

const ImageService = use('App/Services/Image')

/**
 * Resourceful controller for interacting with auths
 */
class AuthController {
    async getGoogleUrl({ response, ally }) {
        try {
            const url = await ally.driver('google').getRedirectUrl()
            return response
                .status(200)
                .send(
                    url /*{
                success: true,
                google_url: url
            }*/
                )
        } catch (error) {
            return response.status(500).send({
                success: false,
                error: 'Google service is down'
            })
        }
    }

    async authenticatedWithGoogle({ response, ally }) {
        const trx = await Database.beginTransaction()

        try {
            const googleUser = await ally.driver('google').getUser()
            const email = googleUser.getEmail()
            const name = googleUser.getName()

            const user = await User.findOrCreate(
                { email },
                {
                    email,
                    name
                },
                trx
            )

            // TODO ROLES
            // await user.roles().attach(
            // 	[userRole.id /*, adminRole*/],
            // 	null, // callback
            // 	trx // transaction
            // )

            if (!user.avatar_id) {
                const imageType = await ImageType.findBy('name', 'user_avatar')

                const imageService = new ImageService()
                const {
                    filename,
                    ext
                } = await imageService.uploadGoogleAvatarToS3(
                    user.id,
                    googleUser.getAvatar()
                )

                const image = await Image.create(
                    {
                        filename,
                        ext,
                        image_type_id: imageType.id
                    },
                    trx
                )

                user.avatar_id = image.id
                await user.save(trx)
            }

            await trx.commit()

            return response.status(200).send({
                user: googleUser
            })
        } catch (error) {
            await trx.rollback()

            return response.status(500).send({
                success: false,
                error: 'Cannt create user'
            })
        }
    }
}

module.exports = AuthController
