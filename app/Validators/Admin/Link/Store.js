'use strict'

const Antl = use('Antl')

class AdminLinkStore {
    get rules() {
        return {
            text: 'required',
            page_id: 'required|exists:pages,id'
        }
    }

    get messages() {
        return {
            'name.required': Antl.formatMessage('link.text_required'),
            'page_id.required': Antl.formatMessage('link.page_required'),
            'page_id.exists': Antl.formatMessage('link.page_not_found')
        }
    }
}

module.exports = AdminLinkStore
