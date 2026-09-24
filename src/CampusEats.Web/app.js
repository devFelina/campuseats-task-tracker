const API_URL = 'http://localhost:5090/api/menu';

async function fetchMenu() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderMenu(data);
    } catch (err) {
        console.error('Failed to fetch menu', err);
    }
}

function renderMenu(items) {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h3>${item.name}</h3>
            <div class="price">Rs. ${item.price}</div>
            <div class="badge" style="margin-bottom: 10px;">${item.category}</div>
            <div style="display: flex; gap: 5px;">
                <button class="btn btn-secondary" style="padding: 4px 8px;" onclick="editDish(${item.id})">Edit</button>
                <button class="btn btn-danger" style="padding: 4px 8px;" onclick="deleteDish(${item.id})">Delete</button>
            </div>
        `;
        grid.appendChild(div);
    });
}

function showAddForm() {
    document.getElementById('dish-id').value = '';
    document.getElementById('dish-name').value = '';
    document.getElementById('dish-price').value = '';
    document.getElementById('dish-category').value = '';
    document.getElementById('modal-title').innerText = 'Add Dish';
    document.getElementById('modal-backdrop').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-backdrop').style.display = 'none';
}

async function saveDish() {
    const id = document.getElementById('dish-id').value;
    const dish = {
        name: document.getElementById('dish-name').value,
        price: parseFloat(document.getElementById('dish-price').value),
        category: document.getElementById('dish-category').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dish)
        });
        closeModal();
        fetchMenu();
    } catch (err) {
        console.error('Failed to save dish', err);
    }
}

async function editDish(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const item = await response.json();
        document.getElementById('dish-id').value = item.id;
        document.getElementById('dish-name').value = item.name;
        document.getElementById('dish-price').value = item.price;
        document.getElementById('dish-category').value = item.category;
        document.getElementById('modal-title').innerText = 'Edit Dish';
        document.getElementById('modal-backdrop').style.display = 'flex';
    } catch (err) {
        console.error('Failed to fetch dish details', err);
    }
}

async function deleteDish(id) {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchMenu();
    } catch (err) {
        console.error('Failed to delete dish', err);
    }
}

// Initial fetch
fetchMenu();
