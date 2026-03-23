import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the Tic Tac Toe title and status", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /tic tac toe/i })).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(/turn:/i);
});
