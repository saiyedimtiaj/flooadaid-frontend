import React from "react";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default layout;
