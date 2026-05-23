import React, { useState, useEffect } from 'react';
import './Home.css';

function Home() {
  const [items, setItems] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const apiUrl = 'https://localhost:5001/api/products';

  const getProducts = () => {
    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setItems(data))
      .catch(err => console.error("Błąd podczas pobierania produktów:", err));
  };

  const deleteProduct = (id) => {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) {
          alert(res.status === 404 ? 'Nie znaleziono produktu' : 'Błąd podczas usuwania');
          throw new Error('Usuwanie nie powiodło się');
        }
        getProducts();
      })
      .catch(err => console.error("Błąd:", err));
  };

  const saveProduct = () => {
    if (!newProductName.trim()) return alert('Nazwa nie może być pusta');
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newProductName, inStock: false })
    })
      .then(res => {
        if (!res.ok) throw new Error('Dodawanie nie powiodło się');
        setNewProductName('');
        getProducts();
      })
      .catch(err => console.error("Błąd:", err));
  };

  const saveEditedProduct = () => {
    if (!editingProduct.name.trim()) return alert('Nazwa nie może być pusta');
    fetch(`${apiUrl}/${editingProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingProduct)
    })
      .then(res => {
        if (!res.ok) throw new Error('Aktualizacja nie powiodła się');
        setEditingProduct(null);
        getProducts();
      })
      .catch(err => console.error("Błąd:", err));
  };

  const startEditing = (item) => setEditingProduct({ ...item });
  const cancelEditing = () => setEditingProduct(null);

  useEffect(() => { getProducts(); }, []);

  return (
    <div className="products-container">
      <h2>Lista produktów</h2>

      <div className="product-form">
        <input
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Wpisz nazwę nowego produktu"
          className="product-input"
        />
        <button className="save-btn" onClick={saveProduct}>Dodaj</button>
      </div>

      <div className="products-list">
        {items.length === 0 ? (
          <p>Brak produktów</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="product-item">
              {editingProduct && editingProduct.id === item.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="product-input"
                  />
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    />
                    <label>W magazynie</label>
                  </div>
                  <div className="edit-buttons">
                    <button className="save-btn" onClick={saveEditedProduct}>Zapisz</button>
                    <button className="cancel-btn" onClick={cancelEditing}>Anuluj</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="product-info">
                    <span className="product-name">{item.name}</span>
                    <span className="product-stock">{item.inStock ? 'W magazynie' : 'Brak w magazynie'}</span>
                  </div>
                  <div className="product-actions">
                    <button className="edit-btn" onClick={() => startEditing(item)}>Edytuj</button>
                    <button className="delete-btn" onClick={() => deleteProduct(item.id)}>Usuń</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
