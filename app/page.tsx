import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to dashboard since that's our main page
  redirect("/dashboard")
}
