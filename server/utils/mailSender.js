const nodemailer = require('nodemailer');
const mailjet = require('nodemailer-mailjet-transport');

const mailSender = async (email, title, body) => {
    try {
      // Create a Transporter using Mailjet
      const transporter = nodemailer.createTransport(mailjet({
        auth: {
          apiKey: process.env.MAILJET_API_KEY,
          apiSecret: process.env.MAILJET_API_SECRET
        }
      }));
  
      // Send email to users
      let info = await transporter.sendMail({
        from: '"BarterKuy - Satra Shufi" <satrafa@utschool.sch.id>', 
        to: email,                                       
        subject: title,                                  
        html: body,                                      
      });
  
      console.log("Email info: ", info);
      return info;
    } catch (error) {
      console.log(error.message);
    }
  };
  
  module.exports = mailSender;