'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Image extends Model {
    static boot() {
        super.boot()
    }
    // static get computed() {
    //     return ['url']
    // }
    // getUrl({ path }) {
    //     return `${Env.get('APP_URL')}/uploads/${path}`
    // }
}

module.exports = Image