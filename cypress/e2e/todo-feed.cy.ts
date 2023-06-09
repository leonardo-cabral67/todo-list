// const BASE_URL = "http://localhost:3000";
describe("Todo feed", () => {
  it("When load, renders the page", () => {
    cy.visit("/");
  });

  it("when create a new todo, it should appear in scream", () => {
    //INTERCEPT http method post on a url
    cy.intercept("POST", "/api/todos", (request) =>
      request.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "00f24a80-4f43-4995-baea-b64e86c84909",
            content: "test todo from cypress",
            date: "2023-06-07T23:48:19.980Z",
            done: true,
          },
        },
      })
    ).as("createTodo");

    // 1 - Visit url
    cy.visit("/");

    // 2 & 3 - Select input and type a new tpdp
    const inputAddTodo = "input[name='add-todo']";
    cy.get(inputAddTodo).type("test todo from cypress");

    // 4 & 5 - select and click on button
    const buttonAddNewTodo = "button[aria-label='Adicionar novo item']";
    cy.get(buttonAddNewTodo).click();

    // 6 - check if appeared a new todo
    cy.get("table > tbody").contains("test todo from cypress");
  });
});
