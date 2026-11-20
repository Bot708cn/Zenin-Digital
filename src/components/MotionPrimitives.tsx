import type { ReactNode } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const offset =
    direction === 'up'
      ? { y: 28, x: 0 }
      : direction === 'down'
        ? { y: -28, x: 0 }
        : direction === 'left'
          ? { x: 32, y: 0 }
          : direction === 'right'
            ? { x: -32, y: 0 }
            : { x: 0, y: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.09,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 'some' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-[#006BFF] via-[#00CFFF] to-[#60EFFF] shadow-[0_0_12px_rgba(0,207,255,0.75)]"
      style={{ scaleX }}
    />
  );
}
