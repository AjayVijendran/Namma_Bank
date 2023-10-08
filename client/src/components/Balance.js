import React from 'react';
import { Dialog, DialogContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BalancePopup = ({ balance, accountNumber }) => {
  const navigate = useNavigate()
  return (
    <div>
      <Dialog open = {true} onClose={()=>navigate('/home')}>
        <DialogContent>
          <Typography variant="h6">Account Balance:</Typography>
          <Typography variant="body1">${balance}</Typography>
          <Typography variant="h6">Account Number:</Typography>
          <Typography variant="body1">{accountNumber}</Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BalancePopup;
