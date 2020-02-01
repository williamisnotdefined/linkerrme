'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
    up() {
        this.createIfNotExists('users', table => {
            table.increments()
            table.string('name', 80).notNullable()
            table
                .string('email', 254)
                .notNullable()
                .unique()
            // table.string('password', 60).notNullable()
            table.integer('avatar_id').unsigned()

            table.timestamps()
        })
    }

    down() {
        this.dropIfExists('users')
    }
}

module.exports = UserSchema
