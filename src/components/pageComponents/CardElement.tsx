import { User } from "@/lib/usersStore";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useUsersStore } from "@/lib/usersStore";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CardElementProps {
  user: User;
}

const CardElement = ({ user }: CardElementProps) => {
  const { updateUser, deleteUser } = useUsersStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  const openEdit = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setIsEditOpen(true);
  };

  const saveEdit = () => {
    const n = editName.trim();
    const e = editEmail.trim();
    if (!n || !e) return toast.error("Name and email are required");
    if (!/\S+@\S+\.\S+/.test(e)) return toast.error("Please enter a valid email");
    updateUser(user.id, { name: n, email: e });
    setIsEditOpen(false);
    toast.success("User updated");
  };

  const openDelete = () => {
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    deleteUser(user.id);
    setIsDeleteOpen(false);
    toast.success("User deleted");
  };

  return (
    <div>
      <Card className="p-4 hover:shadow-lg transition-shadow rounded-xl border border-gray-200">
        <CardTitle>
          <h2 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h2>
        </CardTitle>
        <CardContent className="text-gray-700 space-y-1">
          <p className="text-sm">{user.email}</p>
          <p className="text-sm font-medium">{user.company.name}</p>
        </CardContent>
        <CardFooter className="flex gap-2 mt-2">
          <Button size="sm" className="flex-1" onClick={openEdit}>
            Update
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={openDelete}>
            Delete
          </Button>
          <Link to={`/${user.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">View</Button>
          </Link>
        </CardFooter>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Input placeholder="Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <Input placeholder="Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete {user.name}?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardElement;
