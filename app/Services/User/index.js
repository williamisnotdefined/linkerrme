'use strict'

const User = use('App/Models/User')
const Role = use('Role')

const Image = use('App/Models/Image')
const ImageType = use('App/Models/ImageType')

const { uploadGoogleAvatarToS3 } = use('App/Helpers/Avatar')

class UserService {
    constructor(model, trx) {
        this.model = model
        this.trx = trx
    }

    static async findOrCreate(googleUser, trx) {
        const email = googleUser.getEmail()
        const name = googleUser.getName()

        let user = await User.findBy('email', email)

        if (!user) {
            user = await User.create(
                {
                    name,
                    email
                },
                trx
            )

            const userRole = await Role.findBy('slug', 'user')
            await user.roles().attach([userRole.id], null, trx)
        }

        if (!user.avatar_id) {
            const imageType = await ImageType.findBy('name', 'user_avatar')

            const { filename, ext } = await uploadGoogleAvatarToS3(
                user.id,
                googleUser.getAvatar()
            )

            const image = await Image.create(
                {
                    filename,
                    ext,
                    image_type_id: imageType.id
                },
                trx
            )

            user.avatar_id = image.id
            await user.save(trx)
        }

        return user
    }
}

module.exports = UserService
