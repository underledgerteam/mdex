import React, { Fragment, useContext, useEffect } from 'react';
import Navbar from "src/components/Navbar";

import SwapPage from "src/pages/SwapPage";
function App() {
  return (
    <Fragment>
      <Navbar />
      <div className="min-h-screen min-w-screen flex justify-center items-center">
        <SwapPage />
      </div>
    </Fragment>
  );
};

export default App;
