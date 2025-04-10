import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
}

interface UserDetailsDrawerProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function UserDetailsDrawer({
  user,
  isOpen,
  onClose,
  onUpdate,
}: UserDetailsDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  if (!user) return null;

  const handleEdit = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("User details updated successfully");
        setIsEditing(false);
        onUpdate();
      } else {
        toast.error(data.message || "Failed to update user details");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("Failed to update user details");
    }
  };

  const handleCancel = () => {
    setFormData({});
    setIsEditing(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>User Details</DrawerTitle>
            <DrawerDescription>
              View and manage user information
            </DrawerDescription>
          </DrawerHeader>

          <div className="grid gap-4 py-4 px-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{user.name}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{user.email}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{user.phoneNumber}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              {isEditing ? (
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm capitalize">{user.role}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Created At</Label>
              <p className="text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <DrawerFooter>
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleEdit}>Edit Details</Button>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 