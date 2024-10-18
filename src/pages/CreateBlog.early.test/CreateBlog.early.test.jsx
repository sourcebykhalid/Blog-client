// Unit tests for: CreateBlog

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import toast from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import CreateBlog from "../CreateBlog";
import "@testing-library/jest-dom";

// Mocking axios and toast
jest.mock("axios");
jest.mock("react-hot-toast");

describe("CreateBlog() CreateBlog method", () => {
  // Happy Path Tests
  describe("Happy Path", () => {
    it("should render the CreateBlog component with all input fields", () => {
      render(
        <BrowserRouter>
          <CreateBlog />
        </BrowserRouter>
      );

      expect(
        screen.getByPlaceholderText("Enter Blog title")
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Tell your story")).toBeInTheDocument();
      expect(screen.getByText("Select Category")).toBeInTheDocument();
      expect(screen.getByText("Upload Image")).toBeInTheDocument();
    });

    it("should successfully submit the form with valid inputs", async () => {
      axios.post.mockResolvedValue({ data: { success: true } });

      render(
        <BrowserRouter>
          <CreateBlog />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByPlaceholderText("Enter Blog title"), {
        target: { value: "Test Blog" },
      });
      fireEvent.change(screen.getByLabelText("Tell your story"), {
        target: { value: "This is a test blog description." },
      });
      fireEvent.change(screen.getByText("Select Category"), {
        target: { value: "tech" },
      });
      fireEvent.change(screen.getByLabelText("Upload Image"), {
        target: {
          files: [new File(["image"], "test.png", { type: "image/png" })],
        },
      });

      fireEvent.click(screen.getByText("Publish"));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith("Blog created successfully");
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle form submission failure gracefully", async () => {
      axios.post.mockResolvedValue({ data: { success: false } });

      render(
        <BrowserRouter>
          <CreateBlog />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByPlaceholderText("Enter Blog title"), {
        target: { value: "Test Blog" },
      });
      fireEvent.change(screen.getByLabelText("Tell your story"), {
        target: { value: "This is a test blog description." },
      });
      fireEvent.change(screen.getByText("Select Category"), {
        target: { value: "tech" },
      });
      fireEvent.change(screen.getByLabelText("Upload Image"), {
        target: {
          files: [new File(["image"], "test.png", { type: "image/png" })],
        },
      });

      fireEvent.click(screen.getByText("Publish"));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith("Failed to create blog");
      });
    });

    it("should handle network errors gracefully", async () => {
      axios.post.mockRejectedValue(new Error("Network Error"));

      render(
        <BrowserRouter>
          <CreateBlog />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByPlaceholderText("Enter Blog title"), {
        target: { value: "Test Blog" },
      });
      fireEvent.change(screen.getByLabelText("Tell your story"), {
        target: { value: "This is a test blog description." },
      });
      fireEvent.change(screen.getByText("Select Category"), {
        target: { value: "tech" },
      });
      fireEvent.change(screen.getByLabelText("Upload Image"), {
        target: {
          files: [new File(["image"], "test.png", { type: "image/png" })],
        },
      });

      fireEvent.click(screen.getByText("Publish"));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith(
          "An error occurred while creating the blog. Please try again later."
        );
      });
    });

    it("should not submit the form if required fields are empty", () => {
      render(
        <BrowserRouter>
          <CreateBlog />
        </BrowserRouter>
      );

      fireEvent.click(screen.getByText("Publish"));

      expect(axios.post).not.toHaveBeenCalled();
      expect(toast.error).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: CreateBlog
