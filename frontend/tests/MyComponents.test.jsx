import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // ✅ Add this import
import MyComponent from "../src/components/MyComponent";

test("renders Hello World", () => {
  render(<MyComponent />);
  const element = screen.getByText(/Hello World/i);
  expect(element).toBeInTheDocument(); // ✅ Now it will work
});
