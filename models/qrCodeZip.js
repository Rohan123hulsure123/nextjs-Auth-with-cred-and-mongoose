import mongoose from "mongoose";

const qrCodeZipSchema = new mongoose.Schema({
  fileName: { //Amazon_25_SVG_timestamp.zip
    type: String,
  },
  numberOFQRCodes: {
    type: Number,
  },
  ForWhom: {
    type: String,
  },
  fileType: {
    type: String,
  },
  createdBY: {
    type: String,
  },
});

export default mongoose.models.QRCodeZip ||
  mongoose.model("QRCodeZip", qrCodeZipSchema);
