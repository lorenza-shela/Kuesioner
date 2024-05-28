import LandingPage from "../pages/landingPage";
import Layout from "./layout";
export default function Page({ params, searchParams }: { params: { slug: string }; searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <>
      <LandingPage />
    </>
  );
}
