'use strict'

const Sharp = use('sharp')
const FileType = use('file-type')

const { moveThumbLinkToS3, getImageHash } = use('App/Helpers/Image')

const MAX_SIZE_PAGE_IMAGE_BACKGROUND = 200
Sharp.cache({ files: 0 })

const processThumbLinkAndUploadToS3 = async (userId, pageId, tmpPath) => {
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

    const filename = await getImageHash(resizedImage)

    await moveThumbLinkToS3(
        resizedImage,
        userId,
        pageId,
        `${filename}.${ext}`,
        mime
    )

    return {
        ext,
        filename
    }
}

module.exports = {
    processThumbLinkAndUploadToS3
}
