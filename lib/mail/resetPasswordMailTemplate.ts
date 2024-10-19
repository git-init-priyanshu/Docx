export default function ResetPasswordTemplate({ firstName, url }: { firstName: string, url: string }) {
  return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Password Update Link</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
                border-radius : 10px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href="https://edu-care-kappa.vercel.app/"><img class="logo"
                    src="https://res.cloudinary.com/dfscqg5dc/image/upload/v1712678630/ImageDatabase_1/zevkzr3fgyre8m2slyhv.png" alt="EduCare Logo"></a>
            <div class="message">Password Reset Link</div>
            <div class="body">
                <p>Hey ${firstName},</p>
                <p>Your password will be successfully updated after following the given link : <span class="highlight">${url}</span>.
                </p>
                <p>If you did not request this password change, please contact us immediately to secure your account.</p>
            </div>
            <div class="support">If you have any questions or need further assistance, please feel free to reach out to us
                at
                <a href="mailto:info@educare.com">info@educare.com</a>. We are here to help!
            </div>
        </div>
    </body>
    
    </html>`
}
