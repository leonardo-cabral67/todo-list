import React from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/controller/todo";

const bg = "https://mariosouto.com/cursos/crudcomqualidade/bg";

interface HomeTodo {
  id: string;
  content: string;
  done: boolean;
}

export default function HomePage() {
  const initialLoadComplete = React.useRef(false);
  const [todos, setTodos] = React.useState<HomeTodo[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState<string>("");
  const [newTodoContent, setNewTodoContent] = React.useState<string>("");

  const homeTodos = todoController.filterTodosByContent<HomeTodo>(
    todos,
    search
  );

  const hasMorePages = totalPages > page;
  const hasNoTodos = homeTodos.length === 0 && !isLoading;

  React.useEffect(() => {
    if (!initialLoadComplete.current) {
      todoController
        .get({ page })
        .then(({ todos, pages }) => {
          setTodos(todos);
          setTotalPages(pages);
        })
        .finally(() => {
          setIsLoading(false);
          initialLoadComplete.current = true;
        });
    }
  }, []);

  return (
    <main>
      <GlobalStyles themeName="devsoutinho" />
      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form
          onSubmit={function newTodoHandler(e) {
            e.preventDefault();
            todoController.create({
              content: newTodoContent,
              onSuccess: (todo: HomeTodo) => {
                setTodos((oldTodos) => {
                  return [todo, ...oldTodos];
                });
                setNewTodoContent("");
              },
              onError: () =>
                alert("You need to provide a content to create a TODO"),
            });
          }}
        >
          <input
            name="add-todo"
            type="text"
            placeholder="Correr, Estudar..."
            value={newTodoContent}
            onChange={(e) => setNewTodoContent(e.target.value)}
          />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            placeholder="Filtrar lista atual, ex: Dentista"
            onChange={function handleSearch(event) {
              setSearch(event.target.value);
            }}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {homeTodos.map((todo) => (
              <tr key={todo.id}>
                <td>
                  <input
                    type="checkbox"
                    defaultChecked={todo.done}
                    onChange={() =>
                      todoController.toggleDone({
                        id: todo.id,
                        onError() {
                          alert("Todo could not be updated");
                        },
                        updateTodoOnScreen() {
                          setTodos((currentTodos) => {
                            return currentTodos.map((currentTodo) => {
                              if (currentTodo.id === todo.id) {
                                return {
                                  ...currentTodo,
                                  done: !currentTodo.done,
                                };
                              }
                              return currentTodo;
                            });
                          });
                        },
                      })
                    }
                  />
                </td>
                <td>{todo.id.substring(0, 4)}</td>
                <td>{todo.content}</td>
                <td align="right">
                  <button
                    data-type="delete"
                    onClick={() => {
                      todoController.deleteTodoById({
                        id: todo.id,
                        onError(error) {
                          console.error(error);
                        },
                        onSuccess() {
                          setTodos(() => {
                            return todos.filter(
                              (currentTodo) => currentTodo.id !== todo.id
                            );
                          });
                        },
                      });
                    }}
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}

            {isLoading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            )}

            {hasNoTodos && (
              <tr>
                <td colSpan={4} align="center">
                  Nenhum item encontrado
                </td>
              </tr>
            )}

            {hasMorePages && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      setIsLoading(true);
                      const nextPage = page + 1;
                      setPage(nextPage);

                      todoController
                        .get({ page: nextPage })
                        .then(({ todos, pages }) => {
                          setTodos((oldTodos) => {
                            return [...oldTodos, ...todos];
                          });
                          setTotalPages(pages);
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    }}
                  >
                    Página {page}, Carregar mais{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    ></span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
