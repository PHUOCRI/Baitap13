import React, { useState } from 'react';
import axios from 'axios';

const CarSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Giphy API key
    const GIPHY_API_KEY = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65';

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
        if (error) setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!searchTerm.trim()) {
            setError('Vui lòng nhập từ khóa tìm kiếm');
            return;
        }

        setLoading(true);
        setError(null);
        setImages([]);

        try {
            const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
                params: {
                    api_key: GIPHY_API_KEY,
                    q: `${searchTerm.trim()} car automobile`,
                    limit: 15,
                    offset: 0,
                    rating: 'g',
                    lang: 'vi'
                }
            });

            if (response.data.data.length === 0) {
                setError('Không tìm thấy hình ảnh nào. Vui lòng thử từ khóa khác.');
            } else {
                setImages(response.data.data);
            }
        } catch (err) {
            console.error('API Error:', err);
            if (err.code === 'ECONNABORTED') {
                setError('Kết nối quá chậm. Vui lòng kiểm tra đường truyền mạng và thử lại.');
            } else {
                setError('Có lỗi xảy ra khi tải hình ảnh. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="car-search">
            <h1>Tìm kiếm hình ảnh xe hơi</h1>
            
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-container">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        placeholder="Nhập tên xe (ví dụ: Toyota, BMW, Honda)..."
                        className="search-input"
                        disabled={loading}
                    />
                    {searchTerm && !loading && (
                        <button 
                            type="button" 
                            className="clear-button"
                            onClick={() => {
                                setSearchTerm('');
                                setError(null);
                                setImages([]);
                            }}
                        >
                            ×
                        </button>
                    )}
                </div>
                <button type="submit" disabled={loading} className="search-button">
                    {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                </button>
            </form>

            {error && <div className="error">{error}</div>}

            {loading && (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Đang tải hình ảnh...</p>
                </div>
            )}

            <div className="image-grid">
                {images.map((image) => (
                    <div key={image.id} className="image-item">
                        <img
                            src={image.images.fixed_height.url}
                            alt={image.title}
                            loading="lazy"
                        />
                        <div className="image-overlay">
                            <p>{image.title}</p>
                            <a 
                                href={image.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="view-link"
                            >
                                Xem trên Giphy
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .car-search {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }

                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 30px;
                    font-size: 2.5em;
                }

                .search-form {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                    padding: 0 15px;
                }

                .search-container {
                    position: relative;
                    flex: 1;
                }

                .search-input {
                    width: 100%;
                    padding: 12px 35px 12px 15px;
                    font-size: 16px;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    transition: all 0.3s;
                }

                .search-input:focus {
                    border-color: #007bff;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(0,123,255,0.25);
                }

                .search-input:disabled {
                    background-color: #f5f5f5;
                    cursor: not-allowed;
                }

                .clear-button {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: #666;
                    cursor: pointer;
                    padding: 0 5px;
                    line-height: 1;
                }

                .clear-button:hover {
                    color: #333;
                }

                .search-button {
                    padding: 12px 25px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    transition: all 0.3s;
                    min-width: 120px;
                }

                .search-button:hover:not(:disabled) {
                    background-color: #0056b3;
                    transform: translateY(-1px);
                }

                .search-button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                    transform: none;
                }

                .loading {
                    text-align: center;
                    padding: 40px;
                    color: #666;
                }

                .loading-spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #007bff;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error {
                    color: #dc3545;
                    margin: 10px auto;
                    padding: 12px 15px;
                    background-color: #f8d7da;
                    border-radius: 8px;
                    max-width: 800px;
                    text-align: center;
                }

                .image-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 30px;
                    padding: 0 15px;
                }

                .image-item {
                    position: relative;
                    border-radius: 12px;
                    overflow: hidden;
                    background-color: #f8f9fa;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                    transition: transform 0.3s, box-shadow 0.3s;
                }

                .image-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }

                .image-item img {
                    width: 100%;
                    display: block;
                }

                .image-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(transparent, rgba(0,0,0,0.8));
                    color: white;
                    padding: 15px;
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .image-item:hover .image-overlay {
                    opacity: 1;
                }

                .image-overlay p {
                    margin: 0 0 10px 0;
                    font-weight: 500;
                    font-size: 14px;
                }

                .view-link {
                    display: inline-block;
                    color: #fff;
                    text-decoration: none;
                    background-color: rgba(255,255,255,0.2);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    transition: all 0.3s;
                }

                .view-link:hover {
                    background-color: rgba(255,255,255,0.3);
                    transform: translateY(-1px);
                }

                @media (max-width: 768px) {
                    h1 {
                        font-size: 2em;
                        padding: 0 15px;
                    }

                    .search-form {
                        flex-direction: column;
                        gap: 15px;
                    }

                    .search-button {
                        width: 100%;
                    }

                    .image-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 15px;
                    }

                    .image-overlay {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default CarSearch; 