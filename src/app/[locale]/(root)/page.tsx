import DashBoard from "@/components/Dashboard";
import React from "react";

export default async function page() {
  // Fetch initial movie data server-side

  return (
    <div className="fc-page-container">
      <section
        className="fc-main-content"
        aria-labelledby="main-heading"
        role="main"
      >
        <DashBoard />
      </section>
    </div>
  );
}
