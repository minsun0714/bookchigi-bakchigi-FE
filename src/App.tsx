import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Header from "@/components/Header";
import BookDetail from "@/pages/BookDetail";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import MyPage from "@/pages/MyPage";
import OAuthCallback from "@/pages/OAuthCallback";
import StudyCreate from "@/pages/StudyCreate";
import StudyDetail from "@/pages/StudyDetail";
import StudyEdit from "@/pages/StudyEdit";
import StudyMembers from "@/pages/StudyMembers";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:isbn" element={<BookDetail />} />
        <Route path="/books/:isbn/studies/new" element={<StudyCreate />} />
        <Route path="/studies/:studyId" element={<StudyDetail />} />
        <Route path="/studies/:studyId/edit" element={<StudyEdit />} />
        <Route path="/studies/:studyId/members" element={<StudyMembers />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
