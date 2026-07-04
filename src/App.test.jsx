import { render, screen } from "@testing-library/react";
import App from "./App";

test("рендерит экран входа без токена", async () => {
  render(<App />);
  // Страницы грузятся лениво (React.lazy), поэтому ждём появления текста.
  expect(await screen.findByText("Мед-аналитика")).toBeInTheDocument();
});
