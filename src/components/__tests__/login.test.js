/**
 * @jest-environment jsdom
 */
import logIn from "../../utils/loginFunc.js";
import { mail, password } from "../../../cypress/creds.js";
require("dotenv/config");

if (!global.fetch) {
  global.fetch = () => Promise.resolve();
}

beforeAll(() => {
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({ accessToken: "fake-token", name: "fake-name" }),
    }),
  );
});

// Mock localStorage
jest.spyOn(Object.getPrototypeOf(window.localStorage), "setItem");
jest.spyOn(Object.getPrototypeOf(window.localStorage), "getItem");

// Mock window.location.href
Object.defineProperty(window, "location", {
  value: {
    href: "",
    assign: jest.fn(),
  },
  writable: true,
});

afterEach(() => {
  jest.clearAllMocks();
});

test("logIn function fetches and stores a token", async () => {
  const mockToken = "fake-token";
  const baseUrl = "https://api.noroff.dev/api/v1";
  const expectedUrl = `${baseUrl}/social/auth/login`;
  const requestBody = {
    email: mail,
    password: password,
  };

  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ accessToken: mockToken, name: "fake-name" }),
  });

  await logIn(baseUrl, requestBody);

  expect(fetch).toHaveBeenCalledWith(expectedUrl, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  expect(localStorage.setItem).toHaveBeenCalledWith("bearerToken", mockToken);
  expect(localStorage.setItem).toHaveBeenCalledWith("name", "fake-name");
});
