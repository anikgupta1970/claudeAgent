import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { FixedDepositFlowApp } from "./fixed-deposit-flow-app.js";

/**
 * comment this in for server-side rendering (ssr) and comment 
 * out of the root.render() invocation below.
*/
// hydrateRoot(
//   document.getElementById("root") as HTMLElement,
//   <BrowserRouter>
//     <ApiBankingTheme>
//       <FixedDepositFlowApp />
//     </ApiBankingTheme>
//   </BrowserRouter>
// );

if (import.meta.hot) {
  import.meta.hot.accept();
}

/**
 * mounting for client side rendering.
 */
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/:tenant/*" element={<FixedDepositFlowApp />} />
      <Route path="/*" element={<FixedDepositFlowApp />} />
    </Routes>
  </BrowserRouter>
);