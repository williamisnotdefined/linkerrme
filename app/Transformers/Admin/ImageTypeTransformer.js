'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ImageTypeTransformer class
 *
 * @class ImageTypeTransformer
 * @constructor
 */
class ImageTypeTransformer extends BumblebeeTransformer {
    /**
     * This method is used to transform the data.
     */
    transform(imageType) {
        const { id, name } = imageType

        return {
            id,
            name
        }
    }
}

module.exports = ImageTypeTransformer
