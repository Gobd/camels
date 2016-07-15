const config = require(`../.config.js`);
const nodemailer = require(`nodemailer`);
const mg = require(`nodemailer-mailgun-transport`);

var auth = {
    auth: {
        api_key: config.api_key,
        domain: config.domain
    }
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

const sendMail = (mailObj) => {
    mailObj.to.forEach(email => {
        nodemailerMailgun.sendMail({
            from: `bkemper@gmail.com`,
            to: email,
            subject: `${mailObj.prodName} dropped below ${mailObj.prodPrice} at ${mailObj.prodSite}`,
            html: `<b>HI ${email.split('@')[0]}, <a href="${mailObj.prodURL}">${mailObj.prodName}</a>dropped below ${mailObj.prodPrice} at ${mailObj.prodSite}`
        }, function(err, info) {
            if (err) {
                console.log(`Error: ` + err);
            } else {
                console.log(`Response: ` + info.id + info.message);
            }
        });
    });
};


module.exports = sendMail;