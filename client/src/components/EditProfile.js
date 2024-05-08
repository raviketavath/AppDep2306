import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function EditProfile() {
  let firstNameInputRef = useRef();
  let lastNameInputRef = useRef();
  // let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let profilePicInputRef = useRef();

  let [profilePic, setProfilePic] = useState("./images/profilePic.png");
  let loc = useLocation();
  console.log("inside the editProfile");
  console.log(loc);

  useEffect(() => {
    firstNameInputRef.current.value = loc.state.firstName;
    lastNameInputRef.current.value = loc.state.lastName;
    passwordInputRef.current.value = loc.state.password;
    // setProfilePic(`http://localhost:1234/${loc.state.profilePic}`);
    console.log("useEffect is calling");
  }); 
  useEffect(() => {
    // setProfilePic(`http://localhost:1234/${loc.state.profilePic}`);
  }, [profilePic]);
  //send data through the express.json method

  let sendUpdatedDataTOServer = async () => {
    let dataToSend = new FormData();
    dataToSend.append("fn", firstNameInputRef.current.value);
    dataToSend.append("ln", lastNameInputRef.current.value);
    dataToSend.append("email", loc.state.email);
    dataToSend.append("password", passwordInputRef.current.value);

    for (let i = 0; i < profilePicInputRef.current.files.length; i++) {
      dataToSend.append("profilePic", profilePicInputRef.current.files[i]);
    }

    let reqOptons = {
      method: "PATCH",
      body: dataToSend,
    };

    let JSONData = await fetch("/updateDetails", reqOptons);
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
              sendUpdatedDataTOServer();
            }}
          >
            Update
          </button>
        </div>
      </form>
      <Link to="/">Login</Link>
    </div>
  );
}

export default EditProfile;
