import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Settings from "./Pages/Settings";
import Quiz from "./Pages/Quiz";
import Result from "./Pages/Result";
import { Box, Container } from "@mui/material";

function App() {
  return (
    <Router>
      <Container maxWidth="sm">
        <Box textAlign={"center"} mt={20}>
        <Routes>
        <Route path="/" element={<Settings />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
        </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
