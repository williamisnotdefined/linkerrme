'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Link extends Model {
    static boot() {
        super.boot()
    }

    pages() {
        return this.belongsTo('App/Models/Page')
    }

    images() {
        return this.hasOne('App/Models/Image')
    }
}

module.exports = Link
