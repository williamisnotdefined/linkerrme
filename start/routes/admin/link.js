'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.get('/link/:page_id', 'LinkController.listLinkByPages')

    Route.post('/link/:page_id/save-thumb', 'LinkController.saveThumb')

    Route.delete('/link/:page_id/delete-thumb', 'LinkController.deleteThumb')

    Route.resource('link', 'LinkController')
        .apiOnly()
        .except(['index', 'show'])
        .validator(
            new Map([
                ['link.store', 'Admin/Link/Store']
                // ['page.update', 'Admin/Page/Update']
            ])
        )
})
    .prefix('v1/admin')
    .namespace('Admin')
    .middleware(['auth:jwt', 'is:(admin or user)'])
