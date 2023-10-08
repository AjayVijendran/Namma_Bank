import React, { useState } from 'react';
import {
  Container,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateUDataMutation } from '../feature/userApiSlice';
import { updateData } from '../feature/userSlice';
import { toast } from 'react-toastify';
const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const {userInfo} = useSelector((state)=>state.user)
  const [userData, setUserData] = useState({...userInfo});
  const dispatch = useDispatch();
  const [updateUData] = useUpdateUDataMutation();
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleSave = async() => {
    try{
        const res = await updateUData(userData).unwrap()
        dispatch(updateData(res))
        toast.success("Data successfully updated")
    }
    catch(e){
        toast.error("Data cannot be saved")
    }
    toggleEditMode();
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4">Profile Details</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Customer ID</Typography>
            {isEditing ? (
              <TextField
                label="Customer ID"
                fullWidth
                value={userData.customer_id}
                variant="outlined"
                onChange={(e) => handleFieldChange('customer_id', e.target.value)}
              />
            ) : (
              <Typography variant="body1">{userData.customer_id}</Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Name</Typography>
            {isEditing ? (
              <TextField
                label="Name"
                fullWidth
                value={userData.name}
                variant="outlined"
                onChange={(e) => handleFieldChange('name', e.target.value)}
              />
            ) : (
              <Typography variant="body1">{userData.name}</Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Email</Typography>
            {isEditing ? (
              <TextField
                label="Email"
                fullWidth
                value={userData.email}
                variant="outlined"
                onChange={(e) => handleFieldChange('email', e.target.value)}
              />
            ) : (
              <Typography variant="body1">{userData.email}</Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Age</Typography>
            {isEditing ? (
              <TextField
                label="Age"
                fullWidth
                value={userData.age}
                variant="outlined"
                onChange={(e) => handleFieldChange('age', e.target.value)}
              />
            ) : (
              <Typography variant="body1">{userData.age}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Address</Typography>
            {isEditing ? (
              <TextField
                label="Address"
                fullWidth
                value={userData.address}
                variant="outlined"
                onChange={(e) => handleFieldChange('address', e.target.value)}
              />
            ) : (
              <Typography variant="body1">{userData.address}</Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Phone Number</Typography>
            {isEditing ? (
              <TextField
                label="Phone Number"
                fullWidth
                value={userData.phone_no}
                variant="outlined"
                onChange={(e) => handleFieldChange('phone_no', e.target.value)}
              />
            ) : (
              <Typography variant="body1">{userData.phone_no}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            {isEditing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={toggleEditMode}
              >
                Edit Profile
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
