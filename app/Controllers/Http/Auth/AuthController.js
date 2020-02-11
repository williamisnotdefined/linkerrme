'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const fs = use('fs')

const Database = use('Database')
const Helpers = use('Helpers')

const Image = use('App/Models/Image')
const ImageType = use('App/Models/ImageType')

const UserService = use('App/Services/User')

/**
 * Resourceful controller for interacting with auths
 */
class AuthController {
    async getGoogleUrl({ response, ally, antl }) {
        try {
            const url = await ally.driver('google').getRedirectUrl()
            return response.status(200).send({
                success: true,
                google_url: url
            })
        } catch (error) {
            return response.status(500).send({
                success: false,
                error: antl.formatMessage('auth.cant_request_google_url')
            })
        }
    }

    async authenticatedWithGoogle({ response, ally, auth, antl }) {
        const trx = await Database.beginTransaction()

        try {
            const googleUser = await ally.driver('google').getUser()

            const user = await UserService.findOrCreate(googleUser, trx)
            await trx.commit()

            const authData = await auth.withRefreshToken().generate(user)

            return response.status(200).send({
                success: true,
                auth_data: authData
            })
        } catch (error) {
            await trx.rollback()

            return response.status(500).send({
                success: false,
                error: antl.formatMessage('auth.cant_auth')
            })
        }
    }

    async updateUserAvatar({ request, response, auth, antl }) {
        const user = await auth.getUser()

        const avatar = request.file('avatar', {
            types: ['image'],
            size: '20mb'
        })

        if (!avatar) {
            return response.status(400).send({
                success: false,
                error: antl.formatMessage('auth.avatar_required')
            })
        }

        const tmpAvatarName = `${user.id}_${Date.now()}.${avatar.subtype}`

        try {
            await avatar.move(Helpers.tmpPath(`user_avatar`), {
                name: tmpAvatarName,
                overwrite: true
            })

            if (!avatar.moved()) {
                const { type: errorType } = avatar.error()

                if (errorType == 'size') {
                    return response.status(400).send({
                        success: false,
                        error: antl.formatMessage('auth.avatar_max_size', {
                            size: '20mb'
                        })
                    })
                }
            }
        } catch (error) {
            return response.status(400).send()
        }

        const tmpAvatarPath = Helpers.tmpPath(`user_avatar/${tmpAvatarName}`)

        const trx = await Database.beginTransaction()

        try {
            if (user.avatar_id) {
                const oldAvatar = await Image.find(user.avatar_id, trx)
                await oldAvatar.delete(trx)
            }

            // processar avatar, precisa melhorar o resize para ser variavel e com regra de 3
        } catch (error) {
            // TODO
        }
    }

    async whoAmI({ response, auth }) {
        const user = await auth.getUser()
        return response.status(200).send(user)
    }
}

module.exports = AuthController
