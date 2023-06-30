import dbConnect from "./dbConnect";
import QRCodeEntry from "../models/qrCodeEntry";
import { v4 as uuidv4 } from "uuid";

function generateUUID() {
  const uid = uuidv4().replace(/-/g, "").substring(0, 16);
  return uid;
}

export async function Generate_UID_16digit() {
  await dbConnect();
  //Get UID
  let flag = false;
  //Check in DB if UUID is repeat or not
  while (flag === false) {
    const UID = generateUUID();
    const qrEntries = await QRCodeEntry.find({ UID_16digit: UID });
    // console.log(qrEntries);
    if (qrEntries.length == 0) {
      return UID;
    }
  }  
}

function generateActive_Code() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let id = '';
  
  for (let i = 0; i < 3; i++) {
    const randomLetterIndex = Math.floor(Math.random() * letters.length);
    id += letters[randomLetterIndex];
  }
  
  id += '-';
  
  for (let i = 0; i < 3; i++) {
    const randomNumberIndex = Math.floor(Math.random() * numbers.length);
    id += numbers[randomNumberIndex];
  }
  
  return id;
}

export async function Activation_code() {
  await dbConnect();
  //Get UID
  let flag = false;
  //Check in DB if UUID is repeat or not
  while (flag === false) {
    const UID_6digits = generateActive_Code();
    const qrEntries = await QRCodeEntry.find({ Activation_code: UID_6digits });
    // console.log(qrEntries);
    if (qrEntries.length == 0) {
      return UID_6digits;
    }
  }  
}

