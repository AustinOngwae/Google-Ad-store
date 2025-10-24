import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ad } from "@/types";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { showError, showSuccess } from "@/utils/toast";
import { PlusCircle, MoreHorizontal, Trash2, Edit } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

const adFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  cta_text: z.string().min(1, "CTA text is required"),
  cta_url: z.string().url("Must be a valid URL"),
});

type AdFormValues = z.infer<typeof adFormSchema>;

export const AdManager = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      cta_text: "",
      cta_url: "",
    },
  });

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    if (editingAd) {
      form.reset(editingAd);
    } else {
      form.reset({
        title: "",
        description: "",
        image_url: "",
        cta_text: "",
        cta_url: "",
      });
    }
  }, [editingAd, form]);

  const fetchAds = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("ads").select("*").order("created_at", { ascending: false });
    if (error) {
      showError("Failed to fetch ads.");
      console.error(error);
    } else {
      setAds(data);
    }
    setLoading(false);
  };

  const onSubmit = async (values: AdFormValues) => {
    try {
      if (editingAd) {
        // Update
        const { error } = await supabase.from("ads").update(values).eq("id", editingAd.id);
        if (error) throw error;
        showSuccess("Ad updated successfully!");
      } else {
        // Create
        const { error } = await supabase.from("ads").insert(values);
        if (error) throw error;
        showSuccess("Ad created successfully!");
      }
      setIsDialogOpen(false);
      setEditingAd(null);
      fetchAds();
    } catch (error) {
      showError("Failed to save ad.");
      console.error(error);
    }
  };

  const handleDelete = async (adId: string) => {
    try {
      const { error } = await supabase.from("ads").delete().eq("id", adId);
      if (error) throw error;
      showSuccess("Ad deleted successfully!");
      fetchAds();
    } catch (error) {
      showError("Failed to delete ad.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAd(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Ad
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingAd ? "Edit Ad" : "Add New Ad"}</DialogTitle>
              <DialogDescription>
                {editingAd ? "Update the details of the ad." : "Fill in the details for the new ad."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register("title")} />
                {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register("description")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input id="image_url" {...form.register("image_url")} />
                 {form.formState.errors.image_url && <p className="text-sm text-destructive">{form.formState.errors.image_url.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta_text">CTA Text</Label>
                <Input id="cta_text" {...form.register("cta_text")} />
                 {form.formState.errors.cta_text && <p className="text-sm text-destructive">{form.formState.errors.cta_text.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta_url">CTA URL</Label>
                <Input id="cta_url" {...form.register("cta_url")} />
                 {form.formState.errors.cta_url && <p className="text-sm text-destructive">{form.formState.errors.cta_url.message}</p>}
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>CTA Text</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>
          ) : (
            ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell className="font-medium">{ad.title}</TableCell>
                <TableCell>{ad.cta_text}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setEditingAd(ad); setIsDialogOpen(true); }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the ad.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(ad.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};