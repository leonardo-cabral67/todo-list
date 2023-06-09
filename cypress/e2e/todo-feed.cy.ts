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

    // Visit url
    cy.visit("/");
    // Select input
    const $inputAddTodo = cy.get("input[name='add-todo']");
    // type a new tpdp
    $inputAddTodo.type("test todo from cypress");
    //select button
    const $btnAddTodo = cy.get("button[aria-label='Adicionar novo item']");
    // click on button
    $btnAddTodo.click();
    // check if appeared a new todo
    cy.get("table > tbody").contains("test todo from cypress");
  });
});
