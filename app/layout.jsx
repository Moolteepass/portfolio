import "@/assets/styles/globals.css"
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

const MainLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}

export default MainLayout
