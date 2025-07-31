import React from "react";
import { Navbar, Container } from "react-bootstrap";

function Navigationbar() {
    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand>
                    <strong>Pipeline-Editor</strong>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default Navigationbar;
