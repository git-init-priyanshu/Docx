import { Link } from "react-router-dom";

export default function Login() {
  return (
    <form>
      <div className="form-title">Login</div>
      <div className="group">
        <input type="email" />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Email</label>
      </div>
      <div className="group">
        <input type="password" />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Password</label>
      </div>
      <button type="button" className="button buttonBlue">
        Subscribe
        <div className="ripples buttonRipples">
          <span className="ripplesCircle"></span>
        </div>
      </button>
      <p className="footer">
        Don't have an account? <Link to={"/signup"}>Signup</Link>
      </p>
    </form>
  );
}
