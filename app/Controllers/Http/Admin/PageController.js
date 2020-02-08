'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Page = use('App/Models/Page')

const { generatePageSlug } = use('App/Helpers/Page')

const PageTransformer = use('App/Transformers/Admin/PageTransformer')

/**
 * Resourceful controller for interacting with pages
 */
class PageController {
    /**
     * Show a list of all pages.
     * GET pages
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
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

    /**
     * Create/save a new page.
     * POST pages
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
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

    /**
     * Display a single page.
     * GET pages/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
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

    /**
     * Update page details.
     * PUT or PATCH pages/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
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

    /**
     * Delete a page with id.
     * DELETE pages/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params: { id }, response, auth, antl }) {
        const user = await auth.getUser()
        const page = await Page.findByOrFail({
            id,
            user_id: user.id
        })

        await page.delete()

        return response.send({
            success: true,
            message: antl.formatMessage('page.page_deleted')
        })
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

        const fileNames = []

        const validationOptions = {
            types: 'images',
            size: '1mb'
        }

        request.multipart.file(
            'image_background',
            validationOptions,
            async file => {
                // set file size from stream byteCount, so adonis can validate file size
                file.size = file.stream.byteCount
                await file.runValidations()

                const error = file.error()
                console.log('error: ', error)

                // https://adonisjs.com/docs/4.0/exceptions#_custom_exceptions
                // if (error.message) {
                //     throw new Error(error.message)
                // }
            }
        )

        await request.multipart.process()

        return response.status(200).send({
            fileNames
        })
    }
}

module.exports = PageController
