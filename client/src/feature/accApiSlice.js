import { apiSlice } from "./apiSlice";

export const accApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder)=>({
        createAcc : builder.mutation({
            query : (data)=>({
                url : `acc/${data.customer_id}`,
                method : 'POST',
                body : data
            })
        }),
        setresetPin : builder.mutation({
            query : (data)=>({
                url : `pin/${data.customer_id}`,
                method : 'POST',
                body : data
            })
        }),
        getBal : builder.mutation({
            query : (data)=>({
                url : `acc/${data.customer_id}`,
                method : 'GET'
            })
        })
    })
})

export const {useCreateAccMutation,useSetresetPinMutation,useGetBalMutation} = accApiSlice