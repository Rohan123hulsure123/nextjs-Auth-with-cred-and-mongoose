import { createCanvas, loadImage } from "canvas";
import { getServerSession } from "next-auth/next";

import dbConnect from "../../../../lib/dbConnect";
import QRCodeZip from "../../../../models/qrCodeZip";
import QRCodeEntry from "../../../../models/qrCodeEntry";

import { authOptions } from "../../auth/[...nextauth]";
import { QRCodeCanvas } from "@loskir/styled-qr-code-node";
// import { join } from "path";
import archiver from "archiver";
// import fs from "fs";
import admin from "firebase-admin";
import { Generate_UID_16digit, Activation_code } from "../../../../lib/helper";

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY); // Replace with the path to your service account key file

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "qr-code-2fe95.appspot.com", // Replace with your Firebase Storage bucket name
};

if (!admin.apps.length) {
  admin.initializeApp(firebaseConfig);
}

const bucket = admin.storage().bucket();

export default async function handler(req, res) {
  const {
    body: { numberOfQRTags, QRTagsForWhom, QRCodeType },
    method,
  } = req;
  // console.log(numberOfQRTags + QRTagsForWhom + QRCodeType);

  const session = await getServerSession(req, res, authOptions);
  await dbConnect();
  if (session?.user.role === "admin") {
    switch (method) {
      // case "GET":
      // try {
      //   const zipfiles = await QRCodeZip.find();
      //   console.log(zipfiles);
      // } catch (error) {
      //   console.error(error);
      //   res.status(400).json({ status: false, error });
      // }
      // break;

      case "POST":
        try {
          // Handle POST request logic
          const qrCodeCount = numberOfQRTags; // Number of QR codes to generate

          //Star zip file
          const archive = archiver("zip");
          const zipFileName = `${QRTagsForWhom}_${numberOfQRTags}_${QRCodeType}_${Date.now()}.zip`; //Amazon_25_SVG_timestamp.zip

          archive.on("error", (err) => {
            throw err;
          });

          //Create "qrCodeCount" time new QR code
          for (let i = 1; i <= qrCodeCount; i++) {
            const uid16Digit = await Generate_UID_16digit(); //16 digits ID to identify each QR code
            const activationCode_6Digit = await Activation_code(); //6 digits Activation code to activate individual QR tag

            //Create canvas
            const canvas = createCanvas(200, 220, QRCodeType.toLowerCase());
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, 220, 220);

            //Create QR code
            const qrCode = new QRCodeCanvas({
              width: 200,
              height: 200,
              data: `https://qr.mowat.dev/view/${uid16Digit}`,

              dotsOptions: {
                color: "#0C134F",
                type: "square",
              },
              image: "public/logo.png",
              // imageOptions: {
              //   crossOrigin: "anonymous",
              //   imageSize: 0.4,
              // },
              qrOptions: {
                errorCorrectionLevel: "Q",
              },
            });

            const qrCodeImageData = await qrCode
              .toBuffer
              // QRCodeType.toLowerCase()
              ();
            // console.log(qrCodeImageData);
            //Draw Qr code on Canvas
            const qrCodeImage = await loadImage(qrCodeImageData);
            // console.log(qrCodeImage);
            ctx.drawImage(qrCodeImage, 0, 0, 200, 200);

            //Add logo to middle of QR code
            // const qrLogo = await loadImage("public/logo.png");
            // ctx.drawImage(qrLogo, 72, 72, 55, 55);

            //Add 6 digit activation code at bottom
            ctx.font = "Sans Bold 30px";
            ctx.fillText(activationCode_6Digit.split("").join(" "), 75, 215);

            const canvasData = canvas.toBuffer();

            archive.append(canvasData, {
              // name: `${i}_outof_${qrCodeCount}_${QRTagsForWhom}_${uid16Digit}.${QRCodeType.toLowerCase()}`,
              name: `${i}_outof_${qrCodeCount}_${QRTagsForWhom}_${uid16Digit}.${QRCodeType.toLowerCase()}`,
            });

            //Make entry in DB
            // console.log(zipFileName);
            // console.log(typeof zipFileName);
            await QRCodeEntry.create({
              UID_16digit: uid16Digit,
              Activation_code: activationCode_6Digit,
              isActiveted: "false",
              fromZipFile: String(zipFileName),
              ForWhom: QRTagsForWhom,
              UserID: "",
              createdBY: session.user.email,
            }); /* create a new model in the database */
          }

          archive.finalize();

          const zipFileWriteStream = bucket
            .file(zipFileName)
            .createWriteStream();
          archive.pipe(zipFileWriteStream);

          archive.on("end", async () => {
            zipFileWriteStream.end();

            //Make entry for ZIP file in DB
            await QRCodeZip.create({
              fileName: zipFileName,
              numberOFQRCodes: qrCodeCount,
              ForWhom: QRTagsForWhom,
              fileType: QRCodeType,
              createdBY: session.user.email,
            }); /* create a new model in the database */
            const date = new Date();
            const downloadUrl = await bucket.file(zipFileName).getSignedUrl({
              action: "read",
              expires: `${date.getMonth()}-${date.getDate()}-${
                date.getFullYear() + 1
              }`,
            });
            console.log("Zip file created and uploaded successfully.");
            res.status(200).json({
              message: "QR codes generated and zip file uploaded successfully.",
              url: downloadUrl,
            });
          });

          archive.on("error", (error) => {
            console.error("Error generating and uploading QR codes:", error);
            res.status(500).json({ error: "Internal server error" });
          });
          // console.log(await Generate_UID_16digit());
          // console.log(await Activation_code());
          // res.json({ numberOfQRTags, QRTagsForWhom, QRCodeType });
        } catch (error) {
          console.error(error);
          res.status(400).json({ status: false, error });
        }
        break;

      default:
        res.status(400).json({ status: false, message: "Bad Request" });
        break;
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}
