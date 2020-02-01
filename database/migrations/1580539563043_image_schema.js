'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImageSchema extends Schema {
    up() {
        this.create('images', table => {
            table.increments()
            table.string('filename', 80).notNullable()
            table.string('ext', 20).notNullable()

            table.integer('image_type_id').unsigned()
            table
                .foreign('image_type_id')
                .references('id')
                .inTable('image_types')
                .onDelete('cascade')

            table.timestamps()
        })
    }

    down() {
        this.drop('images')
    }
}

module.exports = ImageSchema
