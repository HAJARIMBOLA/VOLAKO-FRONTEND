import type { Metadata } from "next";
import Link from "next/link";
import { Tags, Plus, ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/data/categories";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
import { CategoryFormDialog } from "@/components/categories/category-form-dialog";
import { CategoryRow } from "@/components/categories/category-row";

export const metadata: Metadata = { title: "Catégories — VOLAKO" };

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/accounts" className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" />
            Retour à Compte
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Catégories</h1>
          <p className="text-sm text-muted-foreground">Classez vos revenus et dépenses.</p>
        </div>
        <CategoryFormDialog
          trigger={
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" />
                Nouvelle catégorie
              </Button>
            </DialogTrigger>
          }
        />
      </div>

      {categories.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <CategoryRow key={category.id} category={category} />
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState icon={Tags} title="Aucune catégorie" description="Créez votre première catégorie personnalisée." />
      )}
    </div>
  );
}
