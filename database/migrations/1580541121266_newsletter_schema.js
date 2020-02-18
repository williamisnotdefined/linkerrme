'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NewsletterSchema extends Schema {
    up() {
        this.create('newsletters', table => {
            table.increments()
            table.string('email', 255).notNullable()

            table.integer('page_id').unsigned()
            table
                .foreign('page_id')
                .references('id')
                .inTable('pages')
                .onDelete('set null')

            table.integer('link_id').unsigned()
            table
                .foreign('link_id')
                .references('id')
                .inTable('links')
                .onDelete('set null')

            table.integer('user_id').unsigned()
            table
                .foreign('user_id')
                .references('id')
                .inTable('users')
                .onDelete('cascade')

            table.timestamps()
        })
    }

    down() {
        this.drop('newsletters')
    }
}

module.exports = NewsletterSchema
