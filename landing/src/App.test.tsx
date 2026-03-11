import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import App from "./App"

const landingStyles = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8")

describe("landing responsive rendering", () => {
  it("renders benchmark tabs from the benchmark data", () => {
    render(<App />)

    expect(screen.getByRole("button", { name: "Alibaba" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Netflix" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Jobs" })).toBeInTheDocument()
  })

  it("renders install modes for all supported environments", () => {
    render(<App />)

    expect(screen.getAllByRole("button", { name: "Claude Code" }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole("button", { name: "Codex CLI" }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole("button", { name: "项目级安装" }).length).toBeGreaterThan(0)
  })

  it("renders a dedicated mobile excuses comparison view", () => {
    render(<App />)

    expect(screen.getByTestId("excuses-mobile")).toBeInTheDocument()
  })

  it("renders both desktop and mobile scenario comparison containers", () => {
    render(<App />)

    expect(screen.getByTestId("scenarios-desktop")).toBeInTheDocument()
    expect(screen.getByTestId("scenarios-mobile")).toBeInTheDocument()
  })

  it("guards mobile-only visibility rules against desktop duplication", () => {
    expect(landingStyles).toContain(".desktop-only { display: block !important; }")
    expect(landingStyles).toContain(".mobile-only { display: none !important; }")
    expect(landingStyles).toContain(".desktop-only { display: none !important; }")
    expect(landingStyles).toContain(".mobile-only { display: grid !important; }")
  })

  it("limits dual-view rendering to the two comparison sections", () => {
    render(<App />)

    expect(document.querySelectorAll(".mobile-only").length).toBe(2)
    expect(document.querySelectorAll(".desktop-only").length).toBe(2)
  })
})
