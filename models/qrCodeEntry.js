import mongoose from 'mongoose'

const qrCodeEntrySchema = new mongoose.Schema({
    UID_16digit : {
        type : String
    },
    Activation_code : {
        type: String
    },
    fromZipFile : {
        type: String
    },
    ForWhom : {
        type: String
    },
    UserID : {
        type: String
    }, //If QR activated
    isActiveted : {
        type: String
    },
    createdBY: {
        type: String
    }
})

export default mongoose.models.QRCodeEntry || mongoose.model('QRCodeEntry', qrCodeEntrySchema);