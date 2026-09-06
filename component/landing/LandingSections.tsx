"use client";

import PartnerMarquee from "./PartnerMarquee";
import RecentInnovationsCarousel from "./RecentInnovationsCarousel";
import CategoryGridSection from "./CategoryGridSection";
import TestimonialsSlider from "./TestimonialsSlider";
import BackToTop from "./BackToTop";

export default function LandingSections() {
  return (
    <>
      <PartnerMarquee />
      <RecentInnovationsCarousel />
      <CategoryGridSection />
      <TestimonialsSlider />
      <BackToTop />
    </>
  );
}
