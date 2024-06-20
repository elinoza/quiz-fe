import React from "react";
import { Container, Button, Form, Row, Col, Image } from "react-bootstrap";
import { GiTrophyCup } from "react-icons/gi";
import { SiTimescale } from "react-icons/si";
import { MdReplay} from "react-icons/md";

// -in the first page there should be name and start buttton
// -start fires function-fetch/post-start &retrieves - first question
// -2nd page the should be question, answers, next button
// -next button  className="shadow"fires function -fetch/post-answer id &retrieves - 2nd question
// -last page there should be score page

class Body extends React.Component {
  state = {
    quoNum: 1,
    intervalId: 0,
    remainingTime: 10,
    timeOut: false,
    questions: [],
    start: "pre",
    examInfo: [],
    body: {
      candidateName: "",
    },
    loading: false,
    errMessage: "",
    answers: {
      question: 0,
      answer: null,
    },
    score: 0,
  };

  componentDidMount = () => {
    const myTimeout = setTimeout(() => this.setState({ start: "false" }), 5000);
  };
  updateField = (e) => {
    let body = { ...this.state.body };
    let currentid = e.currentTarget.id;
  

    body[currentid] = e.currentTarget.value;
    this.setState({ body: body });
  };

  fetch = async () => {
    try {
      const url = process.env.REACT_APP_Url;
      //const url = "http://localhost:3005/exams";
      let response = await fetch(`${url}/start`, {
        method: "POST",
        body: JSON.stringify(this.state.body),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
  
      if (response.ok) {
        let examInfo = await response.json();
        let questions = examInfo.questions;
        this.setState({ remainingTime: examInfo.totalDuration });

        return examInfo;
      } else {
        console.log("an error occurred");
        let error = await response.json();
        this.setState({
          errMessage: error.message,
          loading: false,
        });
      }
    } catch (e) {
      console.log(e); // Error
      this.setState({
        errMessage: e.message,
        loading: false,
      });
    }
  };

  afterSubmit = () => {
    let newIntervalId;
    if (this.state.remainingTime > 0) {
      newIntervalId = setInterval(() => {
        this.timer();
      }, 1000);
    }
    this.setState({ intervalId: newIntervalId });

    this.getQuestions();
  };

  submitForm = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const myTimeout = setTimeout(() => this.afterSubmit(e), 2500);
  };
  manageState = (examInfo) => {
    this.setState({
      examInfo: examInfo,
      questions: examInfo.questions,
      start: "true",
    });
  };
  getQuestions = async () => {
    let examInfo = await this.fetch();
    this.manageState(examInfo);
  };

  next = async (e) => {
    let answers = { ...this.state.answers };
    answers.answer = parseInt(e.currentTarget.value);
    this.setState({ answers: answers });
  };

  getResults = async () => {
    clearInterval(this.state.intervalId);
    const url = process.env.REACT_APP_Url;
    //const url = `http://localhost:3005/exams`;
    let response = await fetch(`${url}/${this.state.examInfo._id}`);
    let examInfo = await response.json();
    this.setState({ score: examInfo,start: "finish",  });
  };
  nextQuo = async () => {
    try {
      const url = process.env.REACT_APP_Url;
      let quoNum = this.state.quoNum;
      //const url = `http://localhost:3005/exams`;
      let response = await fetch(`${url}/${this.state.examInfo._id}/answer`, {
        method: "POST",
        body: JSON.stringify(this.state.answers),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
      if (response.ok) {
        let questionIndex = this.state.answers.question;
        let answers = { ...this.state.answers };
        if (questionIndex === this.state.questions.length - 1) {
          this.getResults();
     
         
        } else {
          questionIndex += 1;
          answers.question = questionIndex;
          answers.answer = null;
          this.setState({ answers: answers, quoNum: quoNum + 1 });

        }
      } else {
  
        let error = await response.json();
        this.setState({
          errMessage: error.message,
          loading: false,
        });
      }
    } catch (e) {
      console.log(e); // Error
      this.setState({
        errMessage: e.message,
        loading: false,
      });
    }
  };
  timer = () => {
    let remainingTime = this.state.remainingTime;

    this.setState({ remainingTime: remainingTime - 1 });

    if (this.state.remainingTime === 0) {

      this.getResults();
      this.setState({ timeOut: true });
    }
  };

  render() {
    return (
      <Container className="  main app my-5   ">
        {this.state.start === "true" && (
          <div className="  d-flex quoNum p-2">
            Question {this.state.quoNum} of {this.state.questions.length}
            <div className=" timer d-inline ml-auto text-center">
              {this.state.remainingTime}
            </div>
          </div>
        )}
        {this.state.start === "pre" && (
          <div className=" answers  quiz  align-items-center justify-content-center  text-center my-5">
            <Row className="my-5 ">
              <Col >
                <div>
                  {" "}
                  <h1>QUIZ GAME</h1>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {this.state.start === "false" && (
          <div className="answers   align-items-center justify-content-center  text-center my-5">
            <Row >
              <Col >
                <div
                  className={this.state.loading ? "loading wrapper" : "wrapper"}
                >
                  {" "}
                  <svg
                    className="svg"
                    width="100px"
                    height="100px"
                    viewBox="0 0 100 100"
                  >
                    <circle className="circle" cx="50" cy="50" r="48" />
                  </svg>
                  <div className="dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <Form className="submitForm" onSubmit={this.submitForm}>
                  <Form.Group controlId="name">
                    <Form.Label>Your Name & Surname </Form.Label>
                    <Form.Control
                      id="candidateName"
                      type="text"
                      placeholder="Enter your name please"
                      value={this.state.body.candidateName}
                      onChange={this.updateField}
                      className="form-control-sm"
                    />
                  </Form.Group>
                  {this.state.body.candidateName && (
                    <div className="btn-start "> <Button className="shadow " type="submit">
                    Start
                   </Button></div>
                   
                  )}
                </Form>
              </Col>
            </Row>
          </div>
        )}

        {this.state.start === "true" && (
          <div className="questions-wrapper">
            <div className="question my-2">
              {this.state.questions[this.state.answers.question].text}
              {/* {!this.state.questions[this.state.answers.question].img === null && <Image src="holder.js/171x180" rounded />} */}
            </div>
            <div className="answers  align-items-center justify-content-center  text-center my-5 ">
              <Row className="my-5">
                <Col xs={12} md={6}>
                  <Button value="0" onClick={this.next} className="shadow btn-block">
                    {
                      this.state.questions[this.state.answers.question]
                        .answers[0].text
                    }
                  </Button>{" "}
                </Col>
                <Col xs={12} md={6}>
                  <Button value="1" onClick={this.next} className="shadow btn-block">
                    {
                      this.state.questions[this.state.answers.question]
                        .answers[1].text
                    }
                  </Button>{" "}
                </Col>
                <Col xs={12} md={6}>
                  <Button value="2" onClick={this.next} className="shadow  btn-block">
                    {
                      this.state.questions[this.state.answers.question]
                        .answers[2].text
                    }
                  </Button>{" "}
                </Col>
                <Col xs={12} md={6}>
                  <Button value="3" onClick={this.next} className="shadow btn-block">
                    {
                      this.state.questions[this.state.answers.question]
                        .answers[3].text
                    }
                  </Button>{" "}
                </Col>
              </Row>
            </div>
            {this.state.answers.answer != null && (
              <div className="  text-center my-3 abs-btn ">
                <Button onClick={this.nextQuo} className=" shadow">
                  Next{" "}
                </Button>
              </div>
            )}
          </div>
        )}
        {this.state.start === "finish" && (
          <div>
            <div className=" flex-flow-column align-items-center justify-content-center  text-center my-5 ">
              <div className="finish">
                {this.state.timeOut === false ? (
                  <div>
                    <h1 className="d-block">"Finished"</h1>

                    <div className="my-3 ">
                      <GiTrophyCup
                        style={{
                          fontSize: "100px",
                          color: "#DD6E42",
                          textShadow: "20px 20px 50px yellow",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="d-block">"Ooopss... Time is out "</h1>
                    <div className="my-3 ">
                      <SiTimescale
                        style={{
                          fontSize: "100px",
                          color: "#DD6E42",
                          textShadow: "20px 20px 50px yellow",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="score">
              <h3>Your Score </h3>
              <h1 className="bold"> {this.state.score.totalScore}</h1>
              </div>
            </div>
            <div className="d-flex flex-flow-column align-items-center justify-content-center  text-center my-3 ">
            
              <Button
                className="shadow "
                onClick={() => window.location.reload(false)}
              >
                
              Replay <MdReplay   style={{
                          fontSize: "20px",
                          color: "#DD6E42",
                          textShadow: "20px 20px 50px yellow",
                        }} />
              </Button>
            </div>
          </div>
        )}
      </Container>
    );
  }
}
export default Body;
