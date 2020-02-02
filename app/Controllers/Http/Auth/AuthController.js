'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Helpers = use('Helpers')

const Axios = use('axios')
const Sharp = use('sharp')
const FileType = use('file-type')

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

    async authenticatedWithGoogle({ request, response, ally }) {
        let googleUser = null

        try {
            googleUser = await ally.driver('google').getUser()
        } catch (error) {
            return response.status(500).send({
                success: false,
                error: 'Cannt get properties from Google user'
            })
        }

        const avatar = googleUser.getAvatar()

        if (avatar) {
            const { status, data: avatarFile } = await Axios({
                url: avatar,
                method: 'GET',
                responseType: 'arraybuffer'
            })

            if (status == 200) {
                const { ext } = await FileType.fromBuffer(avatarFile)

                await Sharp(avatarFile)
                    .resize(200, 200)
                    .toFile(
                        `${Helpers.tmpPath(
                            '/avatar'
                        )}/avatar-${Date.now()}.${ext}`
                    )
            }
        }

        return response.status(200).send({
            user: googleUser
        })
    }
}

module.exports = AuthController
