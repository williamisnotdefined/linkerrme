'use strict'

const Antl = use('Antl')

class AdminPageUpdate {
    get rules() {
        return {
            name: 'required',
            slug: 'required',
            template_id: 'required|exists:templates,id'
        }
    }

    get messages() {
        return {
            'name.required': Antl.formatMessage('page.name_required'),
            'slug.required': Antl.formatMessage('page.slug_required'),
            'template_id.required': Antl.formatMessage(
                'page.template_required'
            ),
            'template_id.exists': Antl.formatMessage('page.template_not_found')
        }
    }
}

module.exports = AdminPageUpdate
