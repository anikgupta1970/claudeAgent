import { MemoryRouter } from "react-router-dom";
import { AuthenticationProvider } from "@api-banking/fixed-deposit.hooks.use-journey-context";
import { PreviewStep } from "./preview-step.js";

export const BasicPreviewStep = () => {
    return (
        <MemoryRouter>
            <AuthenticationProvider>
                <PreviewStep />
            </AuthenticationProvider>
        </MemoryRouter>
    );
};
