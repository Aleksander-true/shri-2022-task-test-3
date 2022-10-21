import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { Home } from "../../../src/client/pages/Home";

describe("Home", () => {
  it("Home рендерится статически", () => {
    render(<Home />);

    screen.logTestingPlaygroundURL();

    expect(screen.queryByText("Quickly")).toBeInTheDocument();
  });
});
