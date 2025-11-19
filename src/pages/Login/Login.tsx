import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import netflix_spin from "../../assets/netflix_spinner.gif";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [signState, setSignState] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [authError, setAuthError] = useState<string>("");
  const { login, signUp } = useAuth();

  const validateEmail = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};


  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (signState === "Sign Up") {
      if (!name.trim()) {
        newErrors.name = "Name is required";
      } else if (name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (signState === "Sign Up" && password.length < 8) {
      newErrors.password = "Password must be at least 8 characters for sign up";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (signState === "Sign In") {
        await login(email, password);
      } else {
        await signUp(name, email, password);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      if (error.code === "auth/email-already-in-use") {
        setAuthError("This email is already registered. Please sign in instead.");
      } else if (error.code === "auth/weak-password") {
        setAuthError("Password is too weak. Please use a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        setAuthError("Invalid email address. Please check your email.");
      } else if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setAuthError("Invalid email or password. Please try again.");
      } else if (error.code) {
        const errorMsg = error.code.split("/")[1]?.split("-")?.join(" ") || "Authentication failed";
        setAuthError(errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1));
      } else {
        setAuthError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors({ ...errors, name: undefined });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ ...errors, email: undefined });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: undefined });
    }
  };

  return loading ? (
    <div className="login-spinner">
      <img src={netflix_spin} alt="loading" />
    </div>
  ) : (
    <div className="login">
      <img src={logo} className="login-logo" alt="logo" />
      <div className="login-form">
        <h1>{signState}</h1>
        <form onSubmit={handleSubmit}>
          {signState === "Sign Up" && (
            <div className="input-wrapper">
              <input
                value={name}
                onChange={handleNameChange}
                type="text"
                placeholder="Your Name"
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          )}
          <div className="input-wrapper">
            <input
              value={email}
              onChange={handleEmailChange}
              placeholder="Email"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="input-wrapper password-wrapper">
            <input
              value={password}
              onChange={handlePasswordChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={errors.password ? "input-error" : ""}
            />
            <span
              className="show-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          {authError && (
            <div className="auth-error-message">
              {authError}
            </div>
          )}
          <button type="submit" disabled={loading}>
            {signState}
          </button>
        </form>

        <div className="form-switch">
          {signState === "Sign In" ? (
            <p>
              New to Netflix?{" "}
              <span
                onClick={() => {
                  setSignState("Sign Up");
                  setErrors({});
                  setAuthError("");
                  setName("");
                }}
              >
                Sign Up Now
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setSignState("Sign In");
                  setErrors({});
                  setAuthError("");
                  setName("");
                }}
              >
                Sign In Now
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
