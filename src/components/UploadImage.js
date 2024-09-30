import axios from "axios";
import { useState } from "react";
import { Input } from "../ui/Input";
import {  PlusIcon, Trash } from "lucide-react";
const CLOUDFRONT_URL = "https://d2bjl3gckn1kyh.cloudfront.net";
const api = process.env.REACT_APP_API_URL;

export function UploadImage({ onImageAdded, image, removeImage }) {
  const [uploading, setUploading] = useState(false);

  async function onFileSelect(e) {
    setUploading(true);
    try {
      const file = e.target.files[0];
      const response = await axios.get(`${api}/company/presignedUrl`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      const presignedUrl = response.data.preSignedUrl;
      const formData = new FormData();
      formData.set("bucket", response.data.fields["bucket"]);
      formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"]);
      formData.set(
        "X-Amz-Credential",
        response.data.fields["X-Amz-Credential"]
      );
      formData.set("X-Amz-Date", response.data.fields["X-Amz-Date"]);
      formData.set("key", response.data.fields["key"]);
      formData.set("Policy", response.data.fields["Policy"]);
      formData.set("X-Amz-Signature", response.data.fields["X-Amz-Signature"]);
      formData.append("file", file);

      const awsResponse = await axios.post(presignedUrl, formData);
      console.log(awsResponse);
      onImageAdded(`${CLOUDFRONT_URL}/${response.data.fields["key"]}`);
    } catch (e) {
      console.log(e);
    }
    setUploading(false);
  }

  if (image) {
    return (
      <div className="relative">
        <img
          className={"p-2 w-48 aspect-square rounded cursor-pointer"}
          src={image}
          alt="Uploaded"
        />
        <div className="flex justify-center absolute right-4 top-4">
          <button
            onClick={removeImage}
            className="bg-red-500 text-white rounded p-2 hover:bg-red-600 transition-colors"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-40 h-40 mt-10 rounded border text-2xl cursor-pointer">
        <div className="h-full flex justify-center flex-col relative w-full">
          <div className="h-full flex justify-center w-full pt-16 text-4xl">
            {uploading ? (
              <div className="text-sm">Loading...</div>
            ) : (
              <>
                <Input
                  className="w-full h-full text-white"
                  type="file"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  onChange={onFileSelect}
                />
                <PlusIcon size={32} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
