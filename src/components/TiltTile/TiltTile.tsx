"use client";

import { LazyMotion, MotionConfig, domAnimation, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { tiltAngles } from "@/lib/tilt";
import styles from "./TiltTile.module.scss";

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

export function TiltTile({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);
  const rotateX = useSpring(useMotionValue(0), SPRING);
  const rotateY = useSpring(useMotionValue(0), SPRING);
  const enabled = canHover && !reduceMotion;

  useEffect(() => {
    const query = window.matchMedia("(hover: hover)");
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (!enabled) return;
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const angles = tiltAngles({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: rect.width,
      height: rect.height
    });
    rotateX.set(angles.rotateX);
    rotateY.set(angles.rotateY);
    element.style.setProperty("--glow-x", `${angles.glowX}%`);
    element.style.setProperty("--glow-y", `${angles.glowY}%`);
    element.style.setProperty("--glow-opacity", "1");
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    rotateX.set(0);
    rotateY.set(0);
    event.currentTarget.style.setProperty("--glow-opacity", "0");
  }

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.div
          className={styles.tilt}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
        >
          {children}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}
