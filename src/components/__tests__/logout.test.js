/**
 * @jest-environment jsdom
 */

import logout from "../logout";

describe("logout function", () => {
  let mockLogOutButton;

  beforeEach(() => {
    mockLogOutButton = document.createElement("button");
    mockLogOutButton.id = "logOut";
    document.body.appendChild(mockLogOutButton);

    Storage.prototype.removeItem = jest.fn();
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.removeChild(mockLogOutButton);
  });

  it("clears the token from browser storage", () => {
    logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith("bearerToken");
    expect(localStorage.removeItem).toHaveBeenCalledWith("name");

    expect(window.location.href).toBe("./index.html");
  });
});
