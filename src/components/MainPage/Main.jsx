import React from 'react';
import Info from './Info';
import Science from './Science';

export default function Main() {
  return (
    <main className="site-main">
      {/* SCIENCE SECTION */}
      <Science/>
      {/* SCIENCE SECTION */}

      {/* FAQ SECTION */}
      <Info />
      {/* FAQ SECTION */}
    </main>
  );
}
