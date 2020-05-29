import React, {useEffect, useState} from 'react';
import './App.css';
import * as axios from "axios";

const URL = "https://api.github.com/users/Feyweyter";

function App() {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                URL,
            );

            setUserData(result.data);
        };
        fetchData();
    }, []);

    return (
        userData && <div className="App">
            <p><span className="title">login: </span>{userData.login}</p>
            <p><span className="title">name: </span>{userData.name}</p>
            <img className="img-github" src={userData.avatar_url} alt="avatar"/>
            <p><span className="title">followers: </span>{userData.followers}</p>
            <p><span className="title">following: </span>{userData.following}</p>
        </div>
    );
}

export default App;
