import { AnimatePresence, motion } from "framer-motion";
import AudienceGate from "@/components/AudienceGate";
import StickyNav from "@/components/StickyNav";
import CorporateHome from "@/pages/CorporateHome";
import IndividualHome from "@/pages/IndividualHome";
import PortalTransition from "@/components/PortalTransition";
import HomepageEntrance from "@/components/HomepageEntrance";
import { useAudience } from "@/contexts/AudienceContext";

const Index = () => {
  const {
    audience,
    transitioning,
    setTransitioning,
    setGateOpen,
    markIntroSeen,
  } = useAudience();
  const isIndividual = audience === "individual";

  return (
    <>
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
            <HomepageEntrance active={transitioning}>
              <IndividualHome />
            </HomepageEntrance>
          </motion.div>
        ) : (
          <motion.div
            key="corporate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <HomepageEntrance active={transitioning}>
              <CorporateHome />
            </HomepageEntrance>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {transitioning && (
          <PortalTransition
            key="portal"
            onMidpoint={() => setGateOpen(false)}
            onComplete={() => {
              markIntroSeen();
              setTransitioning(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
