import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getServerSession(req, res, authOptions);

  if (session?.user.role === 'admin') {
    // console.log(session);
    // // Signed in
    // console.log("Session", JSON.stringify(session, null, 2));
    switch (method) {
      case "GET":
        res.status(200).json({ message: "A vedya" });
        break;
      case "POST":
        const { test } = req.body;
        //   console.log(session);
        res.status(200).json({ message: "bass ka bhau", test });
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } else {
    // Not Signed in
    res.status(401).json({ message: "A kon a tu" });
  }
}
