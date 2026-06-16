import { render, screen } from "@testing-library/react";
import App from "./App";

test("рендерит экран входа без токена", () => {
  render(<App />);
  expect(screen.getByText("Мед-аналитика")).toBeInTheDocument();
});
