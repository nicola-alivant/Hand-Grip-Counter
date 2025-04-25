import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Add from "./components/add/Add";
import List from "./components/list/List";
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Chart from "./components/chart/Chart";
import BottomNavBar from "./BottomNavBar";
import "./app.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div className="content m-3">
          <Routes>
            <Route exact path="/" Component={List}></Route>
            <Route exact path="/chart" Component={Chart}></Route>
            <Route path="/add" Component={Add}></Route>
          </Routes>
          <ToastContainer position="top-right" autoClose={2000} />
        </div>
        <BottomNavBar />
      </Router>
    </div>
  );
}

export default App;
