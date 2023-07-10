import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import bcrypt from "bcrypt";
const saltRounds = 10;

export default async function handler(req, res) {
  const { method } = req;
  const session = await getServerSession(req, res, authOptions);
  // console.log(session.user);
  await dbConnect();

  switch (method) {
    case "GET":
      if (session?.user.role === "admin") {
        try {
          const users = await User.find(
            {}
          ); /* find all the data in our database */
          res.status(200).json({ status: true, data: users });
        } catch (error) {
          res.status(400).json({ status: false });
        }
      } else {
        // Not Signed in
        res.status(401).json({ message: "A kon a tu" });
      }
      break;
    // case "POST":
    //   try {
    //     //Find users in database
    //     const users = await User.find({});
    //     // console.log(req.body);
    //     //If no user then create one
    //     if (users.length == null) {
    //       bcrypt.hash(req.body.password, saltRounds,async function(err, hash) {
    //         const user = await User.create({
    //           username: req.body.username,
    //           email: req.body.email,
    //           password: hash,
    //           role: "admin",
    //         }); /* create a new model in the database */
    //         res.status(201).json({ status: true, data: user });
    //       });
    //     }
    //     //Else chechk if this user is availble in DB
    //     const isAvailable = users.find((e) => e.email === req.body.email);
    //     //If NO then create new entry in DB
    //     if (!isAvailable) {
    //       // console.log(req.body.password);
    //       bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
    //         if (err) {
    //           console.log(err);
    //         }
    //         // console.log(hash);
    //         const user = await User.create({
    //           username: req.body.username,
    //           email: req.body.email,
    //           password: hash,
    //           role: "admin",
    //         }); /* create a new model in the database */
    //         res.status(201).json({ status: true, data: user });
    //       });
    //     } else {
    //       //Else show message as User already exists
    //       res
    //         .status(409)
    //         .json({ status: false, message: "User alreday exists." });
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     res.status(400).json({ status: false, error });
    //   }
    //   break;
    default:
      res.status(400).json({ status: false, message: "Bad Request" });
      break;
  }
}
