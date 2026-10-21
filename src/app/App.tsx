import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { GlobalModals } from "./GlobalModals";

const HomePage = lazy(() => import("./routes/HomePage"));
const CardsPage = lazy(() => import("./routes/CardsPage"));
const RulesPage = lazy(() => import("./routes/RulesPage"));
const DicePage = lazy(() => import("./routes/DicePage"));

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<div className="route-loader"><span /><p>Setting the table…</p></div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/cards/rules" element={<RulesPage />} />
          <Route path="/dice" element={<DicePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <GlobalModals />
    </AppShell>
  );
}
