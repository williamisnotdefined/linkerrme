'use strict'

const UrlSlug = use('url-slug')

const Page = use('App/Models/Page')

const generatePageSlug = async (pageName, excludePage = null) => {
    const originalSlug = UrlSlug(pageName)
    let slug = originalSlug
    let counter = 2
    let createdSlug = false

    while (!createdSlug) {
        const pageQuery = Page.query().where('slug', slug)

        if (excludePage) {
            pageQuery.whereNot('id', excludePage)
        }

        const page = await pageQuery.first()

        if (page) {
            slug = `${originalSlug}-${counter}`
            counter++
        } else {
            createdSlug = true
        }
    }

    return slug
}

module.exports = {
    generatePageSlug
}
