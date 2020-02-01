'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PageSocialLinkSchema extends Schema {
    up() {
        this.create('page_social_links', table => {
            table.increments()

            table
                .integer('social_link_id')
                .notNullable()
                .unsigned()
            table
                .foreign('social_link_id')
                .references('id')
                .inTable('social_links')
                .onDelete('cascade')

            table
                .integer('page_id')
                .notNullable()
                .unsigned()
            table
                .foreign('page_id')
                .references('id')
                .inTable('pages')
                .onDelete('cascade')

            table.string('url', 250).notNullable()
            table.timestamps()
        })
    }

    down() {
        this.drop('page_social_links')
    }
}

module.exports = PageSocialLinkSchema
