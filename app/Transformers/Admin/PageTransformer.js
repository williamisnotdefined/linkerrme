'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

const TemplateTransformer = use('App/Transformers/Admin/TemplateTransformer')
const ImageTransformer = use('App/Transformers/Admin/ImageTransformer')
const PageSocialLinkTransformer = use(
    'App/Transformers/Admin/PageSocialLinkTransformer'
)

/**
 * PageTransformer class
 *
 * @class PageTransformer
 * @constructor
 */
class PageTransformer extends BumblebeeTransformer {
    static get defaultInclude() {
        return ['template', 'image', 'pageSocialLink']
    }

    /* TODO AVAILABLE INCLUDES */

    includeTemplate(page) {
        return this.item(page.getRelated('template'), TemplateTransformer)
    }

    includeImage(page) {
        return this.item(page.getRelated('image'), ImageTransformer)
    }

    includePageSocialLink(page) {
        return this.collection(
            page.getRelated('pageSocialLink'),
            PageSocialLinkTransformer
        )
    }

    transform(page) {
        const { id, name, slug } = page

        return {
            id,
            name,
            slug
        }
    }
}

module.exports = PageTransformer
