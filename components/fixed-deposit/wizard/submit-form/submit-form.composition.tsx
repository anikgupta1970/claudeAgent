import { MemoryRouter } from "react-router-dom";
import { AuthenticationProvider } from "@api-banking/fixed-deposit.hooks.use-journey-context";
import { SubmitForm } from "./submit-form.js";

export const BasicSubmitForm = () => {
    return (
        <MemoryRouter>
            <AuthenticationProvider>
                <SubmitForm />
            </AuthenticationProvider>
        </MemoryRouter>
    );
};
