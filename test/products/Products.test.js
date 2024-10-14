//test.js
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

describe('Suíte de testes para Produtos:', () => {

    it('Deve adicionar um produto', async () => {
        await spec()
            .post('/api/addProduct')
            .withJson({
                "authorization": token,
                "name": "Mouse",
                "price": "99",
                "quantity": "9999",
                "categories": "6705d197c9760cdf2d968653",
                "description": "Um mouse",
                "photos": "https://s.zst.com.br/cms-assets/2024/08/capa-melhor-mouse-gamer.webp",
                "popular": true,
                "visible": true,
                "location": "EBAC",
                "additionalDetails": "none",
                "specialPrice": "59"
            })
            .expectStatus(200)
            .stores('productId', 'data._id')
    })

    it('Deve editar um produto', async () => {
        const productId = stash.getDataStore().productId
        await spec()
            .put(`/api/editProduct/${productId}`)
            .withJson({
                "authorization": token,
                "name": "Mouse Gamer"
            })
            .expectStatus(200)
    })

    it('Deve deletar um produto', async () => {
        const productId = stash.getDataStore().productId
        await spec()
            .delete(`/api/deleteProduct/${productId}`)
            .withJson({
                "authorization": token,
            })
            .expectStatus(200)
    })
})