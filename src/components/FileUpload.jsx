import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file); // Ensure 'file' matches the field name on the server

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.post(`${apiUrl}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { file: uploadedPath, message } = res.data;
      setUploadedFile({ file: uploadedPath, message });

      // Pass the file URL/path to the parent component
      onFileUpload(uploadedPath);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>
      </form>
      {uploadedFile.file ? (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center">{uploadedFile.message}</h3>
            <img
              style={{ width: "100%" }}
              src={`/${uploadedFile.file}`}
              alt=""
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FileUpload;
