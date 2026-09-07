import React, { useState, useEffect, useRef } from 'react';

/**
 * TypewriterText
 * Animates text as if it is writing itself letter-by-letter in real-time.
 * Features:
 * - Natural typing cadence with slight speed variance
 * - Blinking neon terminal cursor
 * - Pause duration when fully written
 * - Smooth backspacing and loop
 */
export const TypewriterText = ({
  text = 'SECURE • CONTAIN • PROTECT',
  typingSpeed = 90,
  deletingSpeed = 35,
  pauseTime = 4500,
  emptyPauseTime = 600,
  loop = true,
  className = '',
  cursorClassName = 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]',
  cursorChar = '▌',
  showCursor = true
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // If paused after typing complete sentence
    if (isPaused) {
      timeoutRef.current = setTimeout(() => {
        setIsPaused(false);
        if (loop) {
          setIsDeleting(true);
        }
      }, pauseTime);
      return () => clearTimeout(timeoutRef.current);
    }

    if (!isDeleting) {
      // Writing phase (letter by letter)
      if (displayedText.length < text.length) {
        // Vary typing speed slightly for organic typewriter feel
        const char = text[displayedText.length];
        const extraDelay = char === ' ' ? 60 : char === '•' || char === '.' ? 180 : 0;
        const delay = typingSpeed + extraDelay + (Math.random() * 25 - 12);

        timeoutRef.current = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length + 1));
        }, Math.max(30, delay));
      } else {
        // Finished writing full phrase
        setIsPaused(true);
      }
    } else {
      // Deleting / erasing phase
      if (displayedText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        // Empty state pause before typing starts again
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(false);
        }, emptyPauseTime);
      }
    }

    return () => clearTimeout(timeoutRef.current);
  }, [displayedText, isDeleting, isPaused, text, typingSpeed, deletingSpeed, pauseTime, emptyPauseTime, loop]);

  return (
    <span className={`inline-flex items-center tracking-wider ${className}`}>
      <span className="select-none">{displayedText}</span>
      {showCursor && (
        <span
          className={`inline-block ml-0.5 font-mono text-[0.85em] animate-pulse select-none ${cursorClassName}`}
          style={{ animationDuration: '0.75s' }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};
