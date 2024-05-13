import './App.css';
import SelectDialogPage from "./pages/SelectDialogPage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DialogPage from "./pages/DialogPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectDialogPage />} />
        <Route path="/contact/:username" element={<DialogPage />} />
      </Routes>
    </Router>
  );
}



export default App;
