import React, { useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import {makeStyles} from '@mui/styles';
import { useCreateAccMutation } from '../feature/accApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addAccData } from '../feature/accSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
    formContainer: {
      display : 'flex',
      flexDirection : 'column',
      justifyContent : 'end',
      alignItems : 'center'
    },
  }));
const AccountCreationForm = ()=> {
  const [accountType, setAccountType] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [createAcc] = useCreateAccMutation();
  const {userInfo} = useSelector((state)=>state.user)
  const dispatch  = useDispatch();
  const handleAccountTypeChange = (event) => {
    setAccountType(event.target.value);
  };
  const navigate = useNavigate();

  const handleInitialDepositChange = (event) => {
    setInitialDeposit(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission, e.g., send data to a server
    const data = {'balance':initialDeposit,'acc_type':accountType,'customer_id':userInfo.customer_id}
    try{
        const res = await createAcc(data).unwrap()
        dispatch(addAccData(res))
        toast.success('Account created Successfully')
        navigate('/home')
    }catch(e){
        toast.error(e?.data?.message||"Sorry something went wrong")
    }

  };
  const classes = useStyles();

  return (
    <div className={classes.formContainer}>
      <Typography variant="h5">Account Creation</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <InputLabel>Account Type</InputLabel>
          <Select
            value={accountType}
            onChange={handleAccountTypeChange}
          >
            <MenuItem value="savings">Savings Account</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Initial Deposit"
          type="number"
          value={initialDeposit}
          onChange={handleInitialDepositChange}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Create Account
        </Button>
      </form>
    </div>
  );
}

export default AccountCreationForm;