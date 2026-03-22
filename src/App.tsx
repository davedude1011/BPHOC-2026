import { Route, Router } from "@solidjs/router";
import Home from "./pages/home";
import TaskOne from "./pages/task1";
import TaskTwo from "./pages/task2";

export default function App() {
  return (
    <Router>
      <Route path="/"        component={Home} />
      <Route path="/task-1"  component={TaskOne} />
      <Route path="/task-2"  component={TaskTwo} />
    </Router>
  )
}