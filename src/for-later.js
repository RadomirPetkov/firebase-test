import { useState, useEffect } from "react"
import { db, storage } from "./firebase-config"
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, listAll, list } from "firebase/storage";


const [newName, setNewName] = useState([])
const [newAge, setNewAge] = useState([])
const [users, setUsers] = useState([])
const usersCollectionRef = collection(db, "tattoos")
const [imageUpload, setImageUpload] = useState(null)
const [imageList, setImageList] = useState([])

useEffect(() => {

    const getTattoos = async () => {
        const data = await getDocs(usersCollectionRef)
        // data.docs.map((x) => console.log(x.data())) 
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    getTattoos()
}, [])

const addUser = () => {
    addDoc(usersCollectionRef, { name: newName, age: Number(newAge) })

}

const changeAge = async (id, age) => {
    const currentDoc = doc(db, "tattoos", id)
    updateDoc(currentDoc, { "age": Number(age) + 1 })

}
const deleteUser = async (id) => {
    const currentDoc = doc(db, "tattoos", id)
    await deleteDoc(currentDoc)
}
const uploadImage = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `tattoo/${imageUpload.name}`)
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
            setImageList((prev) => [...prev, url]);
        })
    })
}

useEffect(() => {
    listAll(ref(storage, "/tattoo"))
        .then((res) => {
            res.items.forEach((item) => {
                getDownloadURL(item)
                    .then((url) => {
                        setImageList((old) => [...old, url])
                    })

            })
        })
}, [])
console.log(imageList);
return (
    <div className="App">
        <input placeholder="Name..." onChange={(e) => setNewName(e.target.value)} />
        <input type="number" placeholder="Age..." onChange={(e) => setNewAge(e.target.value)} />
        <button onClick={addUser} >Add new user</button>

        <p></p>
        <input type="file" onChange={(e) => setImageUpload(e.target.files[0])}></input>
        <button onClick={() => uploadImage()}>Upload your photo</button>


        {users.map((user) => {
            return (
                <div key={user.id}>
                    <h1>
                        Name: {user.name}
                    </h1>
                    <h1>
                        age: {user.age}
                    </h1>

                    <button onClick={() => changeAge(user.id, user.age)}>Increase age</button>
                    <button onClick={() => deleteUser(user.id)}> Delete user</button>
                </div>)
        })}


        {imageList.map((img) => {
            return <img src={img} />
        })}

    </div>


);