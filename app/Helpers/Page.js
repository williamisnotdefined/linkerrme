'use strict'

const UrlSlug = use('url-slug')
const Sharp = use('sharp')
const FileType = use('file-type')

const Helpers = use('Helpers')

const Page = use('App/Models/Page')
const { moveImageBackgroundToS3 } = use('App/Helpers/Image')

const MAX_SIZE_PAGE_IMAGE_BACKGROUND = 2560

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

const processImageBackgroundAndUploadToS3 = async (userId, pageId, tmpPath) => {
    const { ext, mime } = await FileType.fromFile(tmpPath)

    const { width, height } = await Sharp(tmpPath).metadata()
    const isVertical = width > height

    let imageWidth = 0
    let imageHeight = 0
    if (isVertical) {
        imageWidth = Math.min(width, MAX_SIZE_PAGE_IMAGE_BACKGROUND)
        imageHeight = Math.floor((imageWidth * height) / width)
    } else {
        imageHeight = Math.min(height, MAX_SIZE_PAGE_IMAGE_BACKGROUND)
        imageWidth = Math.floor((imageHeight * width) / height)
    }

    const resizedImage = await Sharp(tmpPath, {
        fit: Sharp.fit.inside
    })
        .resize(imageWidth, imageHeight)
        .toBuffer()

    const name = `bg`

    await moveImageBackgroundToS3(
        resizedImage,
        userId,
        pageId,
        `${name}.${ext}`,
        mime
    )

    return {
        ext,
        name
    }
}

module.exports = {
    generatePageSlug,
    processImageBackgroundAndUploadToS3
}
