import { BettingController } from 'controller/BettingController'
import { SubmissionController } from 'controller/SubmissionController'
import { SwaggerRouter } from 'koa-swagger-decorator'

const router = new SwaggerRouter({
  spec: {
    info: {
      title: 'Cockfight API',
      version: 'v1.0',
    },
  },
  swaggerHtmlEndpoint: '/swagger',
  swaggerJsonEndpoint: '/swagger.json',
})

router.swagger()
router.applyRoute(BettingController).applyRoute(SubmissionController)

export { router }
