// test.js
const { spec, request, stash } = require('pactum')
let token

request.setBaseUrl('http://lojaebac.ebaconline.art.br')

beforeEach(async () => {
    token = await spec()
        .post('/public/authUser')
        .withJson({
            "email": "admin@admin.com",
            "password": "admin123"
    })
        .returns('data.token')
})

describe('Suíte de testes para Categorias:', () => {

    it('Deve adicionar uma categoria', async () => {
        await spec()
            .post('/api/addCategory')
            .withJson({
                "authorization": token,
                "name": "Computador",
                "photo": "https://s.zst.com.br/cms-assets/2022/09/o-que-sao-computadores-all-in-one-corpo.webp"
            })
            .expectStatus(200)
            .stores('categoryId', 'data._id')
    })

    it('Deve editar uma categoria', async () => {
        const categoryId = stash.getDataStore().categoryId
        await spec()
            .put(`/api/editCategory/${categoryId}`)
            .withJson({
                "authorization": token,
                "name": "Computadores"
            })
            .expectStatus(200)
    })

    it('Deve deletar uma categoria', async () => {
        const categoryId = stash.getDataStore().categoryId
        await spec()
            .delete(`/api/deleteCategory/${categoryId}`)
            .withJson({
                "authorization": token
            })
            .expectStatus(200)
    })
})