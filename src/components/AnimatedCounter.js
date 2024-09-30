import React, { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";

const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const inView = useInView(countRef);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = parseInt(value, 10);
      if (start === end) return;

      let totalMilSecDur = parseInt(duration);
      let incrementTime = (totalMilSecDur / end) * 1000;

      let timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);
    }
  }, [value, duration, inView]);

  return <span ref={countRef}>{count.toLocaleString()}</span>;
};

export default AnimatedCounter;
