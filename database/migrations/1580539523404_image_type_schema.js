'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImageTypeSchema extends Schema {
    up() {
        this.create('image_types', table => {
            table.increments()
            table.string('name', 50).notNullable()
            table.timestamps()
        })
    }

    down() {
        this.drop('image_types')
    }
}

module.exports = ImageTypeSchema
