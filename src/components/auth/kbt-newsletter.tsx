'use client';

import { useState } from 'react';

export function KBTNewsletter() {
  const [selected, setSelected] = useState(false);
  return (
    <div className="flex items-start space-x-[13px]">
      <input
        type="checkbox"
        id="newsletter"
        checked={selected}
        onChange={() => setSelected(!selected)}
        className="w-4 h-4 border border-white bg-transparent checked:bg-white checked:text-white rounded-sm cursor-pointer"
      />
      <p className="text-[10.5px] text-kbt-normal-text font-medium">
        I WOULD LIKE TO SUBSCRIBE TO THE KENTUCKY BOURBON TRAIL<sup>®</sup>{' '}
        NEWSLETTERS
      </p>
    </div>
  );
}
