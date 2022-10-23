import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import { Cart } from "../../../src/client/pages/Cart";
import { Application } from "../../../src/client/Application";
import { initStore } from "../../../src/client/store";

describe("Корзина", () => {
  it("в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней", () => {
    const initState = {
      cart: { 1: {}, 2: {} },
    };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    expect(
      screen.queryByRole("link", { name: /cart \(2\)/i })
    ).toBeInTheDocument();
  });

  it("в корзине должна отображаться таблица с добавленными в нее товарами;", () => {
    const initState = {
      cart: {
        1: { name: "товар1", price: "1", count: "3" },
        2: { name: "товар2", price: "2", count: "2" },
      },
    };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.queryByTestId("1")).toBeInTheDocument();
    expect(screen.queryByTestId("2")).toBeInTheDocument();
  });

  it("для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа", () => {
    const initState = {
      cart: {
        1: { name: "товар1", price: "1", count: "3" },
        2: { name: "товар2", price: "2", count: "2" },
      },
    };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.queryByRole("cell", { name: "товар1" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "товар2" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "$1" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "$2" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "3" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "2" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "$7" })).toBeInTheDocument();
  });

  it("в корзине должна быть кнопка очистить корзину, по нажатию на которую все товары должны удаляться", () => {
    const cart = {
      getState: () => ({
        1: { name: "товар1", price: "1", count: "3" },
        2: { name: "товар2", price: "2", count: "2" },
      }),
    };

    const store = initStore(null, cart);

    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    const clearBtn = screen.getByRole("button", {
      name: "Clear shopping cart",
    });
    fireEvent.click(clearBtn);

    screen.logTestingPlaygroundURL();

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("если корзина пустая, должна отображаться ссылка на каталог товаров", () => {
    const initState = {
      cart: {},
    };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.getByRole("link", { name: "catalog" })).toBeInTheDocument();
  });
});
