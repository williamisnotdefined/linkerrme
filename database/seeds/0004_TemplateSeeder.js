'use strict'

/*
|--------------------------------------------------------------------------
| TemplateSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */

const Template = use('App/Models/Template')

class TemplateSeeder {
    async run() {
        await Template.create({
            name: 'Template 1'
        })

        await Template.create({
            name: 'Template 2'
        })
    }
}

module.exports = TemplateSeeder
