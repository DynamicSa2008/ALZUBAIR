import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";

// Secondary pages load on demand so the home page stays light.
const OrderPage = lazy(() => import("./pages/OrderPage"));
const TrackPage = lazy(() => import("./pages/TrackPage"));
const KycPage = lazy(() => import("./pages/KycPage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="order" element={<Lazy page={OrderPage} />} />
        <Route path="track" element={<Lazy page={TrackPage} />} />
        <Route path="kyc" element={<Lazy page={KycPage} />} />
        <Route path="feedback" element={<Lazy page={FeedbackPage} />} />
        <Route path="dashboard" element={<Lazy page={DashboardPage} />} />
        <Route path="*" element={<Lazy page={NotFound} />} />
      </Route>
    </Routes>
  );
}

function Lazy({ page }) {
  const Page = page;
  return (
    <Suspense fallback={<div className="page-loader" aria-hidden="true" />}>
      <Page />
    </Suspense>
  );
}
