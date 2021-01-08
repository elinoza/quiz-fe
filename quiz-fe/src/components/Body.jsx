import React from "react"
import {Container,Button, Form, Row, Col} from "react-bootstrap"


// -in the first page there should be name and start buttton 
// -start fires function-fetch/post-start &retrieves - first question
// -2nd page the should be question, answers, next button
// -next button fires function -fetch/post-answer id &retrieves - 2nd question
// -last page there should be score page

class Body extends React.Component{

    state={
        start:false,
        examInfo:{
           
        },
        body : {
            candidateName:"" },
        loading:false,
        errMessage:''
        
    }
    
 
	updateField = (e) => {
        let body={...this.state.body}
        let currentid = e.currentTarget.id
		
		body[currentid] = e.currentTarget.value 
		this.setState({ body:body})
	}



    fetch =async ()=>{
       try{ 
       // const url=process.env.REACT_APP_Url
        const url="http://localhost:3005/exams"
        let response= await fetch(`${url}/start`, 
        { method: "POST",
          body: JSON.stringify(this.state.body),
		  headers: new Headers({
		 "Content-Type": "application/json"})

    })
    console.log(response)
        if (response.ok) {
            let examInfo = await response.json()
            
            console.log("examInfo:", examInfo)
            
         return examInfo

            }
        else{
        console.log("an error occurred")
        let error = await response.json()
        this.setState({
            errMessage: error.message,
            loading: false,
            
        })}
        
    }
    catch(e){
        console.log(e) // Error
			this.setState({
				errMessage: e.message,
				loading: false,
			})
    }
        }
        
        submitForm = (e) => {
            e.preventDefault()
            this.setState({ loading: true })
            this.getQuestions()
            
            
        }
        getQuestions=async ()=>{ let examInfo= await this.fetch();this.setState({ examInfo:examInfo,start:true})}
    
    render(){
        return(
            <Container className=" align-items-center justify-content-center   app mt-5  "  >
                <div className=" border-bottom d-flex">
                <h6 className="d-inline"> You should answer 5 question</h6>
                <h6 className="d-inline ml-auto"> Remaining time: 60 seconds</h6>
                </div>
                { !this.state.start ?
                <div className="answers  align-items-center justify-content-center  text-center my-5">
                    
                    <Row className="my-5">

                            <Col> 
                            <Form onSubmit={this.submitForm}>
                            <Form.Group controlId="name">
                                <Form.Label>Your Name & Surname </Form.Label>
                                <Form.Control 
                                id="candidateName"
                                type="text" 
                                placeholder="Enter your name please" 
                                value={this.state.body.candidateName}
                                 onChange={this.updateField}
                                />
                            </Form.Group>

                           
                            <Button variant="primary" type="submit">
                               START
                            </Button>
                            </Form></Col>
                            
                        </Row>
                    
                    </div> : 
                    <div>
                        <div className="question my-5">
                            
                        <h5>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi perferendis quibusdam quod vero ducimus recusandae aliquam praesentium dignissimos dolorem necessitatibus rem expedita aut, distinctio nisi consectetur maxime nostrum porro! Aspernatur.</h5>
                        
                        </div>
                    
                    <div className="answers  align-items-center justify-content-center  text-center my-5 ">
                        <Row className="my-5">
                            <Col xs={12} md={6}><Button/></Col>
                            <Col xs={12} md={6}><Button/></Col>
                            <Col xs={12} md={6}><Button/></Col>
                            <Col xs={12} md={6}><Button/></Col>
                        </Row>
                        </div>
                </div>
                }
                
            </Container>


        )
    }
    
}
export default Body