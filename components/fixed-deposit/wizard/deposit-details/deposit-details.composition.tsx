import { MemoryRouter } from "react-router-dom";
import { AuthenticationProvider } from "@api-banking/fixed-deposit.hooks.use-journey-context";
import { DepositDetails } from "./deposit-details.js";

export const BasicDepositDetails = () => {
    return (
        <MemoryRouter>
            <AuthenticationProvider>
                <DepositDetails />
            </AuthenticationProvider>
        </MemoryRouter>
    );
};
