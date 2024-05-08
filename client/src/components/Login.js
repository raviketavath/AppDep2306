import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let navigate = useNavigate();

  useEffect(() => {
    // removing apiendpoint for generating build folder 
    // axios.defaults.baseURL = "http://localhost:1234";
    axios.defaults.baseURL = "";
    axios.defaults.headers.common['Authorization'] = localStorage.getItem("token");
    emailInputRef.current.value = localStorage.getItem("email");
    passwordInputRef.current.value = localStorage.getItem("password");
  });

  let validateCredentials = async () => {
    let dataToSend = new FormData();

    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);

    let reqOptons = {
      method: "POST",
      body: dataToSend,
    };

    let JSONData = await fetch(
      "/validateLogin",
      reqOptons
    );
    let JSOData = await JSONData.json();
    if (JSOData.status === "Success") {
      console.log(JSOData);
      localStorage.setItem("email", emailInputRef.current.value);
      localStorage.setItem("password", passwordInputRef.current.value);
      // localStorage.clear();
      localStorage.setItem("token", JSOData.token);
      navigate("/Home", { state: JSOData });
    } else {
      alert(JSOData.msg);
    }

    // console.log(JSOData);
  };
  let validateCredentialsThruAxios = async () => {
    let dataToSend = new FormData();

    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);

    let response= await axios.post("/validateLogin",dataToSend);
    console.log(response)

    
    if (response.data.status === "Success") {
      console.log(response.data);
      // localStorage.setItem("email", emailInputRef.current.value);
      // localStorage.setItem("password", passwordInputRef.current.value);
      // localStorage.clear();
      localStorage.setItem("token", response.data.token);
      navigate("/Home", { state: response.data});
    } else {
      alert(response.data.msg);
    }

    console.log(response.data);
  };

  return (
    <div className="App">
      <form>
        <h2>Login</h2>
        <div>
          <label>Email</label>
          <input ref={emailInputRef}></input>
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              // validateCredentials();
              validateCredentialsThruAxios();
            }}
          >
            Login
          </button>
        </div>
      </form>
      <Link to="/Signup">Signup</Link>
    </div>
  );
}

export default Login;
