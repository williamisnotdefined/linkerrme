'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const socialLinkTransformer = use(
    'App/Transformers/Admin/SocialLinkTransformer'
)
/**
 * PageSocialLinkTransformer class
 *
 * @class PageSocialLinkTransformer
 * @constructor
 */
class PageSocialLinkTransformer extends BumblebeeTransformer {
    static get defaultInclude() {
        return ['socialLink']
    }

    includeSocialLink(pageSocialLink) {
        return this.item(
            pageSocialLink.getRelated('socialLink'),
            socialLinkTransformer
        )
    }

    transform(pageSocialLink) {
        const { id, url, display_order } = pageSocialLink

        return {
            id,
            url,
            display_order
        }
    }
}

module.exports = PageSocialLinkTransformer
