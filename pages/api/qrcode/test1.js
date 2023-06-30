// // import { createCanvas, loadImage, Image } from "canvas";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../auth/[...nextauth]";
// import QRCode from "qrcode";
// import { join } from "path";
// import archiver from "archiver";
// import fs from "fs";
// import admin from "firebase-admin";
// import xml2js from "xml-js";

// // Initialize Firebase Admin SDK
// const serviceAccount = require("../../../qr-code-2fe95-firebase-adminsdk-srbst-39b91e1134.json"); // Replace with the path to your service account key file
// const firebaseConfig = {
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "qr-code-2fe95.appspot.com", // Replace with your Firebase Storage bucket name
// };

// if (!admin.apps.length) {
//   admin.initializeApp(firebaseConfig);
// }

// const bucket = admin.storage().bucket();

// export default async function handler(req, res) {
//   const {
//     query: { n },
//     method,
//   } = req;
//   //   console.log(n);
//   switch (method) {
//     case "GET":
//       // const archive = archiver("zip");
//       // archive.pipe(res);
//       // archive.on("error", (err) => {
//       //   throw err;
//       // });
//       // const canvas = createCanvas(220, 220, "svg");
//       // const ctx = canvas.getContext("2d");
//       // ctx.clearRect(0, 0, 220, 220);
//       // QRCode.toDataURL('www.pawforever.com', async function (err, url) {
//       //   if (err) throw err
//       //   console.log(url);
//       //   const qrCodeImage = await loadImage(url);
//       //     ctx.drawImage(qrCodeImage, 0, 0, 200, 200);
//       //     ctx.font = "italic 12px Sans";
//       //     // ctx.textAlign = "center";
//       //     ctx.fillText("4 4 4 - 5 5 5", 60, 205);

//       //     const svgData = canvas.toBuffer();

//       //     archive.append(svgData, { name: `qrcode.svg` });
//       //     archive.finalize();
//       // })
//       QRCode.toString(
//         "https://pawforever/search/",
//         { width: 200, errorCorrectionLevel: "Q", type: "svg" },
//         async function (err, string) {
//           if (err) console.log(err);
//           // console.log(string);
//           //Xml code here
//           // // Parse the SVG XML into a JavaScript object
//           // const svgObject = xml2js.xml2js(string, { compact: true });

//           // // Define the text element attributes
//           // const textElement = {
//           //   _attributes: {
//           //     x: "0",
//           //     y: "0",
//           //     fill: "#000000",
//           //     // "font-size": "16px"
//           //   },
//           //   _text: "Hello, World!",
//           // };

//           // // Convert the text element to XML string
//           // const textElementXml = xml2js.js2xml(textElement, { compact: true });

//           // // Append the text element XML to the SVG object
//           // if (svgObject.svg.hasOwnProperty("_children")) {
//           //   console.log(1);
//           //   svgObject.svg._children.push(textElementXml);
//           // } else {
//           //   console.log(2);
//           //   svgObject.svg._children = [textElementXml];
//           // }
//           // Append the text element to the SVG XML
//           const modifiedSvg = string.replace(
//             "</svg>",
//             '<text x="12" y="37" fill="#000000" font-size="3px">AAA - 555</text></svg>'
//           );

//           // Convert the modified SVG object back to XML string
//           // const modifiedSvg = xml2js.js2xml(svgObject, { compact: true });

//           // Write the modified SVG back to a file or use it as needed
//           fs.writeFileSync("public/output-test.svg", modifiedSvg, "utf8");
//           res.json({ message: "Qr code created.", modObj: modifiedSvg });
//           // res.json(modifiedSvg);
//           // archive.append(svgData, { name: `qrcode.svg` });
//           // archive.finalize();
//         }
//       );
//       //   QRCode.toFile("public/output.svg","www.pawforever.com",{ width: 200, errorCorrectionLevel: "H", type:'svg' },async function (err) {
//       //     if (err) console.log(err);
//       //     //   res.json({ data: string });
//       //     const qrCodeImage = await loadImage("public/output.svg");
//       //     ctx.drawImage(qrCodeImage, 0, 0, 200, 200);

//       //   //   const qrLogo = await loadImage("public/logo.png");
//       //   //   ctx.drawImage(qrLogo, 122, 122, 55, 55);

//       //   //   ctx.font = "italic 12px Sans";
//       //   //   // ctx.textAlign = "center";
//       //   //   ctx.fillText("4 4 4 - 5 5 5", 60, 205);

//       //     // ctx.rect(50, 50, 300, 300);
//       //     // ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
//       //     // ctx.fill();
//       //     const svgData = canvas.toBuffer();

//       //     archive.append(svgData, { name: `qrcode.svg` });
//       //     archive.finalize();
//       //   }

//       // );

//       break;
//     case "POST":
//       try {
//         // Handle POST request logic
//       } catch (error) {
//         console.error(error);
//         res.status(400).json({ status: false, error });
//       }
//       break;

//     default:
//       res.status(400).json({ status: false, message: "Bad Request" });
//       break;
//   }
// }
