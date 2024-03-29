'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LinkSchema extends Schema {
    up() {
        this.create('links', table => {
            table.increments()

            table.string('text', 250).notNullable()
            table.string('url', 250)

            table
                .integer('page_id')
                .notNullable()
                .unsigned()
            table
                .foreign('page_id')
                .references('id')
                .inTable('pages')
                .onDelete('cascade')

            table.integer('image_id').unsigned()
            table
                .foreign('image_id')
                .references('id')
                .inTable('images')
                .onDelete('set null')

            table
                .boolean('is_newsletter')
                .notNullable()
                .defaultTo(false)
            table
                .boolean('is_active')
                .notNullable()
                .defaultTo(false)

            table.integer('display_order').notNullable()

            table.timestamps()
        })
    }

    down() {
        this.drop('links')
    }
}

module.exports = LinkSchema
