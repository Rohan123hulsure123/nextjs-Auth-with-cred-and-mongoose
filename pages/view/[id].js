import { useRouter } from "next/router";

export default function Component() {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  return <div>{id}</div>;
}
