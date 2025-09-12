import MovieDetail from "@/components/MovieDetail";
import { notFound } from "next/navigation";

interface MoviePageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    notFound();
  }

  return <MovieDetail movieId={id} />;
}

export async function generateMetadata() {
  return {
    title: "Movie Details",
    description: "View detailed information about this movie",
  };
}
