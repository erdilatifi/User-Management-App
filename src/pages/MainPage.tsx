import { useState } from "react";

interface User {
    id:number,
    email:string,
    name:string,
}

const MainPage = () => {

    const [fetchedUsers, setFetchedUsers] = useState<User[]>([]);


    const fetchUsers = async () => {
        try{
            const req = await fetch('https://jsonplaceholder.typicode.com/users');
            const data = await req.json();
            if(data){
                setFetchedUsers(data);
            }

        }catch(error){
            
        }finally{

        }
    }

  return (
    <div>MainPage</div>
  )
}

export default MainPage