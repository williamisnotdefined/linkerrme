'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Page extends Model {
    static boot() {
        super.boot()
    }

    images() {
        return this.hasOne('App/Models/Image', 'image_background_id', 'id')
    }

    users() {
        return this.hasOne('App/Models/User')
    }
}

module.exports = Page
