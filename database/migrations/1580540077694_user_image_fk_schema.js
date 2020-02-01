'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserImageFkSchema extends Schema {
    up() {
        this.table('users', table => {
            // alter table
            table
                .foreign('avatar_id')
                .references('id')
                .inTable('images')
                .onDelete('cascade')
        })
    }

    down() {
        this.table('users', table => {
            table.dropForeign('avatar_id')
        })
    }
}

module.exports = UserImageFkSchema
