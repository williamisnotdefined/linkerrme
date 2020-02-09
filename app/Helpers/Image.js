'use strict'

const Drive = use('Drive')

const moveAvatarToS3 = async (fileProcessed, userId, ext, mime) => {
    await Drive.put(`avatar/${userId}.${ext}`, fileProcessed, {
        ACL: 'public-read',
        ContentType: mime,
        CacheControl: 'max-age=31536000, public'
    })
}

const moveImageBackgroundToS3 = async (
    fileProcessed,
    userId,
    pageId,
    imageName,
    mime
) => {
    // o path pode ser /pages/USER_ID/PAGE_ID.EXT
    //`page_image_background/${user.id}/${page.id}.${imageBackground.subtype}`
    await Drive.put(`pages/${userId}/${pageId}/${imageName}`, fileProcessed, {
        ACL: 'public-read',
        ContentType: mime,
        CacheControl: 'max-age=31536000, public'
    })
}

module.exports = {
    moveAvatarToS3,
    moveImageBackgroundToS3
}
