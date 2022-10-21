import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { Delivery } from "../../../src/client/pages/Delivery";

describe("Delivery", () => {
  it("Delivery рендерится статически", () => {
    render(<Delivery />);

    expect(screen.queryByText("Delivery")).toBeInTheDocument();
  });
});
