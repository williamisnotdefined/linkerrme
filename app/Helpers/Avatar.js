'use strict'

const Axios = use('axios')
const Sharp = use('sharp')
const FileType = use('file-type')

const { moveAvatarToS3, getImageHash } = use('App/Helpers/Image')

Sharp.cache({ files: 0 })
const MAX_SIZE_AVATAR = 200

const uploadGoogleAvatarToS3 = async avatar => {
    if (avatar) {
        const { status, data: avatarFile } = await Axios({
            url: avatar,
            method: 'GET',
            responseType: 'arraybuffer'
        })

        if (status == 200) {
            const { ext, mime } = await FileType.fromBuffer(avatarFile)

            const fileProcessed = await resizeAvatar(avatarFile)

            const filename = await getImageHash(fileProcessed)

            await moveAvatarToS3(fileProcessed, filename, ext, mime)

            return {
                filename,
                ext
            }
        }
    }
}

const resizeAvatar = async avatar => {
    const { width, height } = await Sharp(avatar).metadata()
    const isVertical = width > height

    let imageWidth = 0
    let imageHeight = 0

    // quero que o menor lado seja MAX_SIZE_AVATAR
    if (isVertical) {
        imageHeight = MAX_SIZE_AVATAR
        imageWidth = Math.floor((imageHeight * width) / height)
    } else {
        imageWidth = MAX_SIZE_AVATAR
        imageHeight = Math.floor((imageWidth * height) / width)
    }

    const resizedImage = await Sharp(avatar, {
        fit: Sharp.fit.inside
    })
        .resize(imageWidth, imageHeight)
        .toBuffer()

    return resizedImage
}

const processAvatarAndUploadToS3 = async tmpPath => {
    const { ext, mime } = await FileType.fromFile(tmpPath)

    const fileProcessed = await resizeAvatar(tmpPath)
    const filename = await getImageHash(fileProcessed)

    await moveAvatarToS3(fileProcessed, filename, ext, mime)

    return {
        filename,
        ext
    }
}

module.exports = {
    uploadGoogleAvatarToS3,
    processAvatarAndUploadToS3
}
