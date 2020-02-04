'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * TemplateTransformer class
 *
 * @class TemplateTransformer
 * @constructor
 */
class TemplateTransformer extends BumblebeeTransformer {
    transform(template) {
        const { id, name } = template

        return {
            id,
            name
        }
    }
}

module.exports = TemplateTransformer
