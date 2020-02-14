'use strict'

const fs = use('fs')

const Database = use('Database')
const Helpers = use('Helpers')

const User = use('App/Models/User')
const Image = use('App/Models/Image')
const ImageType = use('App/Models/ImageType')

const { processAvatarAndUploadToS3 } = use('App/Helpers/Avatar')

class UserController {
    async updateUserAvatar({ request, response, auth, antl }) {
        const user = await auth.getUser()

        const avatar = request.file('avatar', {
            types: ['image'],
            size: '20mb'
        })

        if (!avatar) {
            return response.status(400).send({
                success: false,
                error: antl.formatMessage('user.avatar_required')
            })
        }

        const tmpAvatarName = `${user.id}_${Date.now()}.${avatar.subtype}`

        try {
            await avatar.move(Helpers.tmpPath(`user_avatar`), {
                name: tmpAvatarName,
                overwrite: true
            })

            if (!avatar.moved()) {
                const { type: errorType } = avatar.error()

                if (errorType == 'size') {
                    return response.status(400).send({
                        success: false,
                        error: antl.formatMessage('user.avatar_max_size', {
                            size: '20mb'
                        })
                    })
                }
            }
        } catch (error) {
            return response.status(400).send()
        }

        const tmpAvatarPath = Helpers.tmpPath(`user_avatar/${tmpAvatarName}`)

        const trx = await Database.beginTransaction()

        try {
            if (user.avatar_id) {
                const oldAvatar = await Image.find(user.avatar_id, trx)
                await oldAvatar.delete(trx)
            }

            const { ext, filename } = await processAvatarAndUploadToS3(
                tmpAvatarPath
            )

            const imageType = await ImageType.findBy('name', 'user_avatar', trx)

            const image = await Image.create(
                {
                    filename,
                    ext,
                    image_type_id: imageType.id
                },
                trx
            )

            const userDb = await User.find(user.id)
            userDb.avatar_id = image.id
            await userDb.save(trx)

            fs.unlinkSync(tmpAvatarPath)
            await trx.commit()

            return response.status(200).send({
                success: true,
                message: antl.formatMessage('user.avatar_saved')
            })
        } catch (error) {
            fs.unlinkSync(tmpAvatarPath)
            await trx.rollback()

            return response.status(500).send({
                success: false,
                error: antl.formatMessage('user.avatar_fail')
            })
        }
    }
}

module.exports = UserController
