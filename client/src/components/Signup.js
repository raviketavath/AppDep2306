import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  let firstNameInputRef = useRef();
  let lastNameInputRef = useRef();
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let profilePicInputRef = useRef();

  let [profilePic, setProfilePic] = useState("./images/profilePic.png");

  //send data through the express.json method
  let sendSignupDataToServer = async () => {
    let myHeader = new Headers();
    myHeader.append("content-type", "application/json");

    let dataToSend = {
      fn: firstNameInputRef.current.value,
      ln: lastNameInputRef.current.value,
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
      profilePic: profilePicInputRef.current.value,
    };
    let reqOptions = {
      method: "POST",
      headers: myHeader,
      body: JSON.stringify(dataToSend),
    };

    let JSONData = await fetch("http://localhost:1234/Signup", reqOptions);
    let JSOData = await JSONData.json();
    console.log(JSOData);
  };

  //send the data through urlEncoded method

  let sendSignupDataTOServerURLEncoded = async () => {
    let myHeader = new Headers();
    myHeader.append("content-type", "application/x-www-form-urlencoded");

    let dataToSend = new URLSearchParams();
    dataToSend.append("fn", firstNameInputRef.current.value);
    dataToSend.append("ln", lastNameInputRef.current.value);
    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);
    dataToSend.append("profilePic", profilePicInputRef.current.value);

    let reqOptons = {
      method: "POST",
      headers: myHeader,
      body: dataToSend,
    };

    let JSONData = await fetch("http://localhost:1234/Signup", reqOptons);
    let JSOData = await JSONData.json();
    console.log(JSOData);
  };
  let sendSignupDataTOServerFormData = async () => {
    let dataToSend = new FormData();
    dataToSend.append("fn", firstNameInputRef.current.value);
    dataToSend.append("ln", lastNameInputRef.current.value);
    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);

    for (let i = 0; i < profilePicInputRef.current.files.length; i++) {
      dataToSend.append("profilePic", profilePicInputRef.current.files[i]);
    }

    let reqOptons = {
      method: "POST",
      body: dataToSend,
    };

    let JSONData = await fetch("http://localhost:1234/signup", reqOptons);
    let JSOData = await JSONData.json();
     alert(JSOData.msg);
    console.log(JSOData);
  };

  return (
    <div className="App">
      <form>
        <div>
          <label>First Name</label>
          <input ref={firstNameInputRef}></input>
        </div>
        <div>
          <label>Last Name</label>
          <input ref={lastNameInputRef}></input>
        </div>
        <div>
          <label>Email</label>
          <input ref={emailInputRef}></input>
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>
        <div>
          <label>profilePic</label>
          <input
            ref={profilePicInputRef}
            type="file"
            onChange={() => {
              let selectedFileURL = URL.createObjectURL(
                profilePicInputRef.current.files[0]
              );
              setProfilePic(selectedFileURL);
            }}
          ></input>
        </div>
        <div>
          <img className="profilePicPreview" src={profilePic} alt=""></img>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              sendSignupDataToServer();
            }}
          >
            Signup(JSON)
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              sendSignupDataTOServerURLEncoded();
            }}
          >
            Signup(URLencoded)
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              sendSignupDataTOServerFormData();
            }}
          >
            Signup(FormData)
          </button>
        </div>
      </form>
      <Link to="/">Login</Link>
    </div>
  );
}

export default Signup;
