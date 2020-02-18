# LinkerrMe

-   Google Login
-   Page Presets

## Ideas:

-   Social networks

*   Custom colors / Hover colors (same to all links)

    -   Text color
    -   Border color
    -   Social networks

## Future

-   Video background
-   Animate on show
-   Dark Mode / Light Mode
-   Sensitive content advice (BOTH) - Before show links - On try access
-   Google Fonts (optional)

## onDeploy

-   fix CORS on deploy

## dev todo list

https://www.draw.io/#G1916PRh68ICTHg4-kDiMqMhnlMwpypYf0
https://s3.console.aws.amazon.com/
https://console.developers.google.com/apis/credentials

-   atenção: rotas devem ter grupos admin / site (acho que site não precisa de grupo, só o admin)

-   Migrations - OK
-   Models / Hooks (needded?) - OK
-   Factories / Seeders - OK
-   Auth Login / Register - OK
-   Start i18n - OK
-   Helpers / Services (whenever necessary) - OK

-   Router / Controllers / Validators / Transformers / Middlewares
-   ExceptionHandler
-   error_log (email only) / email package

## To solve before live

-   Testar validators (validate all)

## tasks

-   CRUD de Links sociais (social_link_id, url, page_id) // verificar se os cascades estão funcionando
-   CRUD PageConfig (page_id, attr, value) -> page_id e attr podem ser unique! // na troca de template de page, deve ser resetado os PageConfig? melhor fazer junto com a interface
-   CRUD Newletter sendo populada apenas pelo site
-   error log
-   rotas dos site
-   cors

-   UserTransformer

## whishlist

-   melhorar as response dos controllers (status(XXX) ...)
-   Fazer o delete do usuário (e excluir tudo o que é relacionado a ele no banco e no S3)
-   Ver se não tem como fazer tipo o objects do python para não precisar passar user_id nas queries
