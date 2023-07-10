import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  const session = await getServerSession(req, res, authOptions);
  // console.log(session.user);
  await dbConnect();
  if (session?.user.role === 'admin') {
    switch (method) {
      case "GET" /* Get a model by its ID */:
        try {
          const user = await User.findById(id);
          if (!user) {
            return res.status(400).json({ status: false });
          }
          res.status(200).json({ status: true, data: user });
        } catch (error) {
          res.status(400).json({ status: false });
        }
        break;

      case "PUT" /* Edit a model by its ID */:
        try {
          const user = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
          if (!user) {
            return res.status(400).json({ status: false });
          }
          res.status(200).json({ status: true, data: user });
        } catch (error) {
          res.status(400).json({ status: false });
        }
        break;

      case "DELETE" /* Delete a model by its ID */:
        try {
          const deletedUser = await User.deleteOne({ _id: id });
          if (!deletedUser) {
            return res.status(400).json({ status: false });
          }
          res.status(200).json({ status: true, data: {} });
        } catch (error) {
          res.status(400).json({ status: false });
        }
        break;

      default:
        res.status(400).json({ status: false });
        break;
    }
  } else {
    // Not Signed in
    res.status(401).json({ message: "Unauthorized" });
  }
}
