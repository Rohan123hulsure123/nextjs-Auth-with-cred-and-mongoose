import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import dbConnect from "../../../lib/dbConnect";
import QRCodeZip from "../../../models/qrCodeZip";

import admin from "firebase-admin";

// Initialize Firebase Admin SDK

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
);// Replace with the path to your service account key file

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
    query: { n },
    method,
  } = req;

  const session = await getServerSession(req, res, authOptions);
  await dbConnect();

  //   console.log(n);
  if (session) {
    switch (method) {
      case "GET":
        try {
          //Pagination implementation
          // const resultsPerPage = 2;
          // let page = n >= 1 ? n : 1;
          // //   const query = req.query.search;

          // page = page - 1;

          // const zipfiles = await QRCodeZip.find()
          //   .sort({ _id: "asc" })
          //   .limit(resultsPerPage)
          //   .skip(resultsPerPage * page)
          //   .then(async (results) => {
          //     //   console.log(results);
          //     return results;
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //     res.status(500).send(err);
          //   });

          const zipfiles = await QRCodeZip.find()
            .sort({ _id: "desc" })
            .catch((err) => {
              console.log(err);
              res.status(500).send(err);
            });

          const date = new Date();
          const updatedZipfileDataWithDownloadUrl = await Promise.all(
            zipfiles.map(async (item) => {
              var obj = Object.assign({}, item._doc);
              obj.downloadUrl = await bucket
                .file(item.fileName)
                .getSignedUrl({
                  action: "read",
                  expires: `${date.getMonth()}-${date.getDate()}-${
                    date.getFullYear() + 1
                  }`,
                })
                .catch((err) => console.log(err));

              return obj;
            })
          );
          res.status(200).json({
            message: "QRcode Zipfiles",
            files: updatedZipfileDataWithDownloadUrl,
          });

          //   res.json(zipfiles);
        } catch (error) {
          console.error(error);
          res.status(400).json({ status: false, error });
        }
        break;

      case "POST":
        try {
          // Handle POST request logic
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
