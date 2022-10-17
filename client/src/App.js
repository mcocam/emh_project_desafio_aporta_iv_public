import Navbar from "./app/components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./app/routes/Home/Home";
import Descriptive from "./app/routes/Descriptive/Descriptive";
import Kpi from "./app/routes/Kpi/Kpi";
import Flux from "./app/routes/Flux/Flux";
import Methodology from "./app/routes/Metodology/Methodology";
import { GoogleA } from "./app/components/GoogleA/GoogleA";

const App = () => {

  GoogleA();

  return (
    <>
      <Navbar />
        <Routes>
          <Route path="/desc" element={<Descriptive />} />
          <Route path="/kpi" element={<Kpi />} />
          <Route path="/flujo" element={<Flux />} />
          <Route path="/metodologia" element={<Methodology />} />
          <Route path="/" element={<Home />} />
        </Routes>
    </>
  );
}

export default App;