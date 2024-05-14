import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { GET_POSTS } from "../queries";
import { Main } from "../components/main";

const mocks = [
  {
    request: {
      query: GET_POSTS,
      variables: {
        options: { slice: { limit: 10 }, sort: { field: "id", order: "DESC" } },
      },
    },
    result: {
      data: {
        posts: {
          data: [
            {
              id: "1",
              title:
                "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
              body: "eum non blanditiis  voluptatem qui plventore aut est et vosimos dolor itaque sit nam",
              user: {
                id: "1",
                name: "Bret",
                username: "Bret",
                email: "Sincere@april.biz",
                address: {
                  geo: {
                    lat: -37.3159,
                    lng: 81.1496,
                  },
                },
              },
            },
            {
              id: "2",
              title: "qui est esse",
              body: "voluptatem dignissimos dolor itaque sit nam",
              user: {
                id: "2",
                name: "Bret",
                username: "Bret",
                email: "Sincere@april.biz",
                address: {
                  geo: {
                    lat: -37.3159,
                    lng: 81.1496,
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
];

it("renders without error", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Main />
    </MockedProvider>
  );
  expect(await screen.findByText("Posts")).toBeInTheDocument();
});
