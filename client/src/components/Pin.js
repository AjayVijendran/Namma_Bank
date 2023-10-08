import React, { useState } from 'react';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { useSetresetPinMutation } from '../feature/accApiSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function PINPage() {
  const [mode, setMode] = useState('set'); // 'set' or 'reset'
  const [existingPin, setExistingPin] = useState(null);
  const [newPin, setNewPin] = useState('');
  const [setresetPin] = useSetresetPinMutation();
  const navigate = useNavigate();
  const {userInfo} = useSelector((state)=>state.user)
  const handleModeToggle = () => {
    // Toggle between 'set' and 'reset' modes
    setMode((prevMode) => (prevMode === 'set' ? 'reset' : 'set'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission based on the mode ('set' or 'reset')
    const data = {'customer_id':userInfo.customer_id,'pin':newPin,'exispin':existingPin}
    try {
        const res = await setresetPin(data).unwrap()
        toast.success('Created New Pin Successfully')
        navigate('/home')
    } catch (error) {
        toast.error(error?.data?.message||"Something went wrong , Try again")
    }
} 

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px' }}>
        <Typography variant="h5">{mode === 'set' ? 'Set PIN' : 'Reset PIN'}</Typography>
        <form onSubmit={handleSubmit}>
          {mode === 'reset' && (
            <TextField
              label="Enter Existing PIN"
              fullWidth
              margin="normal"
              variant="outlined"
              type="password"
              value={existingPin}
              onChange={(e) => setExistingPin(e.target.value)}
            />
          )}
          <TextField
            label={mode === 'set' ? 'Enter PIN' : 'Set New PIN'}
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {mode === 'set' ? 'Set PIN' : 'Reset PIN'}
          </Button>
        </form>
        <Button onClick={handleModeToggle} fullWidth>
          {mode === 'set' ? 'Switch to Reset PIN' : 'Switch to Set PIN'}
        </Button>
      </Paper>
    </div>
  );
}

export default PINPage;
