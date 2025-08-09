import React, { useState } from "react";

function Base64Decoder() {
    const [base64String, setBase64String] = useState("");
    const [fileName, setFileName] = useState("decoded_file");
    const [mimeType, setMimeType] = useState("application/octet-stream");

    const handleDecode = () => {
        try {
            // Convert base64 to a byte array
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Create a Blob from the byte array
            const blob = new Blob([byteArray], { type: mimeType });

            // Create a link to download the blob
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();

            // Clean up the URL object
            window.URL.revokeObjectURL(link.href);
        } catch (e) {
            alert("Invalid base64 string");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h3>Base64 Decoder</h3>
            <textarea
                rows={8}
                cols={60}
                placeholder="Paste base64 string here"
                value={base64String}
                onChange={(e) => setBase64String(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder="File name (with extension)"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder="MIME type (e.g., image/png, text/csv)"
                value={mimeType}
                onChange={(e) => setMimeType(e.target.value)}
            />
            <br />
            <button onClick={handleDecode}>Download File</button>
        </div>
    );
}

export default Base64Decoder;
