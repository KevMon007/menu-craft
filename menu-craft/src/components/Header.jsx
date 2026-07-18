import React from 'react';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
      <div className="text-xl font-bold tracking-wider text-emerald-400">
        MenuCraft <span className="text-xs text-gray-400 font-normal">SaaS</span>
      </div>
      <nav>
        <span className="text-sm bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
          Modo Administrador
        </span>
      </nav>
    </header>
  );
}
