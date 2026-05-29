import { Navigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Welcome back</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">Log in to your board</h1>
        </div>
        <LoginForm />
      </section>
    </main>
  );
};

export default LoginPage;
