'use strict'
const { ImageTypes } = use('App/Helpers/Page')

const ImageHook = (exports = module.exports = {})

ImageHook.deleteS3Image = async image => {
    /**
     * Existem 3 relacionamentos com imagem:
     * Avatar do usuário | s3 path: (avatar/${user_id}.ext)
     * ImageBackground da página | s3 path: (pages/${userId}/${pageId}/${imageName})
     * Thumb dos links - TODO
     */
    console.log(image.toJSON())
}
