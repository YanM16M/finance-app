import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from "@/lib/hono";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount = (id?: string) => {
    const QueryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"]["$delete"]({ 
                param: { id },
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account deleted")
            QueryClient.invalidateQueries({ queryKey: ["account", { id }] });
            QueryClient.invalidateQueries({ queryKey: ["accounts"] });
            QueryClient.invalidateQueries({ queryKey: ["transactions"] });
            // TODO: Invalidate summary and transactions
        },
        onError: () => {
            toast.error("Failed to delete an account")
        }
    });

    return mutation;
}