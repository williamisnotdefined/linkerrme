'use strict'

/*
|--------------------------------------------------------------------------
| ImageTypeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const ImageType = use('App/Models/ImageType')

class ImageTypeSeeder {
    async run() {
        await ImageType.create({
            name: 'page_background'
        })

        await ImageType.create({
            name: 'link_thumb'
        })

        await ImageType.create({
            name: 'user_avatar'
        })
    }
}

module.exports = ImageTypeSeeder
