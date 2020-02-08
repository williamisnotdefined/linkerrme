'use strict'

const Helpers = use('Helpers')

const Axios = use('axios')
const Sharp = use('sharp')
const FileType = use('file-type')

const { moveAvatarToS3 } = use('App/Helpers/Image')

const uploadGoogleAvatarToS3 = async (userId, avatar) => {
    if (avatar) {
        const { status, data: avatarFile } = await Axios({
            url: avatar,
            method: 'GET',
            responseType: 'arraybuffer'
        })

        if (status == 200) {
            const { ext, mime } = await FileType.fromBuffer(avatarFile)

            const fileProcessed = await Sharp(avatarFile, {
                fit: Sharp.fit.inside
            })
                .resize(200, 200)
                .toBuffer()

            await moveAvatarToS3(fileProcessed, userId, ext, mime)

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
