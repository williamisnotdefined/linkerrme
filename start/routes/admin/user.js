'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.post('/update-avatar', 'UserController.updateUserAvatar').as(
        'user.update_avatar'
    )
})
    .prefix('v1/admin/user')
    .namespace('Admin')
    .middleware(['auth:jwt', 'is:(admin or user)'])
