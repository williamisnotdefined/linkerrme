'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    // TODO

    Route.post(
        '/page/upload-image-background/:id',
        'PageController.uploadImageBackground'
    )

    Route.resource('page', 'PageController')
        .apiOnly()
        .validator(
            new Map([
                ['page.store', 'Admin/Page/Store'],
                ['page.update', 'Admin/Page/Update']
            ])
        )
})
    .prefix('v1/admin')
    .namespace('Admin')
    .middleware(['auth:jwt', 'is:(admin or user)'])
