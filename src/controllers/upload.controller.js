import { BadRequestError } from '~/core/error.response'
import { SuccessResponse } from '~/core/success.response'
import UploadService from '~/services/upload.service'

class UploadController {
  uploadFile = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'upload image success!',
      metadata: await UploadService.uploadImageFromUrl()
    })
  }
  uploadFileThumb = async (req, res) => {
    const { file } = req
    if (!file) throw new BadRequestError('File missing')
    SuccessResponse.send(res, {
      message: 'upload image success!',
      metadata: await UploadService.uploadImageFromLocal({ path: file.path })
    })
  }
}

export const uploadController = new UploadController