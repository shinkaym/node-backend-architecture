import { SuccessResponse } from '~/core/success.response'
import TemplateService from '~/services/template.service'

class EmailController {
  newTemplate = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'new template',
      metadata: await TemplateService.newTemplate(req.body)
    })
  }
}

export const emailController = new EmailController