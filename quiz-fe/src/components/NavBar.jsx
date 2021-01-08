import React from "react"
import {Navbar} from "react-bootstrap"
import { GiBrain } from 'react-icons/gi'
import { IoClose } from 'react-icons/io5'


class NavBar extends React.Component{
    render(){
        return(
<>

  <Navbar className="shadow d-flex justify-content-between " style={{backgroundColor:"#C0D6DF"}}>
    <Navbar.Brand href="#home">
     <GiBrain style={{ fontSize:"32px", color:"#4F6D7A",boxShadow:"30px black"}}/>
    </Navbar.Brand>
   
    <h1 style={{color:"#4F6D7A",textShadow: "2px 2px 8px white"}}>QUIZ GAME</h1>
    <IoClose style={{fontSize:"32px",color:"#4F6D7A"}}/>

    
   
  </Navbar>
</>
        )
    }
    
}
export default NavBar