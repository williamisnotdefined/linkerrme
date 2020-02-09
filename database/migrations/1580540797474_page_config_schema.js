'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PageConfigSchema extends Schema {
    up() {
        this.create('page_configs', table => {
            table.increments()

            table.integer('page_id').unsigned()
            table
                .foreign('page_id')
                .references('id')
                .inTable('pages')

            table.string('attr', 250).notNullable()
            table.string('value', 250)

            table.timestamps()
        })
    }

    down() {
        this.drop('page_configs')
    }
}

module.exports = PageConfigSchema
