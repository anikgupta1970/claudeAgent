import { MemoryRouter } from "react-router-dom";
import { AuthenticationProvider } from "@api-banking/fixed-deposit.hooks.use-journey-context";
import { BankDetails } from "./bank-details.js";

export const BasicBankDetails = () => {
    return (
        <MemoryRouter>
            <AuthenticationProvider>
                <BankDetails />
            </AuthenticationProvider>
        </MemoryRouter>
    );
};
