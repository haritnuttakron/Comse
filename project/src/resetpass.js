import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useEffect } from 'react';

function Resetpass() {
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    useEffect(() => {
        const token = localStorage.getItem('token')
        console.log(token);
        fetch("http://localhost:5000/authenreset", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'AUthorization':'Bearer '+token
            }
          })
            .then(response =>response.json())
            .then(data => {
              if (data.status !== 'ok') {
                MySwal.fire({
                  html: <i>{data.message}</i>,
                  icon: 'error'
                }).then((value) => {
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('recovery');
                    navigate('/')
                  })
      
              }
            })
    },[])
    const [inputs, setInputs] = useState({});
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

  const handleSubmit = (event) => {
    event.preventDefault();
      const data = new FormData(event.currentTarget);
      const newpassword = data.get('Newpassword');
      const confirmpassword = data.get('Confirmpassword');
      if ( !newpassword) {
        MySwal.fire({
          html: <i>Please enter your new Password</i>,
          icon: 'error'
        });
        return;
      }
      if (newpassword.length <= 7) {
        MySwal.fire({
          html: <i>Password must be at least 8 characters long.</i>,
          icon: 'error',
        });
        return;
      }
          // ตรวจสอบว่ารหัสผ่านมีตัวอักษรพิมพ์ใหญ่และตัวอักษรพิมพ์เล็ก
      if (!/[a-z]/.test(newpassword) || !/[A-Z]/.test(newpassword)) {
        MySwal.fire({
          html: <i>Password must contain both uppercase and lowercase letters.</i>,
          icon: 'error',
        });
        return;
      }
      if ( !confirmpassword) {
        MySwal.fire({
          html: <i>Please confirm your Password</i>,
          icon: 'error'
        });
        return;
      }
      if (newpassword !==confirmpassword) {
        MySwal.fire({
          html: <i>Please confirm your password as the same as new password</i>,
          icon: 'error'
        });
        return;
      }
      const jsonData = {
          newpassword:newpassword
      }
      const token = localStorage.getItem('token')
      fetch("http://localhost:5000/resetpass", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'AUthorization':'Bearer '+ token
        },
        body: JSON.stringify(jsonData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'ok') {
            MySwal.fire({
              html: <i>{data.message}</i>,
              icon: 'success'
            }).then((value) => {
              localStorage.removeItem('token');
              sessionStorage.removeItem('recovery');
              navigate('/')
            })
          } else {
            MySwal.fire({
              html: <i>{data.message}</i>,
              icon: 'error'
            })
  
          }
        })
        .catch(error => console.log('error', error));
  }
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
          Enter your new Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>  
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="Newpassword"
                  label="Your New Password"
                  type="password"
                  id="password"
                  value={inputs.Newpassword || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="Confirmpassword"
                  label="Confirm Password"
                  type="password"
                  id="password"
                  value={inputs.Confirmpassword || ""}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
            Confirm
            </Button>
          </Box>
        </Box>
      </Container>
  </div>
)
}

export default Resetpass