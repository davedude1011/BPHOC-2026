import { Route, Router } from "@solidjs/router";
import Home from "./pages/home";
import TaskOne from "./pages/task1";
import TaskTwo from "./pages/task2";
import TaskThree from "./pages/task3";
import TaskFour from "./pages/task4";
import TaskFive from "./pages/task5";

export default function App() {
  return (
    <Router>
      <Route path="/"        component={Home} />
      <Route path="/task-1"  component={TaskOne} />
      <Route path="/task-2"  component={TaskTwo} />
      <Route path="/task-3"  component={TaskThree} />
      <Route path="/task-4"  component={TaskFour} />
      <Route path="/task-5"  component={TaskFive} />
    </Router>
  )
}