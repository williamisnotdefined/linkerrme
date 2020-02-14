'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Link = use('App/Models/Link')
const Page = use('App/Models/Page')

const LinkTransformer = use('App/Transformers/Admin/LinkTransformer')

class LinkController {
    async listLinkByPages({
        params: { page_id },
        response,
        auth,
        paginate,
        transform,
        antl
    }) {
        try {
            const user = await auth.getUser()

            const page = await Page.query()
                .where({
                    id: page_id,
                    user_id: user.id
                })
                .first()

            if (!page) {
                return response.status(404).send({
                    success: false,
                    error: antl.formatMessage('link.page_not_found')
                })
            }

            const linksRaw = await Link.query()
                .where('page_id', page.id)
                .orderBy('id', 'display_order')
                .paginate(paginate.page, paginate.limit)

            const links = await transform.paginate(linksRaw, LinkTransformer)

            return response.send({
                success: true,
                links
            })
        } catch (error) {
            return response.status(500).send({
                success: false,
                error: antl.formatMessage('link.cant_list')
            })
        }
    }

    async store({ request, response }) {}

    async show({ params, request, response }) {}

    async update({ params, request, response }) {}

    async destroy({ params, request, response }) {}
}

module.exports = LinkController
