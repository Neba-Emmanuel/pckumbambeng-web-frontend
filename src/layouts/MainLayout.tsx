import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import ScrollToTop from "../components/shared/ScrollToTop";
import { AnimatePresence, motion } from "framer-motion";
import useScrollToTop from "../hooks/useScrollToTop";
import { Helmet } from "react-helmet-async";

const PageTransition: React.FC<{
  children: React.ReactNode;
  routeKey: string;
}> = ({ children, routeKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  useScrollToTop();

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "MTMKay",
            url: "https://www.mtmkay.com",
            logo: "https://www.mtmkay.com/mtmkay_logo.png",
            sameAs: [
              "https://www.facebook.com/mtmkay",
              "https://www.linkedin.com/company/mtmkay",
            ],
          })}
        </script>
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          <PageTransition routeKey={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default MainLayout;
