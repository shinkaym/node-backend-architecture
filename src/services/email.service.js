import { transport } from '~/dbs/init.nodemailer'
import OtpService from './otp.service'
import TemplateService from './template.service'
import { NotFoundError } from '~/core/error.response'
import { replacePlaceholder } from '~/utils'

class EmailService {
  static async sendEmailLinkVerify({
    html,
    toEmail,
    subject = 'Xác nhận Email đăng ký',
    text = 'xác nhận...'
  }) {
    try {
      const mailOptions = {
        from: ' "ShopDEV" <anonystick@gmail.com> ',
        to: toEmail,
        subject,
        text,
        html
      }

      transport.sendMail(mailOptions, (err, info) => {
        if (err) throw new Error('Failed to send email')
        console.log('Email sent: %s', info.messageId)
      })
    } catch (error) {
      return error
    }
  }
  static async sendEmailToken({ email = null }) {
    try {
      const token = await OtpService.newOtp({ email })
      const template = await TemplateService.getTemplate({ tem_name: 'HTML EMAIL TOKEN' })

      if (!template) throw new NotFoundError('Template not found')

      const content = replacePlaceholder(
        template.tem_html,
        {
          link_verify: `https://localhost:3052/v1/api/user/welcome-back?token=${token.otp_token}`
        }
      )

      this.sendEmailLinkVerify({
        html: content,
        toEmail: email,
        subject: 'Vui lòng xác nhận địa chỉ email đăng ký tại ShopDEV!'
      })

      return token.otp_token
    } catch (error) {
      return error
    }
  }
}

export default EmailService