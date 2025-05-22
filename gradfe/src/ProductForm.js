import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductForm = () => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [result, setResult] = useState(null);
    const [suggestedTags, setSuggestedTags] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/suggested-tags")
            .then(res => setSuggestedTags(res.data))
            .catch(err => console.error("Tag suggestions were not received:", err));
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleTagClick = (tag) => {
        const current = tags.split(",").map(t => t.trim());
        if (!current.includes(tag)) {
            setTags(prev => (prev ? `${prev}, ${tag}` : tag));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !category || !image) {
            alert("Can't be null");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("category", category);
        formData.append("tags", tags);
        formData.append("image", image);

        try {
            const res = await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult(res.data);
        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>🛒 Upload Product Image</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={styles.input}
                    required
                />
                <div>
                    <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        style={styles.input}
                    />
                    <div style={styles.suggestionBox}>
                        {suggestedTags.map((tag, i) => (
                            <button
                                key={i}
                                type="button"
                                style={styles.tagButton}
                                onClick={() => handleTagClick(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.fileInput}
                    required
                />
                <button type="submit" style={styles.button}>Upload</button>
            </form>

            {previewUrl && (
                <div style={styles.section}>
                    <h4>Preview:</h4>
                    <img src={previewUrl} alt="Preview" style={styles.image} />
                </div>
            )}

            {result && (
                <div style={styles.section}>
                    <h3>📦 Upload Result</h3>
                    <p><strong>Name:</strong> {result.name}</p>
                    <p><strong>Category:</strong> {result.category}</p>
                    <p><strong>Tags:</strong> {result.tags.join(", ")}</p>
                    <img
                        src={`http://localhost:5000${result.enhancedImage}`}
                        alt="Processed"
                        style={styles.image}
                    />
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
    },
    heading: {
        textAlign: "center",
        marginBottom: "1.5rem",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    input: {
        padding: "0.8rem",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "1rem",
    },
    fileInput: {
        padding: "0.4rem",
        border: "none",
        backgroundColor: "#f0f0f0",
    },
    button: {
        padding: "0.8rem",
        backgroundColor: "#007bff",
        color: "white",
        fontWeight: "bold",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    section: {
        marginTop: "2rem",
    },
    image: {
        maxWidth: "100%",
        height: "auto",
        borderRadius: "6px",
        border: "1px solid #ddd",
        marginTop: "0.5rem",
    },
    suggestionBox: {
        marginTop: "0.5rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
    },
    tagButton: {
        backgroundColor: "#eaeaea",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "0.3rem 0.6rem",
        fontSize: "0.9rem",
        cursor: "pointer",
    },
};

export default ProductForm;
