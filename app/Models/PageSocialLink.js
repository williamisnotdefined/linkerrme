'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PageSocialLink extends Model {
    static boot() {
        super.boot()
    }

    pages() {
        return this.belongsTo('App/Models/Page')
    }
}

module.exports = PageSocialLink
