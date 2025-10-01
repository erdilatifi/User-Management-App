import { User } from "@/pages/MainPage";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router";

interface CardElementProps {
  user: User;
}

const CardElement = ({ user }: CardElementProps) => {
  return (
    <Link to={`/${user.id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow rounded-xl border border-gray-200">
        <CardTitle>
          <h2 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h2>
        </CardTitle>
        <CardContent className="text-gray-700 space-y-1">
          <p className="text-sm">{user.email}</p>
          <p className="text-sm font-medium">{user.company.name}</p>
        </CardContent>
        <CardFooter className="flex gap-2 mt-2">
          <Button size="sm" className="flex-1">
            Update
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Delete
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CardElement;
