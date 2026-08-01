import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Services from "@/components/services";
import Story from "@/components/story";
import About from "@/components/about";
import Reviews from "@/components/reviews";
import Gallery from "@/components/gallery";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import StickyBook from "@/components/sticky-book";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Story />
        <About />
        <Reviews />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <StickyBook />
    </>
  );
}
