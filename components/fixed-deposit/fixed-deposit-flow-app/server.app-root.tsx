import ReactDOMServer from "react-dom/server";
// @ts-ignore
import { StaticRouter } from "react-router-dom/server";
import { ApiBankingTheme } from "@api-banking/design.api-banking-theme";
import { FixedDepositFlowApp } from "./fixed-deposit-flow-app.js";

interface IRenderProps {
  path: string;
}
    
export const render = async ({ path }: IRenderProps) => {
  return ReactDOMServer.renderToString(
    <StaticRouter location={path}>
      <ApiBankingTheme>
        <FixedDepositFlowApp />
      </ApiBankingTheme>
    </StaticRouter>
  );
};
    
/**
 * implement loadScripts() to inject scripts to the head
 * during SSR.
 */
// export const loadScripts = async () => {
//   return '<script></script>';
// }