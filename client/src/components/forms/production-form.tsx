import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from "@shared/schema";

const productionFormSchema = z.object({
  productId: z.number().min(1, "Product is required"),
  quantityKg: z.string().min(1, "Quantity is required"),
  date: z.string().min(1, "Date is required"),
});

type ProductionFormData = z.infer<typeof productionFormSchema>;

interface ProductionFormProps {
  products: Product[];
  onSubmit: (data: ProductionFormData) => void;
  isLoading: boolean;
  defaultValues?: Partial<ProductionFormData>;
}

export default function ProductionForm({ products, onSubmit, isLoading, defaultValues }: ProductionFormProps) {
  const form = useForm<ProductionFormData>({
    resolver: zodResolver(productionFormSchema),
    defaultValues: {
      productId: defaultValues?.productId || 0,
      quantityKg: defaultValues?.quantityKg || "",
      date: defaultValues?.date || new Date().toISOString().split('T')[0],
    },
  });

  const handleSubmit = (data: ProductionFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" data-testid="production-form">
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger data-testid="select-production-product">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantityKg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity (KG)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.001"
                  placeholder="e.g., 2.5"
                  {...field}
                  data-testid="input-production-quantity"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} data-testid="input-production-date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="outline" className="flex-1" data-testid="button-cancel-production">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading} data-testid="button-save-production">
            {isLoading ? "Saving..." : "Save Record"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
