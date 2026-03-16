import { AnimatePresence, motion } from "framer-motion";
import AudienceGate from "@/components/AudienceGate";
import StickyNav from "@/components/StickyNav";
import BackgroundScribbles from "@/components/BackgroundScribbles";
import CorporateHome from "@/pages/CorporateHome";
import IndividualHome from "@/pages/IndividualHome";
import { useAudience } from "@/contexts/AudienceContext";

const Index = () => {
  const { audience } = useAudience();
  const isIndividual = audience === "individual";

  return (
    <>
      <BackgroundScribbles />
      <AudienceGate />
      <StickyNav />

      <AnimatePresence mode="wait">
        {isIndividual ? (
          <motion.div
            key="individual"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <IndividualHome />
          </motion.div>
        ) : (
          <motion.div
            key="corporate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CorporateHome />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
