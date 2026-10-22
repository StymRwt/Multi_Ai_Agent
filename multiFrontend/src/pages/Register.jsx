import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import { clearAuthError, registerUser } from "../redux/slices/userSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((s) => s.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser({ name: name.trim(), email: email.trim(), password }));
    if (registerUser.fulfilled.match(result)) navigate("/", { replace: true });
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Your conversations are saved, so you can come back to them."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-white underline underline-offset-2">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField id="name" label="Name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
        <AuthField id="email" label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <AuthField id="password" label="Password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        <p className="-mt-2 text-xs text-fog-500">Use at least 8 characters.</p>
        {error && (
          <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-ink-950 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
