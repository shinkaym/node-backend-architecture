import nodemailer from 'nodemailer'

export const transport = nodemailer.createTransport({
  // host: 'email-smtp.ap-southeast-1.amazonaws.com',
  // port: 465,
  // secure: true,
  // auth: {
  //   user: 'AKIA4SW7WGZBCLIDGPGC',
  //   pass: 'BK9TllDhe+6nBtD27dpJSAM+gTTL+vJ2imrVS+OqfLYk'
  // }
  service: 'gmail',
  auth: {
    user: 'shinkaym.services@gmail.com',
    pass: 'cerp yayb pooa izaf'
  }
})
