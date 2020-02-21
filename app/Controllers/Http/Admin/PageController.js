'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const fs = use('fs')
const Helpers = use('Helpers')
const Database = use('Database')

const Page = use('App/Models/Page')
const PageSocialLink = use('App/Models/PageSocialLink')
const Image = use('App/Models/Image')
const ImageType = use('App/Models/ImageType')

const PageTransformer = use('App/Transformers/Admin/PageTransformer')
const PageSocialLinkTransformer = use(
    'App/Transformers/Admin/PageSocialLinkTransformer'
)
const { generatePageSlug, processImageBackgroundAndUploadToS3 } = use(
    'App/Helpers/Page'
)

/**
 * Resourceful controller for interacting with pages
 */
class PageController {
    async index({ request, response, auth, paginate, transform, antl }) {
        try {
            const title = request.input('title')
            const user = await auth.getUser()

            const pageQuery = Page.query().where('user_id', user.id)

            if (title) {
                pageQuery.where('title', 'LIKE', `%${title}%`)
            }

            const pagesRaw = await pageQuery
                .orderBy('id', 'desc')
                .paginate(paginate.page, paginate.limit)

            const pages = await transform.paginate(pagesRaw, PageTransformer)

            return response.send({
                success: true,
                pages
            })
        } catch (error) {
            return response.status(500).send({
                success: false,
                error: antl.formatMessage('page.cant_list_pages')
            })
        }
    }

    async store({ request, response, auth, transform, antl }) {
        try {
            const name = request.input('name')
            const slug = await generatePageSlug(name)

            const user = await auth.getUser()

            const pageRaw = await Page.create({
                name,
                slug,
                template_id: 1,
                user_id: user.id
            })

            const page = await transform.item(pageRaw, PageTransformer)

            return response.status(201).send({
                success: true,
                page
            })
        } catch (error) {
            return response.status(500).send({
                success: false,
                error: antl.formatMessage('page.cant_create_page')
            })
        }
    }

    async show({ params: { id }, response, transform, auth }) {
        const user = await auth.getUser()
        const pageRaw = await Page.findByOrFail({
            id,
            user_id: user.id
        })

        const page = await transform.item(pageRaw, PageTransformer)

        return response.send({
            success: true,
            page
        })
    }

    async update({ params: { id }, request, response, auth, transform, antl }) {
        const user = await auth.getUser()
        const page = await Page.findByOrFail({
            id,
            user_id: user.id
        })

        const { name, slug, template_id } = request.only([
            'name',
            'slug',
            'template_id'
        ])

        try {
            const safe_slug = await generatePageSlug(slug, id)

            page.merge({
                name,
                slug: safe_slug,
                template_id
            })

            page.save()

            const updatedPage = await transform.item(page, PageTransformer)

            return response.status(200).send({
                success: true,
                updatedPage,
                message: antl.formatMessage('page.success_updated')
            })
        } catch (error) {
            return response.status(500).send({
                success: false,
                message: antl.formatMessage('page.fail_updated')
            })
        }
    }

    async destroy({ params: { id }, response, auth, antl }) {
        const user = await auth.getUser()
        const page = await Page.findByOrFail({
            id,
            user_id: user.id
        })

        const trx = await Database.beginTransaction()

        try {
            if (page.image_background_id) {
                const image = await Image.find(page.image_background_id, trx)
                await image.delete(trx)
            }

            await page.delete(trx)

            await trx.commit()

            return response.send({
                success: true,
                message: antl.formatMessage('page.page_deleted')
            })
        } catch (error) {
            await trx.rollback()

            return response.status(400).send({
                success: true,
                message: antl.formatMessage('page.fail_page_deleted')
            })
        }
    }

    async uploadImageBackground({
        params: { id },
        request,
        response,
        auth,
        antl
    }) {
        const user = await auth.getUser()
        const page = await Page.findByOrFail({
            id: id,
            user_id: user.id
        })

        const imageBackground = request.file('image_background', {
            types: ['image'], // garante que passe apenas arquivos do tipo imagem para a variavel imageBackground
            size: '20mb'
        })

        if (!imageBackground) {
            return response.status(400).send({
                success: false,
                error: antl.formatMessage('page.image_background_required')
            })
        }

        try {
            await imageBackground.move(
                Helpers.tmpPath(`page_image_background/${user.id}`),
                {
                    name: `${page.id}.${imageBackground.subtype}`,
                    overwrite: true
                }
            )

            if (!imageBackground.moved()) {
                const { type: errorType } = imageBackground.error()

                if (errorType == 'size') {
                    return response.status(400).send({
                        success: false,
                        error: antl.formatMessage(
                            'page.image_background_max_size',
                            { size: '20mb' }
                        )
                    })
                }
            }
        } catch (error) {
            return response.status(400).send({
                success: false,
                error: antl.formatMessage('page.image_background_fail')
            })
        }

        const tmpPath = Helpers.tmpPath(
            `page_image_background/${user.id}/${page.id}.${imageBackground.subtype}`
        )

        const trx = await Database.beginTransaction()

        try {
            if (page.image_background_id) {
                const oldImage = await Image.find(page.image_background_id, trx)
                await oldImage.delete(trx)
            }

            const { ext, filename } = await processImageBackgroundAndUploadToS3(
                user.id,
                page.id,
                tmpPath
            )

            const imageType = await ImageType.findBy(
                'name',
                'page_background',
                trx
            )

            const image = await Image.create(
                {
                    filename,
                    ext,
                    image_type_id: imageType.id
                },
                trx
            )

            page.image_background_id = image.id
            await page.save(trx)

            fs.unlinkSync(tmpPath)
            await trx.commit()

            return response.status(200).send({
                success: true,
                message: antl.formatMessage('page.image_background_saved')
            })
        } catch (error) {
            fs.unlinkSync(tmpPath)
            await trx.rollback()

            return response.status(500).send({
                success: false,
                error: antl.formatMessage('page.image_background_fail')
            })
        }
    }

    async deleteImageBackground({ params: { id }, response, auth, antl }) {
        const trx = await Database.beginTransaction()

        try {
            const user = await auth.getUser()
            const page = await Page.findByOrFail(
                {
                    id,
                    user_id: user.id
                },
                trx
            )

            // await page.image().delete(trx) // não chama o hook de deleção de imagem
            const image = await Image.find(page.image_background_id, trx)
            await image.delete(trx)

            await trx.commit()

            return response.status(200).send({
                success: true,
                message: antl.formatMessage('page.image_background_deleted')
            })
        } catch (error) {
            await trx.rollback()

            return response.status(400).send({
                success: false,
                error: antl.formatMessage('page.image_background_delete_fail')
            })
        }
    }

    async addSocialNetwork({
        params: { page_id },
        request,
        response,
        auth,
        transform,
        antl
    }) {
        const trx = await Database.beginTransaction()
        try {
            const user = await auth.getUser()
            const { url, social_link_id } = request.only([
                'url',
                'social_link_id'
            ])
            const page = await Page.findBy(
                { id: page_id, user_id: user.id },
                trx
            )

            if (!page) {
                return response.status(400).send({
                    success: false,
                    error: antl.formatMessage('page.page_not_found')
                })
            }

            await PageSocialLink.query()
                .transacting(trx)
                .where('page_id', page_id)
                .increment('display_order')

            const pageSocialLinkRaw = await page.pageSocialLink().create(
                {
                    url,
                    page_id,
                    social_link_id
                },
                trx
            )

            const pageSocialLink = await transform.item(
                pageSocialLinkRaw,
                PageSocialLinkTransformer
            )

            await trx.commit()

            return response.status(201).send({
                success: true,
                pageSocialLink
            })
        } catch (error) {
            await trx.rollback()

            return response.status(500).send({
                success: false,
                error: antl.formatMessage('page.cannt_create_social_link')
            })
        }
    }

    async editSocialNetwork({
        params: { page_id, page_social_id },
        request,
        response,
        auth,
        transform,
        antl
    }) {
        try {
            const user = await auth.getUser()
            const page = await Page.findBy({ id: page_id, user_id: user.id })

            if (!page) {
                return response.status(400).send({
                    success: false,
                    error: antl.formatMessage('page.page_not_found')
                })
            }

            const { url, social_link_id } = request.only([
                'url',
                'social_link_id'
            ])

            let pageSocialLink = await PageSocialLink.findBy({
                id: page_social_id,
                page_id
            })

            if (!pageSocialLink) {
                return response.status(400).send({
                    success: false,
                    error: antl.formatMessage(
                        'page.social_link_id_does_not_exists'
                    )
                })
            }

            pageSocialLink.merge({
                url,
                social_link_id
            })
            await pageSocialLink.save()

            pageSocialLink = await transform.item(
                pageSocialLink,
                PageSocialLinkTransformer
            )

            return response.send({
                success: true,
                pageSocialLink
            })
        } catch (error) {
            return response.status(500).send({
                success: false,
                error: antl.formatMessage('page.cannt_edit_social_link')
            })
        }
    }

    async deleteSocialNetwork({
        params: { page_id, page_social_id },
        response,
        auth,
        antl
    }) {
        try {
            const user = await auth.getUser()
            const page = await Page.findBy({ id: page_id, user_id: user.id })

            if (!page) {
                return response.status(400).send({
                    success: false,
                    error: antl.formatMessage('page.page_not_found')
                })
            }

            const pageSocialLink = await PageSocialLink.findBy({
                id: page_social_id,
                page_id
            })

            if (!pageSocialLink) {
                return response.status(400).send({
                    success: false,
                    error: antl.formatMessage(
                        'page.social_link_id_does_not_exists'
                    )
                })
            }

            await pageSocialLink.delete()

            return response.send({
                success: true,
                message: antl.formatMessage('page.page_social_link_deleted')
            })
        } catch (error) {
            return response.status(500).send({
                success: false,
                error: antl.formatMessage('page.cannt_delete_social_link')
            })
        }
    }

    async reorderSocialNetwork({
        params: { page_id },
        request,
        response,
        auth,
        transform,
        antl
    }) {
        const { ids } = request.only(['ids'])
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
                    error: antl.formatMessage('page.not_page_owner')
                })
            }

            let display_order = 0

            for (let id of ids) {
                await PageSocialLink.query(trx)
                    .where({ id, page_id })
                    .update({ display_order })

                display_order++
            }

            await trx.commit()

            const pageSocialLinksRaw = await PageSocialLink.query()
                .where('page_id', page_id)
                .orderBy('display_order')
                .fetch()

            const pageSocialLinks = await transform.collection(
                pageSocialLinksRaw,
                PageSocialLinkTransformer
            )

            return response.send({
                success: true,
                pageSocialLinks,
                message: antl.formatMessage('page.reordered_social_links')
            })
        } catch (error) {
            await trx.rollback()
            return response.status(500).send({
                success: false,
                error: antl.formatMessage('page.cannt_reorder_social_links')
            })
        }
    }
}

module.exports = PageController
