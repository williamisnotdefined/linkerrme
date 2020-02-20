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
        const { id, url } = pageSocialLink

        return {
            id,
            url
        }
    }
}

module.exports = PageSocialLinkTransformer
