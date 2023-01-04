const nodemailer = require("nodemailer");

class mailHelper{
    static sendEmail = (receiver, subject, body)=>{   
        var transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'lavieapplication@outlook.com',
                pass: 'lavie12345'
            }
        });
            
        var mailOptions = {
            from: 'lavieapplication@outlook.com',
            to: receiver,
            subject: subject,
            html: `${body}`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}
module.exports = mailHelper