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
import { useUsersStore, User } from "@/lib/usersStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SortBy = "name" | "email";
type SortOrder = "asc" | "desc";

const MainPage = () => {
  const { users, setUsers, addUserAtTop } = useUsersStore();
  const [loading, setLoading] = useState<boolean>(false);

  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 6;
 
  const loadUsersFromApi = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) throw new Error("Error fetching!");
      const data = (await res.json()) as Array<{
        id: number; name: string; email: string; company?: { name?: string };
      }>;
      const mapped: User[] = data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        company: { name: u.company?.name ?? "—" },
      }));
      setUsers(mapped);
    } catch {
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const query = searchText.trim().toLowerCase();
  let list = users;
  if (query) {
    list = users.filter((u) =>
      u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
    );
  }

  const filteredAndSortedUsers = [...list].sort((a, b) => {
    const aLocal = !!a.isLocal;
    const bLocal = !!b.isLocal;
    if (aLocal && !bLocal) return -1;
    if (!aLocal && bLocal) return 1;
    if (aLocal && bLocal) {
      const aTime = a.createdAt ?? 0;
      const bTime = b.createdAt ?? 0;
      return bTime - aTime;
    }

    const aVal = a[sortBy].toLowerCase();
    const bVal = b[sortBy].toLowerCase();
    const res = aVal.localeCompare(bVal);
    return sortOrder === "asc" ? res : -res;
  });

  const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage) || 1;
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const pagedUsers = filteredAndSortedUsers.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, sortBy, sortOrder]);

  const onAddUser = (event: React.FormEvent) => {
    event.preventDefault();
    const n = name.trim();
    const e = email.trim();
    if (!n || !e) return toast.error("Name and email are required");
    if (!/\S+@\S+\.\S+/.test(e)) return toast.error("Please enter a valid email");

    addUserAtTop({ name: n, email: e, company: { name: "Not set!" } });
    setName("");
    setEmail("");
    toast.success("User added!");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-6 p-4">User Management App</h1>
      <div className="w-full max-w-5xl mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <Input
            placeholder="Search by name or email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center sm:col-span-2">
          <label className="text-sm font-medium">Sort by</label>
          <select
            className="border rounded px-2 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
          </select>
          <select
            className="border rounded px-2 py-1"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>
      <form onSubmit={onAddUser} className="w-full max-w-5xl mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Input
          placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <div className="sm:col-span-1">
          <Button type="submit" className="w-full">Add User</Button>
        </div>
      </form>
      {!loading && users.length === 0 && (
        <div className="text-sm text-muted-foreground">No users to show.</div>
      )}
      {!loading && users.length > 0 && filteredAndSortedUsers.length === 0 && (
        <div className="text-sm text-muted-foreground">No users match your search.</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {pagedUsers.map(function renderUserCard(currentUser) {
          return <CardElement key={currentUser.id} user={currentUser} />;
        })}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
            {pageNumbers.map(function renderPageLink(pageNumber) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={pageNumber === currentPage}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default MainPage;
