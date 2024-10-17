import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export default function Home() {
  return (
    <div className={`h-screen w-screen ${poppins.className}`}>
      <main className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-4xl font-extrabold">This will be monoreader!</h1>
        <span>Monoreader will make it easy to bundle all of your favorite RSS channels, like news outlets or blogs!</span>
      </main>
    </div>
  );
}
