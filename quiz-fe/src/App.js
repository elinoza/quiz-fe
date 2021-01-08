import React from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./css/quiz.css"
import {Container, Row, Col} from "react-bootstrap"
import NavBar from "./components/NavBar"
import Body from "./components/Body"


function App() {
  return (
    <div >
  <Container className="main my-5">
 
    <Row>
      <Col  >
      <NavBar/>
        <Body />
      </Col>
    </Row>
        
      
    </Container>
    </div>
  );
}

export default App;