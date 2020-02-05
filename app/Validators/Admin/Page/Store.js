'use strict'

const Antl = use('Antl')

class AdminPageStore {
    get rules() {
        return {
            name: 'required'
        }
    }

    get messages() {
        return {
            'name.required': Antl.formatMessage('page.name_required')
        }
    }

    // get validateAll() {
    //     return true
    // }
}

module.exports = AdminPageStore
