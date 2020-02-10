'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Image extends Model {
    static boot() {
        super.boot()

        this.addHook('beforeDelete', 'ImageHook.deleteS3Image')
    }

    imageType() {
        return this.belongsTo('App/Models/ImageType', 'image_type_id', 'id')
    }
}

module.exports = Image
