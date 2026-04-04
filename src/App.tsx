import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "@/components/Header";
import Home from "@/pages/Home";
import OAuthCallback from "@/pages/OAuthCallback";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
