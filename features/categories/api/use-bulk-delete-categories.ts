import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteCategories = () => {
    const QueryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories["bulk-delete"]["$post"]({json});
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Categories deleted")
            QueryClient.invalidateQueries({ queryKey: ["categories"] });
            // TODO: Also Invalidate summary
        },
        onError: () => {
            toast.error("Failed to delete categories")
        }
    });

    return mutation;
}