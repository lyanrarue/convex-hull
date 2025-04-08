import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

/**
 * Defines the Navigation bar component which has links to all important 
 * application routes.
 * @returns A navigations bar
 */
const NavigationBar = () => {

  return (
    <Navbar bg="light" expand="lg">
        <Container>
        <Navbar.Brand as={NavLink} to="/home">Convex Hull</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/aide">Application</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
  )

}

export default NavigationBar;