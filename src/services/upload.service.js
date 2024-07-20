import { GetObjectCommand, PutObjectCommand, s3 } from '~/configs/s3.config'
import crypto from 'crypto'
import cloudinary from '~/configs/cloudinary.config'
import { randomImageName } from '~/utils'
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getSignedUrl } from '@aws-sdk/cloudfront-signer'

const urlImagePublic = 'https://d2er84k6cxe94i.cloudfront.net'

class UploadService {
  static async uploadImageFromUrl() {
    const urlImg = 'https://down-vn.img.susercontent.com/file/cn-11134301-7r98o-llejprphhct094'
    const folderName = 'product/8409', newFileName = 'tai-nghe'

    return await cloudinary.uploader.upload(urlImg, {
      public_id: newFileName,
      folder: folderName
    })
  }

  static async uploadImageFromLocal({ path, folderName = 'product/8409' }) {
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

  static async uploadImageFromLocalS3({ file }) {
    try {
      const imageName = randomImageName()

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
        Body: file.buffer,
        ContentType: 'image/jpeg'
      })

      const result = await s3.send(command)

      // const singedUrl = new GetObjectCommand({
      //   Bucket: process.env.AWS_BUCKET_NAME,
      //   Key: imageName
      // })

      // const url = await getSignedUrl(s3, singedUrl, { expiresIn: 3600 })

      const url = getSignedUrl({
        url: `${urlImagePublic}/${imageName}`,
        keyPairId: 'K1JNNTKYLJOVE9',
        dateLessThan: new Date(Date.now() + 1000 * 60),
        privateKey: process.env.AWS_BUCKET_PUBLIC_KEY_ID
      })

      return {
        // url: `${urlImagePublic}/${imageName}`,
        url,
        result
      }

      // return {
      //   image_url: result.secure_url,
      //   shopId: 8409,
      //   thumb_url: await cloudinary.url(result.public_id, {
      //     height: 100,
      //     width: 100,
      //     format: 'jpg'
      //   })
      // }
    } catch (error) {
      console.error('Error uploading image::', error)
    }
  }
}

export default UploadService