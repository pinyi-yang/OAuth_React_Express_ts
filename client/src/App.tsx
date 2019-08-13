import React, {useState, useEffect} from 'react';
import './App.css';
import aixos from 'axios';
import openNewAuthWindow from './openWindow';

//We had to define this because TS needs to know
//the shape of our user object
export interface IUser {
  githubId: number;
  _id?: string;
}

export interface IRepo {
  name: string
}

const App: React.FC = () => {
  //useState can be used as generic, using IUser from above
  const [user, setUser] = useState<IUser>({} as IUser);
  const [repos, setRepos] = useState<IRepo[]>([]);

  useEffect(() => {
    console.log('firing data fetch');
    if (Object.keys(user).length ) {
      aixos.get(`/api/${user.githubId}/repos`).then(response => {
        console.log('repos: ', response.data);
        setRepos(response.data);
      })
    }
  }, [user])

  function handleLogin(e: React.MouseEvent): void {
    e.preventDefault();
    // specify the type of data returned
    var message: Promise<IUser> = openNewAuthWindow('/auth/github');
    message.then(response => {
      setUser(response);
    }).catch(err => {
      console.log(err);
    })
  }

  var userData = Object.keys(user).length === 0 ? <p>No user</p> : <p>{user.githubId}</p>
  var repoData = repos.map((repo: IRepo, id) => (
    <p>{repo.name}</p>
  ))
  return (
    <div className="App">
      <a onClick={handleLogin} href='/auth/github'>Login with Github</a>
      {userData}
      {repoData}
    </div>
  );
}

export default App;
