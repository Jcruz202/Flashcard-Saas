'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography, Paper } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation"
import { POST } from "./api/checkout_session/route";
import InputIcon from '@mui/icons-material/Input';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import { useState } from 'react';
import Fade from '@mui/material/Fade';

export default function Home() {
  const router = useRouter()
  const [fadeOut, setFadeOut] = useState(false);


  const handleGenerate = () => {
      router.push('/generate')
  }

  const handleMyFlashcards = () =>{
      router.push('/flashcards')
  }

  const handleSubmit = async () =>{
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'https://study-buddy-sandy.vercel.app/'
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if (error){
      console.warn(error.message)
    }
  }
  return (
    <Container maxWidth="100vw" sx={{ backgroundColor: '#dad7cd', minHeight: '100vh' }} disableGutters>
      <Fade in={!fadeOut} timeout={500}>
        <div>
      <Head>
        <title>Study Buddy</title>
        <meta name="description" contents= "Create flashcard form your text" />
      </Head>
      <AppBar position="static" sx={{ backgroundColor: '#588157'}}>
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>Study Buddy</Typography>
          <SignedIn>
            <Button variant="h4" onClick={() => {handleMyFlashcards()}}>My FlashCards</Button>
          </SignedIn>
          <SignedOut>
            <Button color = "inherit" href="/sign-in">Login</Button>
            <Button color = "inherit" href="/sign-up">Sign up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{paddingLeft: 3, paddingRight: 3}}>
      <Box sx={{textAlign:'center', my: 4,}}>
        <Typography variant="h2" gutterBottom>Welcome to Study Buddy</Typography>
        <Typography variant="h5" gutterBottom>
          {''}
          Unlock your learning potential with Study Buddy. Our innovative flashcard system transforms studying into an effortless and enjoyable experience. 
          Boost your memory, ace your exams, and master new skills—all at your own pace. Start your journey to effortless learning today. 
          Try Study Buddy for free and revolutionize the way you learn.
        </Typography>
        <Button variant="contained" sx={{mt:2, backgroundColor: '#344e41' , '&:hover': {backgroundColor: '#a3b18a',},}} onClick={() => {handleGenerate()}}>Get Started</Button>
      </Box>
      {/* -------------------------------------------------------------- */}
      <Box sx={{my: 6}}>
        <Typography variant="h4" align="center" sx={{mb:5, mt: 10}}>Features</Typography>
        <Grid container spacing={4}>
          {['Easy Text Input', 'Smart FlashCards', 'Accessible anywhere'].map((title, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box
                sx={{
                  backgroundColor: '#f1faee',
                  border: '1px solid',
                  borderColor: 'black',
                  borderRadius: 2,
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  }
                }}
              >
                <Typography variant="h6" gutterBottom>{title}</Typography>
                <Typography>
                  {index === 0 && 'Simply input your text and let AI do the rest. Study with no sweat.'}
                  {index === 1 && 'Our AI intelligently breaks down your text into concise flashcards, perfect for studying.'}
                  {index === 2 && 'Access your flashcards from any device, at any time. Study on the go with ease.'}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* -------------------------------------------------------------- */}
      <Box sx={{ my: 8 }}>
  <Typography variant="h4" align="center" sx={{ mb: 6 }}>How it works</Typography>
  <Grid container spacing={4} justifyContent="center">
    {[
      { icon: <InputIcon fontSize="large" />, text: "Input a topic" },
      { icon: <AutoAwesomeIcon fontSize="large" />, text: "AI will generate 12 flashcards" },
      { icon: <SchoolIcon fontSize="large" />, text: "Learn and save flashcards" }
    ].map((step, index) => (
      <Grid item xs={12} sm={4} key={index}>
        <Paper elevation={3} sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: '#f1faee',
        }}>
          <Box sx={{ mb: 2, color: '#344e41' }}>{step.icon}</Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Step {index + 1}</Typography>
          <Typography>{step.text}</Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
</Box>
      {/* -------------------------------------------------------------- */}
      <Box sx={{my: 6, textAlign:'center'}}>
      <Typography variant = "h4" gutterBottom sx={{mb:2}}>Upgrade</Typography>
      <Grid container spacing = {4} justifyContent="center" alignItems="center">
          <Grid item xs = {12} md = {6}> 
          <Box
                sx={{
                  backgroundColor: '#a3b18a',
                  border: '1px solid',
                  borderColor: 'black',
                  borderRadius: 2,
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  }
                }}
              >
            <Typography variant="h5" gutterBottom>Pro</Typography>
            <Typography variant="h6" gutterBottom>$5 / month</Typography>
            <Typography>
              {''}
              Unlimited flashcards and storage, with priority support.</Typography>
              <Button variant="contained" color="primary" sx={{mt: 2, backgroundColor: '#344e41', '&:hover': {backgroundColor: '#a3b18a',},}} onClick={handleSubmit}>Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      </Box>
      </div>
      </Fade>
      {/* -------------------------------------------------------------- */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#588157',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2024 Study Buddy
        </Typography>
      </Box>
      
    </Container>
  )
}
