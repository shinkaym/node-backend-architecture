import { BadRequestError } from '~/core/error.response'
import { SuccessResponse } from '~/core/success.response'
import UploadService from '~/services/upload.service'

class UploadController {
  uploadFileFromUrl = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'upload image success!',
      metadata: await UploadService.uploadImageFromUrl()
    })
  }
  uploadFileFromLocal = async (req, res) => {
    const { file } = req
    if (!file) throw new BadRequestError('File missing')
    SuccessResponse.send(res, {
      message: 'upload image success!',
      metadata: await UploadService.uploadImageFromLocal({ path: file.path })
    })
  }
  uploadFileFromLocalS3 = async (req, res) => {
    const { file } = req
    if (!file) throw new BadRequestError('File missing')
    SuccessResponse.send(res, {
      message: 'upload image success!',
      metadata: await UploadService.uploadImageFromLocalS3({ file })
    })
  }
  // uploadFileFromLocalFiles = async (req, res) => {
  //   const { files } = req
  //   if (!files.length) throw new BadRequestError('File missing')
  //   SuccessResponse.send(res, {
  //     message: 'upload image success!',
  //     metadata: await UploadService.uploadImageFromLocal({ files })
  //   })
  // }
}

export const uploadController = new UploadController