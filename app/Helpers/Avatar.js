'use strict'

const Helpers = use('Helpers')

const Axios = use('axios')
const Sharp = use('sharp')
const FileType = use('file-type')

const { moveTmpAvatarToS3 } = use('App/Helpers/Image')

const uploadGoogleAvatarToS3 = async (userId, avatar) => {
    if (avatar) {
        const { status, data: avatarFile } = await Axios({
            url: avatar,
            method: 'GET',
            responseType: 'arraybuffer'
        })

        if (status == 200) {
            const { ext, mime } = await FileType.fromBuffer(avatarFile)

            const tmpPath = `${Helpers.tmpPath(
                '/avatar'
            )}/avatar-${userId}-${Date.now()}.${ext}`

            await Sharp(avatarFile)
                .resize(200, 200)
                .toFile(tmpPath)

            await moveTmpAvatarToS3(tmpPath, userId, ext, mime)

            return {
                filename: userId,
                ext
            }
        }
    }
}

module.exports = {
    uploadGoogleAvatarToS3
}
