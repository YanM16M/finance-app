import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteAccounts = () => {
    const QueryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({json});
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Accounts deleted")
            QueryClient.invalidateQueries({ queryKey: ["accounts"] });
            QueryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: () => {
            toast.error("Failed to delete accounts")
        }
    });

    return mutation;
}