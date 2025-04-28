import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Add from "./components/add/Add";
import List from "./components/list/List";
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CounterChart from "./components/chart/CounterChart";
import BottomNavBar from "./BottomNavBar";
import "./app.css";

function MainContent() {
  const location = useLocation();
  const hideBottomNavRoutes = ["/add"];

  const shouldHideBottomNav = hideBottomNavRoutes.includes(location.pathname);

  return (
    <div className="App">
      <Header />
      <div className="content m-3">
        <Routes>
          <Route exact path="/" Component={List}></Route>
          <Route exact path="/counter_chart" Component={CounterChart}></Route>
          <Route path="/add" Component={Add}></Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
      {!shouldHideBottomNav && <BottomNavBar />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}
