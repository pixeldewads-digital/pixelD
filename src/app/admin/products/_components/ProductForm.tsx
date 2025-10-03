"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addProduct, updateProduct } from "../_actions";
import { Product } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={product?.title || ""}
        />
        {error.title && <div className="text-destructive">{error.title}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          type="text"
          id="slug"
          name="slug"
          required
          defaultValue={product?.slug || ""}
        />
        {error.slug && <div className="text-destructive">{error.slug}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceCents">Price (in Cents)</Label>
        <Input
          type="number"
          id="priceCents"
          name="priceCents"
          required
          defaultValue={product?.priceCents || ""}
        />
        {error.priceCents && (
          <div className="text-destructive">{error.priceCents}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ""}
        />
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="coverImageUrl">Cover Image URL</Label>
        <Input
          type="url"
          id="coverImageUrl"
          name="coverImageUrl"
          required
          defaultValue={product?.coverImageUrl || ""}
        />
        {error.coverImageUrl && (
          <div className="text-destructive">{error.coverImageUrl}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="fileKey">File Key (R2/S3)</Label>
        <Input
          type="text"
          id="fileKey"
          name="fileKey"
          required
          defaultValue={product?.fileKey || ""}
        />
        {error.fileKey && <div className="text-destructive">{error.fileKey}</div>}
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={product?.category}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
              <SelectItem value="MINI_EDU">Mini Education</SelectItem>
              <SelectItem value="BALI_ITINERARY">Bali Itinerary</SelectItem>
            </SelectContent>
          </Select>
          {error.category && (
            <div className="text-destructive">{error.category}</div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="license">License</Label>
          <Select name="license" defaultValue={product?.license}>
            <SelectTrigger>
              <SelectValue placeholder="Select a license" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERSONAL">Personal</SelectItem>
              <SelectItem value="COMMERCIAL">Commercial</SelectItem>
            </SelectContent>
          </Select>
          {error.license && (
            <div className="text-destructive">{error.license}</div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={product?.status}>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="REVIEW">Review</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
            </SelectContent>
          </Select>
          {error.status && <div className="text-destructive">{error.status}</div>}
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}