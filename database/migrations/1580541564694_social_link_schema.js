'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SocialLinkSchema extends Schema {
    up() {
        this.create('social_links', table => {
            table.increments()
            table.string('name', 150).notNullable()
            table.timestamps()
        })
    }

    down() {
        this.drop('social_links')
    }
}

module.exports = SocialLinkSchema
