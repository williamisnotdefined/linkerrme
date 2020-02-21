'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const fs = use('fs')
const Helpers = use('Helpers')
const Database = use('Database')

const Link = use('App/Models/Link')
const Page = use('App/Models/Page')
const Image = use('App/Models/Image')
const ImageType = use('App/Models/ImageType')

const { processThumbLinkAndUploadToS3 } = use('App/Helpers/Link')

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
                    error: antl.formatMessage('link.not_page_owner')
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

    async store({ request, response, transform, antl, auth }) {
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
            const user = await auth.getUser()
            const page = await Page.query()
                .where({
                    id: page_id,
                    user_id: user.id
                })
                .first()

            if (!page) {
                return response.status(403).send({
                    success: false,
                    error: antl.formatMessage('link.not_page_owner')
                })
            }

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

    async update({ params: { id }, request, response, transform, antl, auth }) {
        const linkData = request.only([
            'text',
            'url',
            'is_newsletter',
            'is_active'
        ])
        const page_id = request.input('page_id')

        try {
            const user = await auth.getUser()
            const page = await Page.query()
                .where({
                    id: page_id,
                    user_id: user.id
                })
                .first()

            // verifica se o link que está sendo editado é de uma página que é do usuário logado
            if (!page) {
                return response.status(404).send({
                    success: false,
                    error: antl.formatMessage('link.not_page_owner')
                })
            }

            const linkRaw = await Link.query()
                .where({ id, page_id })
                .first()

            if (!linkRaw) {
                return response.status(404).send({
                    success: false,
                    error: antl.formatMessage('link.link_not_found')
                })
            }

            linkRaw.merge(linkData)
            await linkRaw.save()

            const link = await transform.item(linkRaw, LinkTransformer)

            return response.send({
                success: true,
                link
            })
        } catch (error) {
            return response.status(500).send({
                success: false,
                error: antl.formatMessage('link.fail_updated')
            })
        }
    }

    async reorder({
        params: { page_id },
        request,
        response,
        transform,
        antl,
        auth
    }) {
        const { ids } = request.only(['ids'])

        const trx = await Database.beginTransaction()

        try {
            const user = await auth.getUser()
            const page = await Page.query()
                .where({
                    id: page_id,
                    user_id: user.id
                })
                .first()

            // verifica se o link que está sendo editado é de uma página que é do usuário logado
            if (!page) {
                return response.status(404).send({
                    success: false,
                    error: antl.formatMessage('link.not_page_owner')
                })
            }

            let display_order = 0

            for (let id of ids) {
                await Link.query(trx)
                    .where({ id, page_id })
                    .update({ display_order })

                display_order++
            }

            await trx.commit()

            const linksRaw = await Link.query()
                .where('page_id', page.id)
                .orderBy('display_order')
                .fetch()

            const links = await transform.collection(linksRaw, LinkTransformer)

            return response.send({
                success: true,
                links,
                message: antl.formatMessage('link.success_reorder')
            })
        } catch (error) {
            await trx.rollback()
            return response.status(500).send({
                success: false,
                error: antl.formatMessage('link.fail_reorder')
            })
        }
    }

    async saveThumb({
        params: { page_id, link_id },
        request,
        response,
        auth,
        antl,
        transform
    }) {
        const user = await auth.getUser()
        const page = await Page.findBy({
            id: page_id,
            user_id: user.id
        })

        if (!page) {
            return response.status(404).send({
                success: false,
                error: antl.formatMessage('link.not_page_owner')
            })
        }

        const link = await Link.findBy({
            id: link_id,
            page_id
        })

        if (!link) {
            return response.status(404).send({
                success: false,
                error: antl.formatMessage('link.link_not_found')
            })
        }

        const thumb = request.file('link_thumb', {
            types: ['image'],
            size: '20mb'
        })

        if (!thumb) {
            return response.status(400).send({
                success: false,
                error: antl.formatMessage('link.thumb_required')
            })
        }

        const tmpLinkFileName = `${link_id}${Date.now()}.${thumb.subtype}`

        try {
            await thumb.move(Helpers.tmpPath(`link/${user.id}/${page_id}`), {
                name: tmpLinkFileName,
                overwrite: true
            })

            if (!thumb.moved()) {
                const { type: errorType } = thumb.error()

                if (errorType == 'size') {
                    return response.status(400).send({
                        success: false,
                        error: antl.formatMessage('link.thumb_max_size', {
                            size: '20mb'
                        })
                    })
                }
            }
        } catch (error) {
            return response.status(400).send({
                success: false,
                error: antl.formatMessage('link.thumb_fail')
            })
        }

        const tmpPath = Helpers.tmpPath(
            `link/${user.id}/${page_id}/${tmpLinkFileName}`
        )

        const trx = await Database.beginTransaction()

        try {
            if (link.image_id) {
                const oldThumb = await Image.find(link.image_id)
                await oldThumb.delete(trx)
            }

            const { ext, filename } = await processThumbLinkAndUploadToS3(
                user.id,
                page.id,
                tmpPath
            )

            const imageType = await ImageType.findBy('name', 'link_thumb', trx)

            const image = await Image.create(
                {
                    filename,
                    ext,
                    image_type_id: imageType.id
                },
                trx
            )

            link.image_id = image.id
            await link.save(trx)

            fs.unlinkSync(tmpPath)
            await trx.commit()

            const linkUpdated = await transform.item(link, LinkTransformer)

            return response.status(200).send({
                success: true,
                link: linkUpdated,
                message: antl.formatMessage('link.thumb_saved')
            })
        } catch (error) {
            fs.unlinkSync(tmpPath)
            await trx.rollback()

            return response.status(500).send({
                success: false,
                error: antl.formatMessage('link.thumb_fail')
            })
        }
    }

    async deleteThumb({ params: { page_id, link_id }, response, auth, antl }) {
        const trx = await Database.beginTransaction()

        try {
            const user = await auth.getUser()
            const page = await Page.findBy(
                {
                    id: page_id,
                    user_id: user.id
                },
                trx
            )

            if (!page) {
                return response.status(404).send({
                    success: false,
                    error: antl.formatMessage('link.not_page_owner')
                })
            }

            const link = await Link.findBy(
                {
                    id: link_id,
                    page_id
                },
                trx
            )

            if (!link) {
                return response.status(404).send({
                    success: false,
                    error: antl.formatMessage('link.link_not_found')
                })
            }

            const image = await Image.find(link.image_id, trx)

            if (!image) {
                return response.status(200).send({
                    success: true,
                    message: antl.formatMessage('link.thumb_deleted')
                })
            }

            await image.delete(trx)
            await trx.commit()

            return response.status(200).send({
                success: true,
                message: antl.formatMessage('link.thumb_deleted')
            })
        } catch (error) {
            await trx.rollback()

            return response.status(400).send({
                success: false,
                error: antl.formatMessage('link.thumb_delete_fail')
            })
        }
    }

    async destroy({ params: { page_id, link_id }, response, auth, antl }) {
        const trx = await Database.beginTransaction()

        try {
            const user = await auth.getUser()
            const page = await Page.findBy(
                {
                    id: page_id,
                    user_id: user.id
                },
                trx
            )

            if (!page) {
                return response.status(404).send({
                    success: false,
                    error: antl.formatMessage('link.not_page_owner')
                })
            }

            const link = await Link.findBy(
                {
                    id: link_id,
                    page_id
                },
                trx
            )

            if (!link) {
                return response.status(404).send({
                    success: false,
                    error: antl.formatMessage('link.link_not_found')
                })
            }

            if (link.image_id) {
                const image = await Image.find(link.image_id)
                await image.delete(trx)
            }

            await link.delete(trx)

            // reajustar os display_orders
            let display_order = 0
            const links = await Link.query(trx)
                .where({ page_id })
                .orderBy('display_order')
                .fetch()

            for (let _link of links.rows) {
                await Link.query(trx)
                    .where({ id: _link.id, page_id })
                    .update({ display_order })

                display_order++
            }

            await trx.commit()

            return response.send({
                success: true,
                error: antl.formatMessage('link.success_delete')
            })
        } catch (error) {
            await trx.rollback()

            return response.status(400).send({
                success: false,
                error: antl.formatMessage('link.fail_delete')
            })
        }
    }
}

module.exports = LinkController
