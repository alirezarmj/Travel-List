import { useState } from "react";
import { Logo } from "./Logo";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
// ];

function App() {
  const [items, setItems] = useState([]);
  console.log(items);
  function handleItems(newItem) {
    setItems((items) => [...items, newItem]);
  }
  const handleDelete = (id) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };
  const handleToggleItem = (id) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const handleClear = () => {
    const confirmed = window.confirm("Are you sure to delete list");
    if (confirmed) setItems([]);
  };
  return (
    <div className="app">
      <Logo />
      <Form onitemsHandle={handleItems} />
      <PackingList
        items={items}
        onDeleteHandle={handleDelete}
        onToggleItem={handleToggleItem}
        onClear={handleClear}
      />
      <Stat items={items} />
    </div>
  );
}

export default App;

function Form({ onitemsHandle }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  function handleSubmit(e) {
    e.preventDefault();
    const newItem = { id: Date.now(), description, quantity, packed: false };
    onitemsHandle(newItem);
    setDescription("");
    setQuantity("");
  }
  return (
    <form onSubmit={handleSubmit} className=" add-form">
      <h3>What do you need for your 😍 trip ?</h3>
      <select
        value={quantity}
        onChange={(e) => {
          setQuantity(+e.target.value);
        }}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
        placeholder="Item..."
      />
      <button>Add</button>
    </form>
  );
}
function PackingList({ items, onDeleteHandle, onToggleItem, onClear }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;
  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            onDeleteHandle={onDeleteHandle}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={onClear}>CLEAR LIST</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteHandle, onToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {" "}
        {item.quantity}
        {"  "} {item.description}
      </span>
      <button onClick={() => onDeleteHandle(item.id)}>❌</button>
    </li>
  );
}

function Stat({ items }) {
  if (!items.length) {
    return (
      <p className="stats">
        <em> Start adding items to your packing list 🚀</em>
      </p>
    );
  }
  const numItems = items.length;
  const numpacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numpacked / numItems) * 100);
  console.log(numpacked);
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You got everything ok, ready to go ✈️"
          : ` 👜 You have ${numItems} items on your list, and you already packed{" "}
        ${numpacked} (${percentage}%)`}
      </em>
    </footer>
  );
}
