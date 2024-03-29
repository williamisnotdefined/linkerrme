'use strict'

const Page = use('App/Models/Page')
const Link = use('App/Models/Link')

const {
    ImageTypes,
    deleteImageBackgroundFromS3,
    deleteAvatarFromS3,
    deleteThumbLinkFromS3
} = use('App/Helpers/Image')

const ImageHook = (exports = module.exports = {})

ImageHook.deleteS3Image = async image => {
    /**
     * Existem 3 relacionamentos com imagem:
     * Avatar do usuário | s3 path: (avatar/${user_id}.ext)
     * ImageBackground da página | s3 path: (pages/${userId}/${pageId}/${imageName})
     * Thumb dos links | s3 path: (pages/${userId}/${pageId}/links/${imageName})
     */

    if (image.image_type_id == ImageTypes.PageBackground) {
        const page = await Page.findBy('image_background_id', image.id)

        await deleteImageBackgroundFromS3(
            page.user_id,
            page.id,
            `${image.filename}.${image.ext}`
        )
    } else if (image.image_type_id == ImageTypes.UserAvatar) {
        await deleteAvatarFromS3(`${image.filename}.${image.ext}`)
    } else if (image.image_type_id == ImageTypes.LinkThumb) {
        const link = await Link.findBy({ image_id: image.id })
        const page = await Page.find(link.page_id)

        await deleteThumbLinkFromS3(
            page.user_id,
            page.id,
            `${image.filename}.${image.ext}`
        )
    }
}
