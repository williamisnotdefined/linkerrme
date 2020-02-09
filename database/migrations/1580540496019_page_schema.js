'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PageSchema extends Schema {
    up() {
        this.create('pages', table => {
            table.increments()
            table.string('name', 250).notNullable()
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
                .onDelete('set null')

            table
                .integer('template_id')
                .unsigned()
                .index()
            table
                .foreign('template_id')
                .references('id')
                .inTable('templates')
                .onDelete('set null')

            table
                .integer('user_id')
                .unsigned()
                .notNullable()
                .index()
            table
                .foreign('user_id')
                .references('id')
                .inTable('users')

            table.timestamps()
        })
    }

    down() {
        this.drop('pages')
    }
}

module.exports = PageSchema
