'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PageSchema extends Schema {
    up() {
        this.create('pages', table => {
            table.increments()
            table
                .string('slug', 250)
                .notNullable()
                .unique()
                .index()

            table
                .integer('image_background_id')
                .unsigned()
                .index()
            table
                .foreign('image_background_id')
                .references('id')
                .inTable('images')
                .onDelete('cascade')

            table
                .integer('template_id')
                .notNullable()
                .index()
            table
                .foreign('template_id')
                .references('id')
                .inTable('templates')
                .onDelete('cascade')

            table
                .integer('user_id')
                .notNullable()
                .index()
            table
                .foreign('user_id')
                .references('id')
                .inTable('users')
                .onDelete('cascade')

            table.timestamps()
        })
    }

    down() {
        this.drop('pages')
    }
}

module.exports = PageSchema
