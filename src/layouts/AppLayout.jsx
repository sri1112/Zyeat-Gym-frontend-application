import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/navs/Header";
import Footer from "../components/navs/Footer";

export default function AppLayout() {
  const location = useLocation();
  const hideLayoutRoutes = ["/"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Header />}
      <Outlet />
      {!hideLayout && <Footer />}
    </>
  );
}
