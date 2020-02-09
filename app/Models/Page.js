'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Page extends Model {
    static boot() {
        super.boot()
    }

    image() {
        return this.belongsTo('App/Models/Image', 'image_background_id', 'id')
    }

    user() {
        return this.hasOne('App/Models/User')
    }

    template() {
        return this.hasOne('App/Models/Template', 'template_id', 'id')
    }
}

module.exports = Page
