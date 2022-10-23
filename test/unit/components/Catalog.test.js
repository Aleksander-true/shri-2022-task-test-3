import "@testing-library/jest-dom/extend-expect";

import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import { Catalog } from "../../../src/client/pages/Catalog";
import { Application } from "../../../src/client/Application";
import { Product } from "../../../src/client/pages/Product";
import { initStore } from "../../../src/client/store";

describe("Каталог", () => {
  it("Каталог рендерится ", () => {
    const initState = {
      cart: {},
      products: [],
    };
    const store = createStore(() => initState);

    render(
      <Provider store={store}>
        <Catalog />
      </Provider>
    );

    expect(
      screen.queryByRole("heading", { name: /catalog/i })
    ).toBeInTheDocument();
  });

  it("Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", () => {
    const initState = {
      cart: {},
      products: [
        { id: 1, name: "товар1", price: 100 },
        { id: 2, name: "товар2", price: 200 },
      ],
    };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );

    expect(
      screen.queryByRole("heading", { name: "товар1" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "товар2" })
    ).toBeInTheDocument();

    expect(screen.queryByText("$100")).toBeInTheDocument();
    expect(screen.queryByText("$200")).toBeInTheDocument();

    expect(screen.queryAllByRole("link", { name: /details/i })).toHaveLength(2);
  });

  it("На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка добавить в корзину. И НЕ отображается надпись о добавлении в корзину", () => {
    const initState = {
      cart: {},
      details: {
        1: {
          id: 1,
          name: "товар1",
          price: 100,
          description: "описание",
          material: "кожа",
          color: "белый",
        },
      },
    };
    const store = createStore(() => initState);

    render(
      <MemoryRouter initialEntries={["/catalog/1"]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    expect(
      screen.queryByRole("heading", { name: "товар1" })
    ).toBeInTheDocument();
    expect(screen.queryByText("описание")).toBeInTheDocument();
    expect(screen.queryByText("белый")).toBeInTheDocument();
    expect(screen.queryByText("кожа")).toBeInTheDocument();
    expect(screen.queryByText("Item in cart")).not.toBeInTheDocument();
  });

  it("Eсли товар уже добавлен в корзину, в каталоге отображатся сообщение об этом в карточке только этого товара ", () => {
    const initState = {
      cart: {
        1: {},
      },
      products: [{ id: 1 }, { id: 2 }],
    };
    const store = createStore(() => initState);

    render(
      <BrowserRouter>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.queryAllByText("Item in cart")).toHaveLength(1);
  });

  it("Eсли товар уже добавлен в корзину, на странице товара отображатся сообщение об этом", () => {
    const initState = {
      cart: {
        1: {},
      },
      details: {
        1: { id: 1 },
      },
    };
    const store = createStore(() => initState);

    render(
      <MemoryRouter initialEntries={["/catalog/1"]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.queryByText("Item in cart")).toBeInTheDocument();
  });
});
