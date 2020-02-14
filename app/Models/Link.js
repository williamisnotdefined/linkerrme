'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Link extends Model {
    static boot() {
        super.boot()
    }

    page() {
        return this.belongsTo('App/Models/Page', 'page_id', 'id')
    }

    image() {
        return this.belongsTo('App/Models/Image', 'image_id', 'id')
    }
}

module.exports = Link
