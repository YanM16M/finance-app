import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"];

export const useEditCategory = (id?: string) => {
    const QueryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"]["$patch"]({ 
                param: { id },
                json,
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Category updated")
            QueryClient.invalidateQueries({ queryKey: ["category", { id }] });
            QueryClient.invalidateQueries({ queryKey: ["categories"] });
            QueryClient.invalidateQueries({ queryKey: ["transactions"] });
            QueryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: () => {
            toast.error("Failed to edit an category")
        }
    });

    return mutation;
}