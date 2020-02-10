'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ImageTypeTransformer = use('App/Transformers/Admin/ImageTypeTransformer')

/**
 * ImageTransformer class
 *
 * @class ImageTransformer
 * @constructor
 */
class ImageTransformer extends BumblebeeTransformer {
    static get defaultInclude() {
        return ['imageType']
    }

    includeImageType(page) {
        return this.item(page.getRelated('imageType'), ImageTypeTransformer)
    }

    transform(image) {
        const { id, filename, ext } = image

        return {
            id,
            filename,
            ext
        }
    }
}

module.exports = ImageTransformer
