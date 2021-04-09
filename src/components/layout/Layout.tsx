import { FC, PropsWithChildren } from "react";
import Footer from "./Footer";
import Header from "./Header";

const Layout: FC<PropsWithChildren<{ flex?: boolean }>> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="container flex-grow flex-shrink mx-auto p-4">{children}</main>
    <Footer />
  </div>
);

export default Layout;
