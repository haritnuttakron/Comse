import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');

function Forgotpass() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    let transporter = nodemailer.createTransport({
        host: 'gmail',
        service: 'Gmail',
        auth: {
            user: 'rerollsave01@gmail.com',
            pass: 'p@ss!007',
        },
    });
    // รายละเอียดอีเมล
    var otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    transporter.sendMail({
        from: 'Customer Service <rerollsave01@gmail.com>',  // ผู้ส่ง
        to: "<"+email+">",                                          // ผู้รับ
        subject: "Reset Password",                          // หัวข้อ
        text: "your otp is: "+otp,                          // ข้อความ
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info.messageId);
        }
    });
    const jsonData = {
        email: email
      };
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
          Forgotpass
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={inputs.email || ""} 
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
              ส่ง Otp
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Remember? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  )
}

export default Forgotpass