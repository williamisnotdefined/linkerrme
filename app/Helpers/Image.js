'use strict'

const fs = use('fs')
const Drive = use('Drive')

const moveTmpAvatarToS3 = async (tmpPath, userId, ext, mime) => {
    const fileStream = await fs.createReadStream(tmpPath)

    await Drive.put(`avatar/${userId}.${ext}`, fileStream, {
        ACL: 'public-read',
        ContentType: mime
    })

    fs.unlinkSync(tmpPath)
}

module.exports = {
    moveTmpAvatarToS3
}
