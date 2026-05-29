import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getApiFieldErrors, getApiErrorMessage } from "../../api/axios.js";
import { loginRequest } from "../../api/auth.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Spinner from "../ui/Spinner.jsx";

const LoginForm = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setErrors((current) => ({ ...current, [event.target.name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const data = await loginRequest(values);
      login(data);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);
      setErrors({
        ...fieldErrors,
        form: Object.keys(fieldErrors).length ? "" : getApiErrorMessage(error, "Login failed")
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />
        {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />
        {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password}</p> : null}
      </div>

      {errors.form ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errors.form}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? <Spinner size="sm" className="border-white/40 border-t-white" /> : "Log in"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Need an account?{" "}
        <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800">
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
