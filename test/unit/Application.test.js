import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import { Application } from "../../src/client/Application";

describe("Навигация в приложении", () => {
  it("В шапке отображаются ссылки на страницы магазина, и на корзину", () => {
    const initState = { cart: {} };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    expect(
      screen.queryByRole("link", { name: /catalog/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: /delivery/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: /contacts/i })
    ).toBeInTheDocument();

    expect(screen.queryByRole("link", { name: /cart/i })).toBeInTheDocument();
  });

  it("При клике по ссылках меняются страницы", () => {
    const initState = { cart: {} };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    /**По умолчанию главная страница */
    expect(
      screen.queryByText(/welcome to example store!/i)
    ).toBeInTheDocument();

    /**Переход на страницу Catalog */
    fireEvent.click(screen.queryByText("Catalog"));

    expect(
      screen.queryByRole("heading", { name: /catalog/i })
    ).toBeInTheDocument();

    /**Переход на страницу Delivery */
    fireEvent.click(screen.queryByText("Delivery"));

    expect(
      screen.queryByRole("heading", { name: /delivery/i })
    ).toBeInTheDocument();

    /**Переход на страницу Contacts */
    fireEvent.click(screen.queryByText("Contacts"));

    expect(
      screen.queryByRole("heading", { name: /contacts/i })
    ).toBeInTheDocument();

    /**Переход на страницу Cart */
    fireEvent.click(screen.queryByText("Cart"));

    expect(
      screen.queryByRole("heading", { name: /shopping cart/i })
    ).toBeInTheDocument();

    /**Возврат на главную страницу по названию магазина */
    fireEvent.click(screen.queryByText("Example store"));

    expect(
      screen.queryByText(/welcome to example store!/i)
    ).toBeInTheDocument();
  });
});
