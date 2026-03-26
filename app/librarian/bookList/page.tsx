/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  BookOpen,
  User,
  Hash,
  Building,
  Layers,
  Archive,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import LibrarianLayout from "../shell/page";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface Book {
  id: number;
  title: string;
  author: string;
  code: string;
  publisher: string;
  quantity: number;
  price: number;
  rack: string;
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    code: "",
    publisher: "",
    quantity: 0,
    price: 0,
    rack: "",
  });

  const [editingBook, setEditingBook] = useState<any>(null);

  // Fetch Books
  const fetchBooks = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/books");
      setBooks(res.data.data);
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);



  const filtered = books.filter(
    (b) =>
      (b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.code?.includes(search))
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <LibrarianLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Book List
            </h1>
            <p className="text-muted-foreground">
              Manage your library book inventory
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            {/* Add Book Modal */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-600 shadow-lg transition-all">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Book
                </Button>
              </DialogTrigger>

              <DialogContent className="max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 p-6 rounded-t-2xl">
                  <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="h-6 w-6" />
                    Add New Book
                  </DialogTitle>
                  <p className="text-indigo-100 text-sm mt-1">
                    Fill book details to add into library
                  </p>
                </div>

                <div className="p-6 space-y-5">

                  {/* Book Title */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-indigo-500" />
                      Book Title
                    </label>
                    <Input
                      placeholder="Enter book title"
                      value={newBook.title}
                      onChange={(e) =>
                        setNewBook({ ...newBook, title: e.target.value })
                      }
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 rounded-lg"
                    />
                  </div>

                  {/* Author */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-500" />
                      Author
                    </label>
                    <Input
                      placeholder="Enter author name"
                      value={newBook.author}
                      onChange={(e) =>
                        setNewBook({ ...newBook, author: e.target.value })
                      }
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-400 rounded-lg"
                    />
                  </div>

                  {/* ISBN */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Hash className="h-4 w-4 text-cyan-500" />
                      ISBN Code
                    </label>
                    <Input
                      placeholder="Enter ISBN code"
                      value={newBook.code}
                      onChange={(e) =>
                        setNewBook({ ...newBook, code: e.target.value })
                      }
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-cyan-400 rounded-lg"
                    />
                  </div>

                  {/* Publisher */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Building className="h-4 w-4 text-emerald-500" />
                      Publisher
                    </label>
                    <Input
                      placeholder="Enter publisher"
                      value={newBook.publisher}
                      onChange={(e) =>
                        setNewBook({ ...newBook, publisher: e.target.value })
                      }
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-400 rounded-lg"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    💰 Price (₹)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter book price"
                      value={newBook.price}
                      onChange={(e) =>
                        setNewBook({
                          ...newBook,
                          price: Number(e.target.value),
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-400 rounded-lg"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Layers className="h-4 w-4 text-orange-500" />
                      Copies
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter number of copies"
                      value={newBook.quantity}
                      onChange={(e) =>
                        setNewBook({
                          ...newBook,
                          quantity: Number(e.target.value),
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 rounded-lg"
                    />
                  </div>

                  {/* Rack */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Archive className="h-4 w-4 text-pink-500" />
                      Shelf / Rack
                    </label>
                    <Input
                      placeholder="Enter shelf/rack"
                      value={newBook.rack}
                      onChange={(e) =>
                        setNewBook({ ...newBook, rack: e.target.value })
                      }
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-pink-400 rounded-lg"
                    />
                  </div>

                </div>

                {/* Footer */}
                <DialogFooter className="p-6 border-t dark:border-gray-700">
                  <Button
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-600 text-white shadow-lg"
                    onClick={async () => {
                      await axiosInstance.post("/api/v1/books", newBook);
                      setAddOpen(false);
                      fetchBooks();
                    }}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Book
                  </Button>
                </DialogFooter>

              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}

        <Card>
          <CardContent className="p-4 flex gap-3">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </CardContent>
        </Card>

        {/* Table */}

<Card className="border border-border/40 shadow-lg rounded-2xl overflow-hidden">

  {/* Header */}
  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 p-4">
    <h2 className="text-white font-semibold text-lg flex items-center gap-2">
      <BookOpen className="h-5 w-5" />
      Library Books
    </h2>
    <p className="text-indigo-100 text-sm">
      Manage your library inventory
    </p>
  </div>

  <Table>

    <TableHeader>
      <TableRow className="bg-muted/50 hover:bg-muted/50">
        <TableHead>#</TableHead>
        <TableHead>Title</TableHead>
        <TableHead>Author</TableHead>
        <TableHead>ISBN</TableHead>
        <TableHead>Publisher</TableHead>
        <TableHead>Copies</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Shelf</TableHead>
        <TableHead className="text-right">Action</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {paginatedData.map((book, i) => (
        <TableRow
          key={book.id}
          className="hover:bg-muted/30 transition-colors"
        >

          <TableCell className="font-medium text-muted-foreground">
            {(currentPage - 1) * itemsPerPage + i + 1}
          </TableCell>

          <TableCell className="font-semibold">
            {book.title}
          </TableCell>

          <TableCell>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {book.author}
            </div>
          </TableCell>

          <TableCell>
            <Badge
              variant="secondary"
              className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
            >
              {book.code}
            </Badge>
          </TableCell>

          <TableCell>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
            >
              {book.publisher}
            </Badge>
          </TableCell>

          <TableCell>
            <Badge
              className="bg-amber-50 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
            >
              {book.quantity}
            </Badge>
          </TableCell>

          <TableCell>
            <Badge
              className={
                book.price < 5
                  ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                  : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
              }
            >
              ₹ {book.price}
            </Badge>
          </TableCell>

          <TableCell>
            <Badge
              variant="outline"
              className="bg-cyan-50 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300"
            >
              {book.rack}
            </Badge>
          </TableCell>

          <TableCell>
            <div className="flex justify-end gap-2">

              {/* Edit */}
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-indigo-100 dark:hover:bg-indigo-900"
                onClick={() => {
                  setEditingBook(book);
                  setEditOpen(true);
                }}
              >
                <Edit className="h-4 w-4 text-indigo-600" />
              </Button>

              {/* Delete */}
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-red-100 dark:hover:bg-red-900"
                onClick={async () => {
                  await axiosInstance.delete(
                    `/api/v1/books/${book.id}`
                  );
                  fetchBooks();
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>

            </div>
          </TableCell>

        </TableRow>
      ))}
    </TableBody>

  </Table>

  {/* Pagination */}

  <div className="flex items-center justify-between p-4 border-t dark:border-gray-700">

    <div className="text-sm text-muted-foreground">
      Showing {paginatedData.length} of {filtered.length} books
    </div>

    <div className="flex gap-2">

      {/* Previous */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
      >
        Previous
      </Button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, i) => (
        <Button
          key={i}
          size="sm"
          variant={currentPage === i + 1 ? "default" : "outline"}
          className={
            currentPage === i + 1
              ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white"
              : ""
          }
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </Button>
      ))}

      {/* Next */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
      >
        Next
      </Button>

    </div>

  </div>

</Card>

        {/* Edit Modal */}

<Dialog open={editOpen} onOpenChange={setEditOpen}>
  <DialogContent className="p-0 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">

    {/* Header */}
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white px-6 py-5 flex-shrink-0">
      <DialogTitle className="text-lg font-semibold flex items-center gap-2">
        📚 Edit Book
      </DialogTitle>
      <p className="text-sm opacity-90">
        Update your library book details
      </p>
    </div>

    {/* Scrollable Body */}
    <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1 bg-background">

      {editingBook && (

        <div className="bg-muted/30 border rounded-xl p-5 space-y-4">

          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">
              📘 Book Title
            </label>
            <Input
              className="rounded-lg focus-visible:ring-indigo-400"
              placeholder="Enter book title"
              value={editingBook.title}
              onChange={(e) =>
                setEditingBook({
                  ...editingBook,
                  title: e.target.value,
                })
              }
            />
          </div>

          {/* Author */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">
              ✍️ Author
            </label>
            <Input
              className="rounded-lg focus-visible:ring-indigo-400"
              placeholder="Author name"
              value={editingBook.author}
              onChange={(e) =>
                setEditingBook({
                  ...editingBook,
                  author: e.target.value,
                })
              }
            />
          </div>

          {/* Code + Publisher */}
          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                🔖 Code
              </label>
              <Input
                className="rounded-lg focus-visible:ring-indigo-400"
                value={editingBook.code}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    code: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                🏢 Publisher
              </label>
              <Input
                className="rounded-lg focus-visible:ring-indigo-400"
                value={editingBook.publisher}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    publisher: e.target.value,
                  })
                }
              />
            </div>

          </div>

          {/* Quantity + Price */}
          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                📦 Quantity
              </label>
              <Input
                type="number"
                className="rounded-lg focus-visible:ring-indigo-400"
                value={editingBook.quantity}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    quantity: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                💰 Price
              </label>
              <Input
                type="number"
                className="rounded-lg focus-visible:ring-indigo-400"
                value={editingBook.price}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    price: Number(e.target.value),
                  })
                }
              />
            </div>

          </div>

          {/* Rack */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">
              🗂 Rack Location
            </label>
            <Input
              className="rounded-lg focus-visible:ring-indigo-400"
              value={editingBook.rack}
              onChange={(e) =>
                setEditingBook({
                  ...editingBook,
                  rack: e.target.value,
                })
              }
            />
          </div>

        </div>

      )}

    </div>

    {/* Footer */}
    <DialogFooter className="px-6 py-4 bg-muted/30 flex justify-between flex-shrink-0">

      <Button
        variant="outline"
        className="rounded-lg"
        onClick={() => setEditOpen(false)}
      >
        Cancel
      </Button>

      <Button
        className="rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md hover:shadow-lg"
        onClick={async () => {
          await axiosInstance.put(
            `/api/v1/books/${editingBook.id}`,
            editingBook
          );
          setEditOpen(false);
          fetchBooks();
        }}
      >
        💾 Save Changes
      </Button>

    </DialogFooter>

  </DialogContent>
</Dialog>

      </div>
    </LibrarianLayout>
  );
}