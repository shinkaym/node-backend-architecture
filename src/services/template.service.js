import TemplateModel from '~/models/template.model'
import { htmlEmailToken } from '~/utils/tem.html'

class TemplateService {
  static async newTemplate({ tem_name, tem_id = 0, tem_html }) {
    // 1. check template exists
    // 2. create new template
    return await TemplateModel.create({
      tem_id,
      tem_name, // unique name
      tem_html: htmlEmailToken()
    })
  }
  static async getTemplate({
    tem_name
  }) {
    return await TemplateModel.findOne({ tem_name })
  }
}

export default TemplateService