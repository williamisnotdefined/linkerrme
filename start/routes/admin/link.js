'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.get('/link/:page_id', 'LinkController.listLinkByPages')

    Route.post('/link/:page_id/:link_id/save-thumb', 'LinkController.saveThumb')

    Route.delete(
        '/link/:page_id/:link_id/delete-thumb',
        'LinkController.deleteThumb'
    )

    Route.delete(
        '/link/:page_id/:link_id/delete-link',
        'LinkController.destroy'
    )

    Route.post('/link/:page_id/reorder', 'LinkController.reorder')

    Route.resource('link', 'LinkController')
        .apiOnly()
        .except(['index', 'show', 'delete'])
        .validator(
            new Map([
                ['link.store', 'Admin/Link/Store'],
                ['page.update', 'Admin/Link/Update']
            ])
        )
})
    .prefix('v1/admin')
    .namespace('Admin')
    .middleware(['auth:jwt', 'is:(admin or user)'])
