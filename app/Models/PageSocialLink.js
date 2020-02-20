'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PageSocialLink extends Model {
    static boot() {
        super.boot()
    }

    socialLink() {
        return this.hasOne('App/Models/SocialLink', 'social_link_id', 'id')
    }
}

module.exports = PageSocialLink
