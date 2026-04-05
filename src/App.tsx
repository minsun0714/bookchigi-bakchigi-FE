import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "@/components/Header";
import BookDetail from "@/pages/BookDetail";
import Home from "@/pages/Home";
import OAuthCallback from "@/pages/OAuthCallback";
import StudyCreate from "@/pages/StudyCreate";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:isbn" element={<BookDetail />} />
        <Route path="/books/:isbn/studies/new" element={<StudyCreate />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
