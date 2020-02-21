'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.post(
        '/page/upload-image-background/:id',
        'PageController.uploadImageBackground'
    )

    Route.delete(
        '/page/delete-image-background/:id',
        'PageController.deleteImageBackground'
    )

    Route.post(
        '/page/:page_id/add-social-network',
        'PageController.addSocialNetwork'
    ).validator('Admin/Page/SocialLink')

    Route.put(
        '/page/:page_id/edit-social-network/:page_social_id',
        'PageController.editSocialNetwork'
    ).validator('Admin/Page/SocialLink')

    Route.delete(
        '/page/:page_id/delete-social-network/:page_social_id',
        'PageController.deleteSocialNetwork'
    )

    Route.put(
        '/page/:page_id/reorder-social-network',
        'PageController.reorderSocialNetwork'
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
