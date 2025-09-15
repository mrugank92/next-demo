import DashBoard from "@/components/Dashboard";
import { fetchMoviesServerSide, getServerSideAuth } from "@/lib/server-actions";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function page({ searchParams }: PageProps) {
  // Check authentication server-side
  const { isAuthenticated } = await getServerSideAuth();
  
  if (!isAuthenticated) {
    redirect("/sign-in");
  }

  // Await the searchParams promise in Next.js 15
  const resolvedSearchParams = await searchParams;
  
  // Fetch initial movie data server-side
  const currentPage = parseInt(resolvedSearchParams.page || "1");
  const initialData = await fetchMoviesServerSide(currentPage);

  return (
    <div className="fc-page-container">
      <section
        className="fc-main-content"
        aria-labelledby="main-heading"
        role="main"
      >
        <DashBoard 
          initialMovies={initialData.movies}
          initialTotalData={initialData.totalData}
          initialPage={currentPage}
        />
      </section>
    </div>
  );
}
