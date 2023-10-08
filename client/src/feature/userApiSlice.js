
import { apiSlice } from "./apiSlice";

export const userApiSlice  = apiSlice.injectEndpoints({
    endpoints : (builder)=>({
        login : builder.mutation({
            query : (data)=>({
                url : 'login',
                method : 'POST',
                body : data
            })
        }),
        getData  :builder.mutation({
            query : (data)=>({
                url : `cust/${data}`,
                method : 'GET'
            })
        }),
        register : builder.mutation({
            query : (data)=>({
                url : 'register',
                method : 'POST',
                body  : data
            })
        }),
        updateUData : builder.mutation({
            query : (data)=> ({
                url : `cust/${data.customer_id}`,
                method : 'PUT',
                body : data
            })
        })
    })
})

export const {useLoginMutation,useGetDataMutation,useRegisterMutation,useUpdateUDataMutation} = userApiSlice