'use strict'

const Page = use('App/Models/Page')

const { ImageTypes, deleteImageBackgroundFromS3 } = use('App/Helpers/Image')

const ImageHook = (exports = module.exports = {})

ImageHook.deleteS3Image = async image => {
    /**
     * Existem 3 relacionamentos com imagem:
     * Avatar do usuário | s3 path: (avatar/${user_id}.ext)
     * ImageBackground da página | s3 path: (pages/${userId}/${pageId}/${imageName})
     * Thumb dos links - TODO
     */
    // console.log(image.toJSON())
    if (image.image_type_id == ImageTypes.PageBackground) {
        // userId, pageId, imageName
        const page = await Page.findBy('image_background_id', image.id)

        await deleteImageBackgroundFromS3(
            page.user_id,
            page.id,
            `${image.filename}.${image.ext}`
        )
    } else if (image.image_type_id == ImageTypes.UserAvatar) {
    }
}
