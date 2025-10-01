import CardElement from "@/components/pageComponents/CardElement";
import Spinner from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface Company {
  name: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  company: Company;
}

const MainPage = () => {
  const [fetchedUsers, setFetchedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 6;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const req = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!req.ok) throw new Error("Error fetching!");
      const data: User[] = await req.json();
      setFetchedUsers(data);
    } catch (error) {
      console.log("Failed to fetch users.", error);
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const totalPages = Math.ceil(fetchedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = fetchedUsers.slice(startIndex, startIndex + usersPerPage);

 const pages = Array.from({ length: totalPages }, (_, pageNumber) => pageNumber + 1);


  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-6">
<h1 className="text-4xl font-bold mb-8">User Management App</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {currentUsers.map((user) => (
          <CardElement key={user.id} user={user} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
            {pages.map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={pageNumber === currentPage}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default MainPage;
