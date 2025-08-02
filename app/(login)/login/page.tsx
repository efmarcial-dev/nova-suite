import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (access) {
    // If the user is already logged in, redirect to the dashboard
    redirect("/dashboard");
  }

  return (
    <LoginForm />
  );
}