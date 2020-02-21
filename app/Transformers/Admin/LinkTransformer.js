'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

const ImageTransformer = use('App/Transformers/Admin/ImageTransformer')

/**
 * LinkTransformer class
 *
 * @class LinkTransformer
 * @constructor
 */
class LinkTransformer extends BumblebeeTransformer {
    static get defaultInclude() {
        return ['image']
    }

    includeImage(link) {
        return this.item(link.getRelated('image'), ImageTransformer)
    }

    transform(link) {
        const { id, text, url, is_newsletter, is_active, display_order } = link

        return {
            id,
            text,
            url,
            is_newsletter,
            is_active,
            display_order
        }
    }
}

module.exports = LinkTransformer
