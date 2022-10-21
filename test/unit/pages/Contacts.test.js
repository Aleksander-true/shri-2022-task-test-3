import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { Contacts } from "../../../src/client/pages/Contacts";

describe("Contacts", () => {
  it("Contacts рендерится статически", () => {
    render(<Contacts />);

    expect(screen.queryByText("Contacts")).toBeInTheDocument();
  });
});
