'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

const TemplateTransformer = use('App/Transformers/Admin/TemplateTransformer')

/**
 * PageTransformer class
 *
 * @class PageTransformer
 * @constructor
 */
class PageTransformer extends BumblebeeTransformer {
    static get defaultInclude() {
        return ['template']
    }

    /* TODO AVAILABLE INCLUDES */

    includeTemplate(page) {
        return this.item(page.getRelated('template'), TemplateTransformer)
    }

    transform(page) {
        const { slug, id } = page

        return {
            id,
            slug
        }
    }
}

module.exports = PageTransformer
