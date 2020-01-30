'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
    const x = 1
    return { greeting: 'Hello world in JSON' }
})

Route.get('/google', async ({ response, ally }) => {
    const url = await ally.driver('google').getRedirectUrl()
    // await ally.driver('google').redirect()
    return response.status(200).send({
        url
    })
})

Route.get('/authenticated/google', async ({ response, ally }) => {
    const googleUser = await ally.driver('google').getUser()

    return response.status(200).send({
        user: googleUser
    })
    // await ally.driver('google').redirect()
})
