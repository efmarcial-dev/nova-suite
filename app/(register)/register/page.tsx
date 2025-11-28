import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (access) {
    // If the user is already logged in, redirect to the dashboard
    redirect("/dashboard");
  }

  return (
    <RegisterForm />
  );
}