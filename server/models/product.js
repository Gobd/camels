const make = require(`../priceHelpers.js`),
    moment = require(`moment`),
    mongoose = require(`mongoose`),
    sendMail = require(`./nodemailer.js`);

const productSchema = new mongoose.Schema({
    SKU: {
        type: String,
        required: true,
        unqiue: true
    },
    prices: [{
        price: {
            type: Number,
            min: 0
        },
        date: Date
    }],
    name: {
        type: String,
        required: true
    },
    category: String,
    site: String,
    URL: String,
    createdAt: {
        type: Date,
        default: moment().toDate()
    },
    updatedAt: {
        type: Date,
        default: moment().toDate()
    },
    priceAlerts: [{
        alertType: {
            type: String,
            enum: [`email`, `text`]
        },
        contact: String,
        price: {
            type: Number,
            min: 0
        }
    }]
});

// need to add support for texts
// check if we can remove the self = this by using fat arrow funtion
productSchema.methods.updatePrice = function() {
    var self = this;
    make.pFin.findItemDetails(self.URL, (err, details) => {
        if (err) {
            return err;
        }
        self.prices.push({
            date: moment().toDate(),
            price: details.price
        });
        const emailsToAlert = [];
        const phonesToAlert = [];
        self.priceAlerts = self.priceAlerts.filter(e => {
            if (e.price < details.price && e.alertType === `email`) {
                emailsToAlert.push(e.contact);
                return false;
            } else if (e.price < details.price && e.alertType === `text`) {
                phonesToAlert.push(e.contact);
                return false;
            } else {
                return true;
            }
        });
        sendMail({
            to: emailsToAlert,
            prodName: self.name,
            prodURL: self.URL,
            prodPrice: details.price,
            prodSite: self.site
        });
        return self.save((saveErr, saveRes) => saveRes);
    });
};

module.exports = mongoose.model('Product', productSchema);