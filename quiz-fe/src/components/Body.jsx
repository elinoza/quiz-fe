import React from "react";
import { Container, Button, Form, Row, Col, Image } from "react-bootstrap";
import { GiTrophyCup } from "react-icons/gi";

// -in the first page there should be name and start buttton
// -start fires function-fetch/post-start &retrieves - first question
// -2nd page the should be question, answers, next button
// -next button  className="shadow"fires function -fetch/post-answer id &retrieves - 2nd question
// -last page there should be score page

class Body extends React.Component {
  state = {
    intervalId: 0,
    remainingTime: 10,
    timeOut:false,
    questions: [],
    start: "false",
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

  updateField = (e) => {
    let body = { ...this.state.body };
    let currentid = e.currentTarget.id;
    console.log(e.currentTarget.id);

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
      console.log(response);
      if (response.ok) {
        let examInfo = await response.json();
        let questions = examInfo.questions;

        console.log("examInfo:", questions);

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

  submitForm = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    let newIntervalId;
    if (this.state.remainingTime > 0) {
      newIntervalId = setInterval(() => {
        this.timer();
      }, 1000);
    }
    this.setState({ intervalId: newIntervalId });

    this.getQuestions();
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
    const url = process.env.REACT_APP_Url;
    //const url = `http://localhost:3005/exams`;
    let response = await fetch(`${url}/${this.state.examInfo._id}`);
    let examInfo = await response.json();
    console.log(examInfo, this.state.remainingTime);
    this.setState({ score: examInfo });
  };
  nextQuo = async () => {
    try {
      const url = process.env.REACT_APP_Url;
      //const url = `http://localhost:3005/exams`;
      let response = await fetch(`${url}/${this.state.examInfo._id}/answer`, {
        method: "POST",
        body: JSON.stringify(this.state.answers),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
      console.log(response);
      if (response.ok) {
        let questionIndex = this.state.answers.question;
        let answers = { ...this.state.answers };
        if (questionIndex === this.state.questions.length - 1) {
          this.setState({ start: "finish" });
          this.getResults();
        } else {
          questionIndex += 1;
          answers.question = questionIndex;
          this.setState({ answers: answers });
        }
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
  timer = () => {
    let remainingTime = this.state.remainingTime;

    this.setState({ remainingTime: remainingTime - 1 });

    console.log(this.state.remainingTime);
    if (this.state.remainingTime === 0) {
      clearInterval(this.state.intervalId);
      this.getResults()
      this.setState({start:"finish", timeOut :true})
    }
  };

  render() {
    return (
      <Container className=" align-items-center justify-content-center   app mt-5  ">
        <div className=" border-bottom d-flex">
          <h6 className="d-inline"> You should answer 5 question</h6>
          <h6 className="d-inline ml-auto">
            {" "}
            Remaining time: {this.state.remainingTime} seconds
          </h6>
        </div>
        {this.state.start === "false" && (
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
                  {this.state.body.candidateName && (
                    <Button className="shadow" type="submit">
                      START
                    </Button>
                  )}
                </Form>
              </Col>
            </Row>
          </div>
        )}

        {this.state.start === "true" && (
          <div>
            <div className="question my-5">
              <h5>{this.state.questions[this.state.answers.question].text}</h5>
              {/* {!this.state.questions[this.state.answers.question].img === null && <Image src="holder.js/171x180" rounded />} */}
            </div>
            <div className="answers  align-items-center justify-content-center  text-center my-5 ">
              <Row className="my-5">
                <Col xs={12} md={6}>
                  <Button value="0" onClick={this.next} className="shadow">
                    {
                      this.state.questions[this.state.answers.question]
                        .answers[0].text
                    }
                  </Button>{" "}
                </Col>
                <Col xs={12} md={6}>
                  <Button value="1" onClick={this.next} className="shadow">
                    {
                      this.state.questions[this.state.answers.question]
                        .answers[1].text
                    }
                  </Button>{" "}
                </Col>
                <Col xs={12} md={6}>
                  <Button value="2" onClick={this.next} className="shadow">
                    {
                      this.state.questions[this.state.answers.question]
                        .answers[2].text
                    }
                  </Button>{" "}
                </Col>
                <Col xs={12} md={6}>
                  <Button value="3" onClick={this.next} className="shadow">
                    {
                      this.state.questions[this.state.answers.question]
                        .answers[3].text
                    }
                  </Button>{" "}
                </Col>
              </Row>
            </div>
            {this.state.answers.answer != null && (
              <Button onClick={this.nextQuo} className="shadow">
                NEXT{" "}
              </Button>
            )}
          </div>
        )}
        {this.state.start === "finish" && (
          <>
            <div className=" d-flex flex-flow-column align-items-center justify-content-center  text-center my-5 finish">
             <h1 className="d-block">{ this.state.timeOut === true ? "TIME IS OUT! ": "FINISHED" } </h1>

              <div>
                <GiTrophyCup
                  style={{
                    fontSize: "100px",
                    color: "#DD6E42",
                    textShadow: "20px 20px 50px yellow",
                  }}
                />
              </div>

              <h3>YOUR SCORE </h3>
            </div>
            <div className="d-flex flex-flow-column align-items-center justify-content-center  text-center my-5 finish">
              <h1> {this.state.score.totalScore}</h1>
            </div>

            <Button
              className="shadow"
              onClick={() => window.location.reload(false)}
            >
              REPLAY
            </Button>
          </>
        )}
      </Container>
    );
  }
}
export default Body;
