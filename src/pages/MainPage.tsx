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
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const loadUsersFromApi = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) throw new Error("Failed to fetch!");
      const data = await res.json();
      const mapped: User[] = data.map((u: any) => ({
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

  useEffect(() => {
    try {
      const raw = localStorage.getItem("users-store");
      const persisted = raw ? JSON.parse(raw) : null;
      const persistedUsers: User[] = persisted?.state?.users ?? [];
      const hasUsers = useUsersStore.getState().users.length > 0 || persistedUsers.length > 0;
      if (!hasUsers) void loadUsersFromApi();
    } catch {
      if (useUsersStore.getState().users.length === 0) void loadUsersFromApi();
    }
  }, []);

  const query = searchText.trim().toLowerCase();
  let filteredUsers = users;
  if (query) {
    filteredUsers = users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
  }

  const sortedUsers = [...filteredUsers].sort((a, b) => {
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
    return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage) || 1;
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const pagedUsers = sortedUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, sortBy, sortOrder]);

  const onAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const eMail = email.trim();
    if (!n || !eMail) return toast.error("Name and email are required");
    if (!/\S+@\S+\.\S+/.test(eMail)) return toast.error("Enter a valid email");

    addUserAtTop({ name: n, email: eMail, company: { name: "Not set!" } });
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
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-6">User Management App</h1>

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

      <form
        onSubmit={onAddUser}
        className="w-full max-w-5xl mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3"
      >
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="sm:col-span-1">
          <Button type="submit" className="w-full">
            Add User
          </Button>
        </div>
      </form>

      {!loading && users.length === 0 && (
        <div className="text-sm text-muted-foreground">No users to show.</div>
      )}
      {!loading && users.length > 0 && sortedUsers.length === 0 && (
        <div className="text-sm text-muted-foreground">No users match your search.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {pagedUsers.map((user) => (
          <CardElement key={user.id} user={user} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
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
