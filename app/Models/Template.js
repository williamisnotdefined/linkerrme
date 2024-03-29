'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Template extends Model {
    static boot() {
        super.boot()
    }

    pages() {
        return this.belongsToMany('App/Models/Page')
    }
}

module.exports = Template
