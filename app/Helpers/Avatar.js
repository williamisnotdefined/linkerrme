'use strict'

const Axios = use('axios')
const Sharp = use('sharp')
const FileType = use('file-type')

const { moveAvatarToS3, getImageHash } = use('App/Helpers/Image')
Sharp.cache({ files: 0 })

const uploadGoogleAvatarToS3 = async avatar => {
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

            const filename = await getImageHash(fileProcessed)

            await moveAvatarToS3(fileProcessed, filename, ext, mime)

            return {
                filename,
                ext
            }
        }
    }
}

module.exports = {
    uploadGoogleAvatarToS3
}
