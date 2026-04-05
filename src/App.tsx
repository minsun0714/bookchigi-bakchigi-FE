import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import Header from "@/components/Header";
import BookDetail from "@/pages/BookDetail";
import Home from "@/pages/Home";
import Meeting from "@/pages/Meeting";
import NotFound from "@/pages/NotFound";
import MyPage from "@/pages/MyPage";
import OAuthCallback from "@/pages/OAuthCallback";
import StudyCreate from "@/pages/StudyCreate";
import StudyDetail from "@/pages/StudyDetail";
import StudyEdit from "@/pages/StudyEdit";
import StudyMembers from "@/pages/StudyMembers";
import Workspace from "@/pages/Workspace";

function AppLayout() {
  const { pathname } = useLocation();
  const hideHeader = pathname.includes("/meeting");

  return (
    <>
      <Toaster position="top-center" richColors />
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:isbn" element={<BookDetail />} />
        <Route path="/books/:isbn/studies/new" element={<StudyCreate />} />
        <Route path="/studies/:studyId" element={<StudyDetail />} />
        <Route path="/studies/:studyId/edit" element={<StudyEdit />} />
        <Route path="/studies/:studyId/members" element={<StudyMembers />} />
        <Route path="/studies/:studyId/workspace" element={<Workspace />} />
        <Route path="/studies/:studyId/meeting" element={<Meeting />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
