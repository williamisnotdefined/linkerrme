'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * SocialLinkTransformer class
 *
 * @class SocialLinkTransformer
 * @constructor
 */
class SocialLinkTransformer extends BumblebeeTransformer {
    transform(socialLink) {
        const { id, name } = socialLink
        return {
            id,
            name
        }
    }
}

module.exports = SocialLinkTransformer
