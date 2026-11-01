import Seo from "../components/Seo";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import WorksGallery from "../components/home/WorksGallery";
import PromoGifts from "../components/home/PromoGifts";
import About from "../components/home/About";
import SaudiIdentity from "../components/home/SaudiIdentity";
import WhyRegister from "../components/home/WhyRegister";
import Features from "../components/home/Features";
import Partners from "../components/home/Partners";
import Faq from "../components/home/Faq";
import Contact from "../components/home/Contact";
import { useI18n } from "../i18n/I18nProvider";

const META = {
  ar: {
    title: "تسجيل وترجمة العلامات التجارية والطباعة في الرياض",
    description:
      "شركة الزبير في الرياض: تسجيل العلامة التجارية لدى الهيئة السعودية للملكية الفكرية، ترجمة معتمدة، تصميم الهوية، الطباعة، المطبوعات الدعائية والهدايا. اطلب خدمتك وتابع طلبك أونلاين.",
  },
  en: {
    title: "Trademark registration, translation & printing in Riyadh",
    description:
      "Al Zubair, Riyadh: trademark registration with SAIP, certified translation, brand identity design, printing, promotional prints and gifts. Request a service and track it online.",
  },
};

export default function Home() {
  const { pick } = useI18n();
  const meta = pick(META);
  return (
    <>
      <Seo title={meta.title} description={meta.description} path="/" />
      <Hero />
      <Services />
      <WorksGallery />
      <PromoGifts />
      <About />
      <SaudiIdentity />
      <WhyRegister />
      <Features />
      <Partners />
      <Faq />
      <Contact />
    </>
  );
}
