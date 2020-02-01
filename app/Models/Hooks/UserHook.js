'use strict'

const Hash = use('Hash')
const UserHook = (exports = module.exports = {})

UserHook.hashPassword = async user => {
    if (user.dirty.password) {
        user.password = await Hash.make(user.dirty.password)
    }
}
