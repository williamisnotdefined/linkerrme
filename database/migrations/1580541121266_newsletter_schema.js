'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NewsletterSchema extends Schema {
    up() {
        this.create('newsletters', table => {
            table.increments()
            table.string('email', 255).notNullable()

            table
                .integer('page_id')
                .notNullable()
                .unsigned()
            table
                .foreign('page_id')
                .references('id')
                .inTable('pages')
                .onDelete('cascade')

            table
                .integer('link_id')
                .notNullable()
                .unsigned()
            table
                .foreign('link_id')
                .references('id')
                .inTable('links')
                .onDelete('cascade')

            table.timestamps()
        })
    }

    down() {
        this.drop('newsletters')
    }
}

module.exports = NewsletterSchema
