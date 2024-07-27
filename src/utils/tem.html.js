const htmlEmailToken = () => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              background-color: #f7f7f7;
              padding: 10px;
              border-bottom: 1px solid #ddd;
              text-align: center;
          }
          .content {
              padding: 20px;
          }
          .footer {
              background-color: #f7f7f7;
              padding: 10px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 12px;
          }
          .button {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 20px;
              color: #ffffff;
              background-color: #007bff;
              text-decoration: none;
              border-radius: 5px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Welcome to Our Service!</h1>
          </div>
          <div class="content">
              <p>Hi,</p>
              <p>Thank you for signing up for our service. Please click the button below to verify your email address:</p>
              <p>
                  <a href="{{link_verify}}" class="button">Verify Email</a>
              </p>
              <p>If you did not sign up for this account, please ignore this email.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Our Service. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `
}

export {
  htmlEmailToken
}