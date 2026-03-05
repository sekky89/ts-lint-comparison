/* sort-imports: wrong declaration order (override has ignoreDeclarationSort: false) */
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

export const C = () => {
  const [a, setA] = useState(0);
  return <div>{a}</div>;
};
