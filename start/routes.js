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

// const x = {
//     id: '117485462636513657386',
//     name: 'William Cozza Pereira',
//     email: 'williamcpereira89@gmail.com',
//     nickname: 'William Cozza Pereira',
//     avatar:
//         'https://lh3.googleusercontent.com/a-/AAuE7mBh-SdIeWC0CHGO9z1ZDHstbatt0suzXZSbZuPXLQ',
//     accessToken:
//         'ya29.Il-8Bwb9_hEWGdQ1lYz4uR0DD8cffcu81xncFUBCfqnN_HfqklQNt22QvF1RVxImz9uCquPT6cHi2ZRK5u6EHkNVcd3FFgkBCJt7GdjNnNPJPFIwwiGChRYNYn7_DyX69A',
//     tokenSecret: null,
//     expires: 3599
// }
