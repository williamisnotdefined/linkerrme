'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SocialLink extends Model {
    static boot() {
        super.boot()
    }

    pagesSocialLink() {
        return this.belongsToMany('App/Models/PageSocialLink')
    }
}

module.exports = SocialLink
