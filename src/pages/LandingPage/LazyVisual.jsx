import { useRef } from 'react';
import { useInView } from 'framer-motion';

export default function LazyVisual({ children, minHeight = 520, margin = '-10% 0px' }) {
  const ref = useRef(null);
  const shouldRender = useInView(ref, {
    once: true,
    margin,
  });

  return (
    <div ref={ref} style={{ minHeight }}>
      {shouldRender ? (
        children
      ) : (
        <div
          className="w-full rounded-[20px] border border-white/10 bg-white/[0.03]"
          style={{ minHeight }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
