import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;

export const useDeleteTransaction = (id?: string) => {
    const QueryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions[":id"]["$delete"]({ 
                param: { id },
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transaction deleted")
            QueryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
            QueryClient.invalidateQueries({ queryKey: ["transactions"] });
            // TODO: Invalidate summary
        },
        onError: () => {
            toast.error("Failed to delete an transaction")
        }
    });

    return mutation;
}