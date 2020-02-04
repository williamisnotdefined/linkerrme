'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.get('/google-url', 'AuthController.getGoogleUrl')
        .as('auth.google_url')
        .middleware(['guest'])
    //.validator('Auth/Register')

    Route.get('/authenticated/google', 'AuthController.authenticatedWithGoogle')
        .as('auth.authenticated_google')
        .middleware(['guest'])
    //.validator('Auth/Register')

    Route.get('/who-am-i', 'AuthController.whoAmI')
        .as('auth.who_am_i')
        .middleware(['auth'])

    /*
	// ROUTES TODO
	Route.post('logout', 'AuthController.logout')
		.as('auth.logout')
		.middleware(['auth'])

	Route.post('refresh', 'AuthController.refresh')
		.as('auth.refresh')
		.middleware(['guest'])

	Route.post('reset-password', 'AuthController.forgot')
		.as('auth.forgot')
		.middleware(['guest'])

	Route.get('reset-password', 'AuthController.remember')
		.as('auth.remember')
		.middleware(['guest'])

	Route.put('reset-password', 'AuthController.reset')
		.as('auth.reset')
		.middleware(['guest'])*/
})
    .prefix('v1/auth')
    .namespace('Auth')
