import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import OurStory from "@/components/OurStory";
import Itinerary from "@/components/Itinerary";
import RSVP from "@/components/RSVP";
import Gallery from "@/components/Gallery";
import TravelInfo from "@/components/TravelInfo";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <Countdown />
      <OurStory />
      <Itinerary />
      <RSVP />
      <Gallery />
      <TravelInfo />
      <Footer />
    </main>
  );
}
