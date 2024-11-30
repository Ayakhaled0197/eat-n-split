import { useState } from "react";
import "./App.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friend, setFriend] = useState(initialFriends);

  const [showFriend, setShowFriend] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleSetFriend(Nfriend) {
    setFriend((friend) => [...friend, Nfriend]);
  }
  function handleShowFriend() {
    setShowFriend(!showFriend);
  }
  function handleSelectedFriend(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowFriend(false);
  }

  function handleSplitBill(value) {
    setFriend((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <ListOfFriends
        listOfFriends={friend}
        showFriend={showFriend}
        action={handleShowFriend}
        handleSetFriend={handleSetFriend}
        onSelectedFriend={handleSelectedFriend}
        selectedFriend={selectedFriend}
      />
      {selectedFriend && (
        <SplitBill
          listOfFriends={friend}
          onSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
          handleSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function ListOfFriends({
  listOfFriends,
  showFriend,
  action,
  handleSetFriend,
  onSelectedFriend,
  selectedFriend,
}) {
  return (
    <div className="sidebar">
      <ul>
        {listOfFriends.map((friend) => (
          <Friend
            friend={friend}
            key={friend.id}
            onSelectedFriend={onSelectedFriend}
            selectedFriend={selectedFriend}
          />
        ))}
      </ul>
      {showFriend && (
        <AddFriend showFriend={showFriend} handleSetFriend={handleSetFriend} />
      )}

      <Button action={action}>{showFriend ? "Close" : "Add friend"}</Button>
    </div>
  );
}

function Friend({ friend, onSelectedFriend, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;
  return (
    <li>
      <img src={friend.image} alt="friend" />
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          {" "}
          you owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          you owe {friend.name} {friend.balance}$
        </p>
      ) : friend.balance === 0 ? (
        <p>you and {friend.name} are even</p>
      ) : null}

      <button className="button" onClick={() => onSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </button>
    </li>
  );
}

function Button({ children, action }) {
  return (
    <div>
      <button className="button" onClick={action}>
        {children}
      </button>
    </div>
  );
}

function AddFriend({ handleSetFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    setName("");
    setImage("");
    handleSetFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        name="friendname"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌄Image URL</label>
      <input
        type="text"
        name="friendImage"
        id="image"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function SplitBill({ selectedFriend, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const paidByFriend = bill ? bill - userExpense : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !userExpense) return;
    handleSplitBill(whoIsPaying === "user" ? paidByFriend : -userExpense);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT THE BILL WITH {selectedFriend.name}</h2>
      <label> 💰 Bill value :</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />

      <label>🧍‍♂️ your expences :</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > bill
              ? paidByFriend
              : Number(e.target.value)
          )
        }
      />

      <label> 🧑‍🤝‍🧑 {selectedFriend.name}'s expense :</label>
      <input type="text" disabled value={paidByFriend} />

      <label> 🤑 who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value="user">you</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split the Bill</Button>
    </form>
  );
}
