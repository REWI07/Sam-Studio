"use client";

import { createContext, useContext, useCallback, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

type NavigateFn = (href: string) => void;
const Ctx = createContext<{ navigate: NavigateFn }>({ navigate: () => {} });
export const useTransitionNav = () => useContext(Ctx);

export function ScissorsTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const leftCtrl = useAnimation();
  const rightCtrl = useAnimation();
  const scissCtrl = useAnimation();
  const lineCtrl = useAnimation();
  const glowCtrl = useAnimation();
  const busy = useRef(false);

  const navigate = useCallback(
    async (href: string) => {
      if (busy.current) return;
      busy.current = true;

      // Reset scissors to below screen, line to zero
      scissCtrl.set({ y: "calc(100vh + 150px)", opacity: 1 });
      lineCtrl.set({ scaleY: 0, opacity: 1 });
      glowCtrl.set({ scaleY: 0, opacity: 1 });

      // 1. Panels slide in from left and right
      await Promise.all([
        leftCtrl.start({ x: "0%", transition: { duration: 0.38, ease } }),
        rightCtrl.start({ x: "0%", transition: { duration: 0.38, ease } }),
      ]);

      // 2. Scissors cut from bottom to top
      scissCtrl.start({
        y: "calc(-100vh - 150px)",
        transition: { duration: 1.9, ease: [0.25, 0.1, 0.25, 1] },
      });
      lineCtrl.start({
        scaleY: 1,
        transition: { duration: 0.84, ease: [0.25, 0.1, 0.25, 1] },
      });
      glowCtrl.start({
        scaleY: 1,
        transition: { duration: 0.84, ease: [0.25, 0.1, 0.25, 1] },
      });

      // 3. Scroll while screen is covered
      await new Promise((r) => setTimeout(r, 500));
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "instant" });

      // 4. Wait for scissors to finish
      await new Promise((r) => setTimeout(r, 600));

      // 5. Fade out line + scissors
      lineCtrl.start({ opacity: 0, transition: { duration: 0.2 } });
      glowCtrl.start({ opacity: 0, transition: { duration: 0.2 } });
      scissCtrl.start({ opacity: 0, transition: { duration: 0.15 } });

      // 6. Panels slide out
      await Promise.all([
        leftCtrl.start({ x: "-100%", transition: { duration: 0.32, ease } }),
        rightCtrl.start({ x: "100%", transition: { duration: 0.32, ease } }),
      ]);

      busy.current = false;
    },
    [leftCtrl, rightCtrl, scissCtrl, lineCtrl, glowCtrl]
  );

  return (
    <Ctx.Provider value={{ navigate }}>
      {children}

      {/* Left panel */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={leftCtrl}
        className="fixed inset-y-0 left-0 z-[500] pointer-events-none"
        style={{ width: "50.5vw", background: "#080608" }}
      />

      {/* Right panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={rightCtrl}
        className="fixed inset-y-0 right-0 z-[500] pointer-events-none"
        style={{ width: "50.5vw", background: "#080608" }}
      />

      {/* Glow on vertical seam */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={glowCtrl}
        className="fixed z-[501] pointer-events-none"
        style={{
          left: "calc(50vw - 8px)",
          top: 0,
          bottom: 0,
          width: 16,
          background:
            "linear-gradient(180deg, transparent, rgba(200,164,106,0.35) 20%, rgba(200,164,106,0.35) 80%, transparent)",
          transformOrigin: "bottom center",
          filter: "blur(4px)",
        }}
      />

      {/* Vertical cut line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={lineCtrl}
        className="fixed z-[502] pointer-events-none"
        style={{
          left: "calc(50vw - 0.5px)",
          top: 0,
          bottom: 0,
          width: 1,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(200,164,106,0.9) 15%, rgba(235,200,140,1) 50%, rgba(200,164,106,0.9) 85%, transparent 100%)",
          transformOrigin: "bottom center",
        }}
      />

      {/* Scissors — rotated -90deg so they point upward, moving bottom→top */}
      <motion.div
        initial={{ y: "calc(100vh + 150px)", opacity: 1 }}
        animate={scissCtrl}
        className="fixed z-[503] pointer-events-none"
        style={{ left: "calc(50vw - 110px)", top: 0, willChange: "transform" }}
      >
        <div style={{ transform: "rotate(-90deg)" }}>
          <ScissorsSVG />
        </div>
      </motion.div>
    </Ctx.Provider>
  );
}

function ScissorsSVG() {
  return (
    <svg
      width="220"
      height="74"
      viewBox="0 0 130 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Upper handle ring */}
      <circle cx="17" cy="13" r="11" stroke="#c8a46a" strokeWidth="2.5" />
      <circle cx="17" cy="13" r="6.5" stroke="#c8a46a" strokeWidth="1.5" />

      {/* Lower handle ring */}
      <circle cx="17" cy="31" r="11" stroke="#c8a46a" strokeWidth="2.5" />
      <circle cx="17" cy="31" r="6.5" stroke="#c8a46a" strokeWidth="1.5" />

      {/* Upper arm */}
      <path d="M27 17 Q42 20 54 22" stroke="#c8a46a" strokeWidth="3.5" strokeLinecap="round" />

      {/* Lower arm */}
      <path d="M27 27 Q42 24 54 22" stroke="#c8a46a" strokeWidth="3.5" strokeLinecap="round" />

      {/* Pivot screw */}
      <circle cx="54" cy="22" r="5" fill="#e2c898" />
      <circle cx="54" cy="22" r="5" stroke="#c8a46a" strokeWidth="1.5" />
      <circle cx="54" cy="22" r="2" fill="#080608" />

      {/* Upper blade */}
      <path d="M54 22 L124 7 L127 13 L57 24 Z" fill="url(#upperBlade)" />

      {/* Lower blade */}
      <path d="M54 22 L124 37 L127 31 L57 20 Z" fill="url(#lowerBlade)" />

      {/* Blade edge highlight */}
      <path d="M54 22 L124 7" stroke="rgba(240,210,150,0.6)" strokeWidth="0.8" />
      <path d="M54 22 L124 37" stroke="rgba(240,210,150,0.6)" strokeWidth="0.8" />

      <defs>
        <linearGradient id="upperBlade" x1="54" y1="14" x2="127" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e2c898" />
          <stop offset="60%" stopColor="#c8a46a" />
          <stop offset="100%" stopColor="#a88248" />
        </linearGradient>
        <linearGradient id="lowerBlade" x1="54" y1="30" x2="127" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e2c898" />
          <stop offset="60%" stopColor="#c8a46a" />
          <stop offset="100%" stopColor="#a88248" />
        </linearGradient>
      </defs>
    </svg>
  );
}
