'use strict'

/*
|--------------------------------------------------------------------------
| SocialLinkSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const SocialLink = use('App/Models/SocialLink')

class SocialLinkSeeder {
    async run() {
        await SocialLink.create({
            name: 'facebook'
        })

        await SocialLink.create({
            name: 'instagram'
        })

        await SocialLink.create({
            name: 'youtube'
        })
    }
}

module.exports = SocialLinkSeeder
