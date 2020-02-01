'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TemplateSchema extends Schema {
    up() {
        this.create('templates', table => {
            table.increments()
            table
                .string('name', 50)
                .unique()
                .notNullable()
            table.timestamps()
        })
    }

    down() {
        this.drop('templates')
    }
}

module.exports = TemplateSchema
