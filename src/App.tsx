import { Fragment } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "src/components/shared/Layout";
import SwapPage from "src/pages/SwapPage";
import NotFound from "src/pages/NotFound";

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<SwapPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
};

export default App;
