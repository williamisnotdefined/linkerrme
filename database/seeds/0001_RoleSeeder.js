'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Role = use('Role')

class RoleSeeder {
    async run() {
        // Role admin
        await Role.create({
            name: 'Admin',
            slug: 'admin',
            description: 'Admin'
        })

        // Cria o cargo de cliente
        await Role.create({
            name: 'User',
            slug: 'user',
            description: 'user'
        })
    }
}

module.exports = RoleSeeder
