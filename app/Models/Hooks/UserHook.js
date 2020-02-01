'use strict'

const Hash = use('Hash')
const UserHook = (exports = module.exports = {})

UserHook.hashPassword = async model => {
    user.password = await Hash.make(user.password)
}
