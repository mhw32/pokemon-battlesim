import React, { useState, useRef, useEffect } from 'react';

interface SlowTextProps {
  speed: number;
  text: string;
}

const SlowText = (props: SlowTextProps) => {
  const { speed, text } = props;
  const [placeholder, setPlaceholder] = useState<string>(text.length > 0 ? text[0] : "");

  const index = useRef<number>(0);
  
  useEffect(() => {
    setPlaceholder(text[0]);
    index.current = 0;
  }, [text]);

  useEffect(() => {
    function tick() {
      index.current++;
      setPlaceholder((prev: string) => prev + text[index.current]);
    }
    if (index.current < text.length - 1) {
      let addChar = setInterval(tick, speed);
      return () => clearInterval(addChar);
    }
  }, [placeholder, speed, text]);
  return <span>{placeholder}</span>
}

export default SlowText;