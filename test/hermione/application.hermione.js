const { assert } = require("chai");

describe("Общие требования", async function () {
  it("вёрстка должна адаптироваться под ширину экрана 1200px", async function () {
    this.browser.setWindowSize(1200, 800);
    await this.browser.url("#");

    const page = await this.browser.$(".Application");
    await page.waitForExist();

    await this.browser.assertView("plain", ".Application", {
      compositeImage: false,
      allowViewportOverflow: true,
    });
  });

  it("Вёрстка должна адаптироваться под ширину экрана 800px", async function () {
    this.browser.setWindowSize(800, 1000);
    await this.browser.url("#");

    const page = await this.browser.$(".Application");
    await page.waitForExist();

    await this.browser.assertView("plain", ".Application", {
      compositeImage: false,
      allowViewportOverflow: true,
      tolerance: 5,
    });
  });

  it("на ширине меньше 576px навигационное меню должно скрываться за гамбургер", async function () {
    this.browser.setWindowSize(500, 1000);
    await this.browser.url("#");

    const page = await this.browser.$("nav");
    await page.waitForExist();

    await this.browser.assertView("plain", "nav", {
      compositeImage: false,
      allowViewportOverflow: true,
    });
  });

  it("при выборе элемента из меню гамбургера, меню должно закрываться", async function () {
    this.browser.setWindowSize(500, 1800);
    await this.browser.url("#");

    const button = await this.browser.$(".Application-Toggler");
    const menu = await this.browser.$(".Application-Menu.navbar-collapse");
    const link = await this.browser.$(".nav-link");
    await button.click();

    await menu.waitForDisplayed();

    await link.click();

    await menu.waitForDisplayed({ reverse: true });

    assert.isFalse(await menu.isDisplayed());
  });
});

describe("Добавление товаров из каталога и работа с корзиной", async function () {
  it("Товар можно добавить и они сохраняются в корзине", async function () {
    this.browser.setWindowSize(1200, 800);
    await this.browser.url("#");

    const catalogLink = await this.browser.$("=Catalog");
    const cartLink = await this.browser.$("=Cart");

    await catalogLink.click();

    const cards = await this.browser.$$(".ProductItem");

    assert.isAtLeast(cards.length, 1, "Карточки товаров не отображаются");

    const detailsLink = await cards[0].$("=Details");
    await detailsLink.click();

    const productDetails = await this.browser.$(".ProductDetails");

    assert.exists(productDetails, "Карточка товара не отображается");

    const button = await this.browser.$(".ProductDetails-AddToCart");
    const productName = (
      await this.browser.$(".ProductDetails-Name")
    ).getText();

    await button.click();
    await cartLink.click();

    const productNameInTable = (await this.browser.$(".Cart-Name")).getText();

    assert.equal(
      await productNameInTable,
      await productName,
      "товар в корзине не совпадает с добавленным"
    );

    this.browser.refresh();

    const productNameAfterReload = (
      await this.browser.$(".Cart-Name")
    ).getText();

    assert.equal(
      await productNameAfterReload,
      await productNameInTable,
      "товар не сохранился при перезагрузке"
    );
  });

  it("содержимое корзины должно сохраняться между перезагрузками страницы;", async function () {
    this.browser.setWindowSize(1200, 800);
    await this.browser.url("cart");

    const productNameBefore = await this.browser.$(".Cart-Name");

    this.browser.refresh();

    const productNameAfter = await this.browser.$(".Cart-Name");

    assert.equal(
      await productNameBefore.getText(),
      await productNameAfter.getText(),
      "товар не сохранился при перезагрузке"
    );
  });

  it("в корзине должна быть кнопка очистить корзину, по нажатию на которую все товары должны удаляться,", async function () {
    this.browser.setWindowSize(1200, 800);
    await this.browser.url("cart");

    const clearBtn = await this.browser.$(".Cart-Clear");

    await clearBtn.click();

    const cartTable = this.browser.$(".Cart-Table").isExisting();
    const catalogLink = this.browser.$("=catalog").isExisting();

    assert.isFalse(
      await cartTable,
      "Таблица с товарами осталась, после отчистки товаров"
    );
    assert.isTrue(await catalogLink, "Cсылка на каталог не появилась");
  });

  it("если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом", async function () {
    this.browser.setWindowSize(1200, 800);
    await this.browser.url("catalog");

    const cards = await this.browser.$$(".ProductItem");

    const detailsLink = await cards[1].$("=Details");
    await detailsLink.click();

    const cartBadgeBefore = (await this.browser.$(".CartBadge")).isExisting();

    assert.isFalse(
      await cartBadgeBefore,
      "Сообщения быть не должно, что товар уже в корзине"
    );

    const button = await this.browser.$(".ProductDetails-AddToCart");
    await button.click();

    const cartBadgeAfterAdd = (await this.browser.$(".CartBadge")).isExisting();

    assert.isTrue(
      await cartBadgeAfterAdd,
      "Нет сообщения, что товар уже в корзине "
    );
  });

  it("если товар уже добавлен в корзину, повторное нажатие кнопки добавить в корзину должно увеличивать его количество", async function () {
    this.browser.setWindowSize(1200, 800);
    await this.browser.url("cart");

    const countBefore = this.browser.$(".Cart-Count");

    assert.equal(
      await countBefore.getText(),
      1,
      "В корзине должно быть 1 штука товара"
    );

    //В каталоге ещё раз добавляем тот-же товар
    await this.browser.url("catalog");
    const cards = await this.browser.$$(".ProductItem");
    const detailsLink = await cards[1].$("=Details");
    await detailsLink.click();

    const button = await this.browser.$(".ProductDetails-AddToCart");
    await button.click();

    await this.browser.url("cart");
    const countAfter = this.browser.$(".Cart-Count");

    assert.equal(
      await countAfter.getText(),
      2,
      "В корзине количество должно увеличиться до 2"
    );
  });
});
