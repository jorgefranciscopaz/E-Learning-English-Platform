import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="flex gap-8 mb-6">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img
            src={viteLogo}
            className="h-20 w-20 hover:scale-110 transition-transform"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className="h-20 w-20 hover:rotate-12 transition-transform"
            alt="React logo"
          />
        </a>
      </div>

      <h1 className="text-4xl font-extrabold drop-shadow-lg">
        Vite + React + Tailwind
      </h1>

      <div className="mt-6 bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-2 bg-pink-600 rounded-lg font-semibold shadow hover:bg-pink-700 transition"
        >
          count is {count}
        </button>
        <p className="mt-4 text-sm opacity-80">
          Edita <code>src/App.jsx</code> y guarda para probar HMR ⚡
        </p>
      </div>

      <p className="mt-6 text-sm opacity-60">
        Haz clic en los logos para aprender más
      </p>
    </div>
  );
}

export default App;
