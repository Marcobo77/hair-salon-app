
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";


type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType  = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

export const useEditAccounts = (id?: string) =>  {
    const queryClient = useQueryClient();

    const mutation = useMutation<
       ResponseType,
       Error,
       RequestType
    >({
        mutationFn: async (json) => {
          const response = await client.api.accounts[":id"]["$patch"]({ 
            param: { id },
            json,
           })
          return await response.json();
        },
        onSuccess: () => {
           toast.success("Account updated");
           queryClient.invalidateQueries({ queryKey: ["account", {id}]});
           queryClient.invalidateQueries({ queryKey: ["accounts"]}); 
           //TODO: invalidate Summary and transctions
        },
        onError: () => {
           toast.error("Failed to edit account");
        }
    })
    
   return mutation;

}

