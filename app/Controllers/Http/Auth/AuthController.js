'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

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

    async authenticatedWithGoogle({ response, ally, auth }) {
        const trx = await Database.beginTransaction()

        try {
            const googleUser = await ally.driver('google').getUser()

            const user = await UserService.findOrCreate(googleUser, trx)
            await trx.commit()

            const authData = await auth.withRefreshToken().generate(user)

            return response.status(200).send(authData)
        } catch (error) {
            await trx.rollback()

            return response.status(500).send({
                success: false,
                error: antl.formatMessage('auth.cant_register')
            })
        }
    }

    // async whoAmI({ request, response, auth }) {
    //     const user = await auth.getUser()
    //     return response.status(200).send(user)
    // }
}

module.exports = AuthController
