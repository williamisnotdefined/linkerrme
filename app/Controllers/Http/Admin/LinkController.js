'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

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

    async store({ request, response, transform, antl }) {
        const { text, url, is_newsletter, page_id } = request.only([
            'text',
            'url',
            'is_newsletter',
            'page_id'
        ])

        if (!url && !is_newsletter) {
            return response.status(400).send({
                success: false,
                message: antl.formatMessage('link.url_required')
            })
        }

        const trx = await Database.beginTransaction()

        try {
            await Link.query()
                .transacting(trx)
                .where('page_id', page_id)
                .increment('display_order')

            const linkRaw = await Link.create(
                {
                    text,
                    url,
                    is_newsletter,
                    page_id,
                    display_order: 0
                },
                trx
            )

            const link = await transform.item(linkRaw, LinkTransformer)

            await trx.commit()

            return response.status(201).send({
                success: true,
                link
            })
        } catch (error) {
            await trx.rollback()

            return response.status(500).send({
                success: false,
                error: antl.formatMessage('link.cant_create')
            })
        }
    }

    async update({ params, request, response }) {}

    async saveThumb({ params, request, response }) {}

    async deleteThumb({ params, request, response }) {}

    async destroy({ params, request, response }) {}
}

module.exports = LinkController
