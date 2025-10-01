import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUsersStore, User } from "@/lib/usersStore";
import CardElement from "@/components/pageComponents/CardElement";
import Spinner from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

type SortBy = "name" | "email";
type SortOrder = "asc" | "desc";

const MainPage = () => {
  const { users, setUsers, addUserAtTop } = useUsersStore();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(
        data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          company: { name: u.company?.name ?? "—" },
        }))
      );
    } catch {
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, sortBy, sortOrder]);

  const filteredUsers = users
    .filter(
      (u) =>
        u.name.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      const aLocal = !!a.isLocal;
      const bLocal = !!b.isLocal;
      if (aLocal !== bLocal) return aLocal ? -1 : 1;
      if (aLocal && bLocal) return (b.createdAt ?? 0) - (a.createdAt ?? 0);
      const res = a[sortBy]
        .toLowerCase()
        .localeCompare(b[sortBy].toLowerCase());
      return sortOrder === "asc" ? res : -res;
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage)
  );
  const pagedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim())
      return toast.error("Name and email required");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email");
    addUserAtTop({
      name: name.trim(),
      email: email.trim(),
      company: { name: "Not set!" },
    });
    setName("");
    setEmail("");
    toast.success("User added!");
    setCurrentPage(1);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-6">User Management App</h1>

      <div className="w-full max-w-5xl mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          placeholder="Search by name or email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="flex gap-2 items-center sm:col-span-2">
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

      <form
        onSubmit={addUser}
        className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6"
      >
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" className="w-full sm:col-span-1">
          Add User
        </Button>
      </form>

      {users.length === 0 && (
        <div className="text-sm text-muted-foreground">No users to show.</div>
      )}
      {users.length > 0 && filteredUsers.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No users match your search.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {pagedUsers.map((u) => (
          <div key={u.id} className="min-w-0">
            <CardElement user={u} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === currentPage}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
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
