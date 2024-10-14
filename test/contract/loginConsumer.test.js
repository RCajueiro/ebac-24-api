const { reporter, flow, handler, mock } = require('pactum')
const pf = require('pactum-flow-plugin')
const { like } = require('pactum-matchers')

function addFlowReporter() {
  pf.config.url = 'http://localhost:8080' // pactum flow server url
  pf.config.projectId = 'lojaebac-front'
  pf.config.projectName = 'Loja EBAC Front'
  pf.config.version = '1.0.6'
  pf.config.username = 'scanner'
  pf.config.password = 'scanner'
  reporter.add(pf.reporter)
}

// global before
before(async () => {
  addFlowReporter()
  await mock.start(4001)
});

// global after
after(async () => {
    await mock.stop()
    await reporter.end()
})

handler.addInteractionHandler('Login Response', () => {
    return {
        provider: 'lojaebac-api',
        flow: 'Login',
        request: {
            method: 'POST',
            path: '/public/authUser',
            body: {
                "email": "admin@admin.com",
                "password": "admin123"
            }
        },
        response: {
            status: 200,
            body: {
                "success": true,
                "message": "login successfully",
                "data": {
                  "_id": "66cde1dba60ca1ef7fa0375d",
                  "role": "admin",
                  "profile": {
                    "firstName": "admin"
                  },
                  "email": "admin@admin.com",
                  "token": like("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY2Y2RlMWRiYTYwY2ExZWY3ZmEwMzc1ZCIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcyNzczMjU0NywiZXhwIjoxNzI3ODE4OTQ3fQ.Kx8nxAdzdET5CNJzZcxAIPRW472pFpvshnjEJiL8vW0")
                }
              }
        }
    }
})

it('FRONT - deve autenticar o usuário corretamente', async () => {
    await flow('Login')
    .useInteraction('Login Response')
        .post('http://localhost:4001/public/authUser')
        .withJson({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        .expectStatus(200)
        .expectJson('success', true)
})