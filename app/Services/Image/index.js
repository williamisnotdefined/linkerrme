'use strict'

const fs = use('fs')

const Helpers = use('Helpers')
const Drive = use('Drive')

const Axios = use('axios')
const Sharp = use('sharp')
const FileType = use('file-type')

class ImageService {
    async uploadGoogleAvatarToS3(userId, avatar) {
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

                await this.moveTmpAvatarToS3(tmpPath, userId, ext, mime)

                return {
                    filename: userId,
                    ext
                }
            }
        }
    }

    async moveTmpAvatarToS3(tmpPath, userId, ext, mime) {
        const fileStream = await fs.createReadStream(tmpPath)

        await Drive.put(`avatar/${userId}.${ext}`, fileStream, {
            ACL: 'public-read',
            ContentType: mime
        })
    }
}

module.exports = ImageService
