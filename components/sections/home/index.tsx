import Features from './feature';
import Footer from './footer';
import HeroBanner from './hero-section-1';
import Pricing from './pricing';

export default function HomeSection() {
  return (
    <div>
      <HeroBanner />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
