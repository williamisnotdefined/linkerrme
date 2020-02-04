'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    // TODO
    Route.resource('page', 'PageController').apiOnly()
})
    .prefix('v1/admin')
    .namespace('Admin')
    .middleware(['auth:jwt', 'is:(admin or user)'])
