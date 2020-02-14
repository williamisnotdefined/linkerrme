'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/User', faker => {
    return {
        name: faker.username(),
        email: faker.email({ domain: 'faker.com' }),
        password: '123456'
    }
})

Factory.blueprint('App/Models/Page', (faker, i, data) => {
    return {
        name: faker.animal(),
        slug: `seed-slug-user-${data.user_id}`,
        user_id: data.user_id,
        template_id: data.template_id
    }
})

Factory.blueprint('App/Models/Link', (faker, i, data) => {
    return {
        text: faker.username(),
        url: faker.url(),
        page_id: data.page_id,
        display_order: i
    }
})

Factory.blueprint('App/Models/PageSocialLink', (faker, i, data) => {
    return {
        url: faker.url(),
        social_link_id: data.social_link_id,
        page_id: data.page_id
    }
})
