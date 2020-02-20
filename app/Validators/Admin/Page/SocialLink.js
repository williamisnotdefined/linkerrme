'use strict'

const Antl = use('Antl')

class AdminPageSocialLink {
    get rules() {
        return {
            url: 'required|url',
            social_link_id: 'required|exists:pages,id'
        }
    }

    get messages() {
        return {
            'url.required': Antl.formatMessage('page.url_social_link_required'),
            'url.url': Antl.formatMessage('page.url_social_link_url_invalid'),
            'social_link_id.required': Antl.formatMessage(
                'page.social_link_id_required'
            ),
            'social_link_id.exists': Antl.formatMessage(
                'page.social_link_id_does_not_exists'
            )
        }
    }
}

module.exports = AdminPageSocialLink
