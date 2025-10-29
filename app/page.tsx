import SearchBar from "@/components/search-bar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 mt-[10vh]">
      <div className="w-full max-2xl">
        <h1 className="flex justify-center items-center p-5 font-bold text-3xl">
          Search for a game!
        </h1>
      </div>
      <div className="w-full max-w-2xl">
        <SearchBar />
      </div>
    </main>
  );
}
