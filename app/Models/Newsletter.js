'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Newsletter extends Model {
    static boot() {
        super.boot()
    }

    pages() {
        return this.belongsTo('App/Models/Page')
    }

    links() {
        return this.belongsTo('App/Models/Links')
    }
}

module.exports = Newsletter
