import React, { useState, useEffect } from "react";

const base64ToObjectURL = (base64String, mimeType) => {
    // Convert base64 to a byte array
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the byte array
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
};

function ImageDisplay({ base64String, mimeType }) {
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        if (mimeType === "image/jpeg") {
            const objectURL = base64ToObjectURL(base64String, mimeType);
            setImageSrc(objectURL);

            return () => URL.revokeObjectURL(objectURL);
        }
    }, [base64String, mimeType]);

    return (
        <div>
            {imageSrc ? (
                <img
                    src={imageSrc}
                    alt="Decoded"
                    style={{ maxWidth: "500px", border: "1px solid gray" }}
                />
            ) : (
                <p>No JPEG image to display.</p>
            )}
        </div>
    );
}

function Base64Decoder() {
    const [base64String, setBase64String] = useState("");
    const [fileName, setFileName] = useState("decoded_file");
    const [mimeType, setMimeType] = useState("application/octet-stream");
    const [isJPEG, setIsJPEG] = useState(false);

    const handleDecode = () => {
        try {
            if (mimeType === "image/jpeg") {
                setIsJPEG(true);
            } else {
                const blob = base64ToObjectURL(base64String, mimeType);
                // Create a link to download the blob
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();

                // Clean up the URL object
                window.URL.revokeObjectURL(link.href);
            }
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
            {isJPEG && (
                <ImageDisplay base64String={base64String} mimeType={mimeType} />
            )}
        </div>
    );
}

export default Base64Decoder;
