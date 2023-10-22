
import './App.css';
import Main from "./Main.js";
import { Analytics } from '@vercel/analytics/react';



function App() {
  return (
    <div>
      <Main></Main>
      <Analytics />
    </div>
  );
}

export default App;
