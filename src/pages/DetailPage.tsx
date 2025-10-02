import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Spinner from "@/components/ui/spinner";
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Company {
  name: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: Company;
  address: Address;
}

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data: User = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600">User not found</p>
        <Link to="/">
          <Button className="mt-4">Back to Users</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">User Details</h1>

      <Card className="w-full max-w-md p-6 shadow-lg rounded-xl border border-gray-200">
        <CardTitle>
          <h2 className="text-xl font-semibold">{user.name}</h2>
        </CardTitle>
        <CardContent className="space-y-2 text-gray-700">
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {user.phone}
          </p>
          <p>
            <span className="font-medium">Website:</span>{" "}
            <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {user.website}
            </a>
          </p>
          <p>
            <span className="font-medium">Company:</span> {user.company.name}
          </p>
          <p>
            <span className="font-medium">Address:</span> {user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}
          </p>
        </CardContent>
        <CardFooter className="mt-4">
          <Link to="/">
            <Button>Back to Users</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DetailPage;
