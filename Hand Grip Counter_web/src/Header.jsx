import { Button, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <Navbar className="px-3" expand="lg" style={{ backgroundColor: "#0d6efd" }} data-bs-theme="dark">
      <Navbar.Brand href="/">
        <b>
          <Link style={{ textDecoration: "none", color: "white" }} to="/">
            Hand Grip Counter
          </Link>
        </b>
      </Navbar.Brand>
      <Nav className="justify-content-end">
        <Nav.Link>
          <Button style={{ backgroundColor: "#20c997", borderColor: "#20c997" }}>
            <Link style={{ textDecoration: "none", color: "white" }} to="/add">
              <span className="text-white">Add New</span>
            </Link>
          </Button>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
