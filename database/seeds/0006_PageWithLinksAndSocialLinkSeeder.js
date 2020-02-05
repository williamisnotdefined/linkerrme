'use strict'

/*
|--------------------------------------------------------------------------
| PageWithLinksAndSocialLinkSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const User = use('App/Models/User')
const Template = use('App/Models/Template')
const SocialLink = use('App/Models/SocialLink')

class PageWithLinksAndSocialLinkSeeder {
    async run() {
        const usersRaw = await User.all()
        const users = usersRaw.toJSON()
        const templateRaw = await Template.first()
        const template = templateRaw.toJSON()

        const facebookSocialLinkRaw = await SocialLink.findBy(
            'name',
            'facebook'
        )
        const facebookSocialLink = facebookSocialLinkRaw.toJSON()

        const instagramSocialLinkRaw = await SocialLink.findBy(
            'name',
            'instagram'
        )
        const instagramSocialLink = instagramSocialLinkRaw.toJSON()

        const youtubeSocialLinkRaw = await SocialLink.findBy('name', 'youtube')
        const youtubeSocialLink = youtubeSocialLinkRaw.toJSON()

        /**
         * Para cada user vou criar uma página com
         * 5 links com o primerio template (ele não importa nesta etapa)
         * 3 Social links
         */

        await Promise.all(
            users.map(async user => {
                const page = await Factory.model('App/Models/Page').create({
                    user_id: user.id,
                    template_id: template.id
                })

                await Factory.model('App/Models/Link').createMany(5, {
                    user_id: user.id,
                    page_id: page.id
                })

                await Factory.model('App/Models/PageSocialLink').create({
                    social_link_id: facebookSocialLink.id,
                    page_id: page.id
                })
                await Factory.model('App/Models/PageSocialLink').create({
                    social_link_id: instagramSocialLink.id,
                    page_id: page.id
                })
                await Factory.model('App/Models/PageSocialLink').create({
                    social_link_id: youtubeSocialLink.id,
                    page_id: page.id
                })
            })
        )
    }
}

module.exports = PageWithLinksAndSocialLinkSeeder
