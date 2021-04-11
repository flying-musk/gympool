import "../scss/Login.scss";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import basicRequest from "../apis/api.js";
import { open, close } from "./Spinner";
import { HashRouter as Router, Link, useHistory } from "react-router-dom";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dirty, setDirty] = useState({ email: false, password: false });
  const [invalidForm, setInvalidForm] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    dirty.email === false && setDirty({ ...dirty, email: true });
    dirty.password === false && setDirty({ ...dirty, password: true });
    validForm();
  }, [email, password]);

  function validForm() {
    let emailInvalid = false;
    let passwordInvalid = false;
    if (dirty.email === true) {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      emailInvalid = !regex.test(email);
    }
    if (dirty.password === true) {
      const regex = /\w+/;
      passwordInvalid = !regex.test(password);
    }
    setInvalidForm({ email: emailInvalid, password: passwordInvalid });

    return !(invalidForm.email || invalidForm.password); // true=ok;false=ng
  }
  function login() {
    let isValid = validForm();
    if (isValid) {
      let url = "/login/";
      let o = { email, password };
      open();
      basicRequest
        .post(url, o)
        .then((response) => {
          Swal.fire("嗨", "歡迎回來!", "success").then(() => {
            // token
            let token = "jwt " + response.data.token;
            this.$store.commit("setToken", token);
            // user
            let user = response.data.user;
            this.$store.commit("setUser", user);
            history.push("/index");
          });
        })
        .catch(function (error) {
          const title = error.response.status.toString();
          const msg = JSON.stringify(error.response.data);
          Swal.fire(title, msg, "error");
          console.error(error);
        })
        .finally(() => {
          close();
        });
    }
  }
  function handleChange(event) {
    switch (event.target.name) {
      case "email":
        setEmail(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      default:
        break;
    }
  }

  return (
    <div className="login container">
      <pre>dirty{JSON.stringify(dirty, null, 2)}</pre>
      <pre>invalidForm{JSON.stringify(invalidForm, null, 2)}</pre>
      <pre>
        email:{email}
        password:{password}
      </pre>
      <p>用電子郵件登入</p>
      <div className="form-group">
        <input
          name="email"
          type="text"
          className={`textbox ${invalidForm.email ? "is-invalid" : null}`}
          placeholder="電子信箱"
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <input
          name="password"
          type="password"
          className={`textbox ${invalidForm.password ? "is-invalid" : null}`}
          placeholder="密碼"
          onChange={handleChange}
          vue-keydown-enter="login"
        />
      </div>
      <div className="form-group">
        <Router>
          <p>
            <Link to="/resetPassword">忘記密碼?</Link>
          </p>
        </Router>
      </div>
      <div className="button-box">
        <button className="btn blue" onClick={login}>
          送出
        </button>
      </div>
    </div>
  );
}

export default Login;
