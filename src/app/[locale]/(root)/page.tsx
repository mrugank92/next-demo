import DashBoard from "@/components/Dashboard";
import Header from "@/components/Header";
import React from "react";

export default async function page() {
  // Fetch initial movie data server-side

  return (
    <div>
      <Header />
      <DashBoard />
    </div>
  );
}
