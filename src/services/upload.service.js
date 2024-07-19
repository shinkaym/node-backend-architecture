import cloudinary from '~/configs/cloudinary.config'

class UploadService {
  static async uploadImageFromUrl() {
    const urlImg = 'https://down-vn.img.susercontent.com/file/cn-11134301-7r98o-llejprphhct094'
    const folderName = 'product/8409', newFileName = 'tai-nghe'

    return await cloudinary.uploader.upload(urlImg, {
      public_id: newFileName,
      folder: folderName
    })
  }

  static async uploadImageFromLocal({ path, folderName = 'product/8409'  }) {
    try {
      const result = await cloudinary.uploader.upload(path, {
        public_id: 'thumb',
        folder: folderName
      })

      return {
        image_url: result.secure_url,
        shopId: 8409,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: 'jpg'
        })
      }
    } catch (error) {
      console.error('Error uploading image::', error)
    }
  }
}

export default UploadService