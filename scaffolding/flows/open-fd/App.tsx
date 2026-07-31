import { JourneyProvider, useJourney } from './context/JourneyContext';
import AppShell from './components/AppShell/AppShell';
import Stepper from './components/Stepper/Stepper';
import Login from './steps/Login/Login';
import DepositDetails from './steps/DepositDetails/DepositDetails';
import BankDetails from './steps/BankDetails/BankDetails';
import Preview from './steps/Preview/Preview';
import SubmitFD from './steps/SubmitFD/SubmitFD';
import DebugPanel from './components/DebugPanel/DebugPanel';

function Journey() {
  const { state } = useJourney();

  return (
    <>
      <AppShell>
        <Stepper current={state.step} />
        {state.step === 1 && <Login />}
        {state.step === 2 && <DepositDetails />}
        {state.step === 3 && <BankDetails />}
        {state.step === 4 && <Preview />}
        {state.step === 5 && <SubmitFD />}
      </AppShell>
      <DebugPanel />
    </>
  );
}

export default function App() {
  return (
    <JourneyProvider>
      <Journey />
    </JourneyProvider>
  );
}
