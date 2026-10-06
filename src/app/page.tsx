import { AustraliaNetworkMap } from "@/components/home/australia-network-map";
import { BusinessSection } from "@/components/home/business-section";
import { DeliveryOptionsSection } from "@/components/home/delivery-options";
import { FinalCtaSection } from "@/components/home/final-cta";
import { HomeHero } from "@/components/home/home-hero";
import { HowItWorksSection } from "@/components/home/how-it-works";
import { ServicesSection } from "@/components/home/services-section";
import { TestimonialsSection } from "@/components/home/testimonials";
import { TrustStatsSection } from "@/components/home/trust-stats";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TrustStatsSection />
      <HowItWorksSection />
      <ServicesSection />
      <AustraliaNetworkMap />
      <BusinessSection />
      <DeliveryOptionsSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </>
  );
}
