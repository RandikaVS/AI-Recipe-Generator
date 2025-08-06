import React from "react"

function Footer() {
  return (
    <>
      <footer
        style={{ height: "60vh", backgroundColor: "#efc81a", color: "#2e266f" }}
        className="d-flex flex-column justify-content-center align-items-center animate__animated animate__fadeIn"
      >
        <h1 className="fs-1" style={{ color: "#2e266f" }}>
          Eat, Cook, Repeat
        </h1>
        <p className="fs-6">Find best recipe by entering ingredients!</p>

        <p className="mt-3">
          Made by{" "}
          <a
            className="text-decoration-none fs-6"
            style={{ color: "#2e266f" }}
            href="https://github.com/alkarim99"
          >
            Sahan Randika
          </a>
        </p>
      </footer>
    </>
  )
}

export default Footer
