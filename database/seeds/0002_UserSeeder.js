'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class UserSeeder {
    async run() {
        const userRole = await Role.findBy('slug', 'user')
        const users = await Factory.model('App/Models/User').createMany(20)

        await Promise.all(
            // adiciona para cada usuário criado a Role de 'client' (isso é um relacionamento)
            users.map(
                async client => await client.roles().attach([userRole.id])
            )
        )

        const admUser = await User.create({
            name: 'William Pereira',
            email: 'william@faker.com',
            password: '123456'
        })

        const adminRole = await Role.findBy('slug', 'admin')

        await admUser.roles().attach([adminRole.id]) // // adiciona para o usuário William Pereira a Role de 'admin' (isso é um relacionamento)
    }
}

module.exports = UserSeeder
